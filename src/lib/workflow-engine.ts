import { db } from './db';
import { FlowDefinition, FlowNode } from '@/types/flow';

export class WorkflowEngine {
  async executeFlowStep(
    requestId: string,
    action: string,
    data?: any,
    userId?: string
  ): Promise<void> {
    try {
      const request = await db.request.findUnique({
        where: { id: requestId },
        include: { requestType: true }
      });

      if (!request) {
        throw new Error('Request not found');
      }

      const flowDefinition: FlowDefinition = JSON.parse(request.requestType.flowDefinition);
      const currentNode = flowDefinition.nodes.find(node => node.id === request.currentStep);

      if (!currentNode) {
        throw new Error('Current step not found in flow');
      }

      // Log the action
      await this.logAction(requestId, userId, action, data);

      // Process based on current node type
      switch (currentNode.type) {
        case 'form':
          await this.processFormStep(request, currentNode, data, flowDefinition);
          break;
        case 'decision':
          await this.processDecisionStep(request, currentNode, data, flowDefinition);
          break;
        case 'approval':
          await this.processApprovalStep(request, currentNode, data, userId, flowDefinition);
          break;
        case 'end':
          await this.processEndStep(request);
          break;
        default:
          throw new Error(`Unknown node type: ${currentNode.type}`);
      }
    } catch (error) {
      console.error('Workflow execution error:', error);
      throw error;
    }
  }

  private async processFormStep(
    request: any,
    node: FlowNode,
    data: any,
    flow: FlowDefinition
  ): Promise<void> {
    try {
      // Save form data
      if (data && data.headerData) {
        for (const [fieldName, fieldValue] of Object.entries(data.headerData)) {
          await db.requestData.create({
            data: {
              requestId: request.id,
              dataType: 'header',
              fieldName,
              fieldValue: JSON.stringify(fieldValue),
            },
          });
        }
      }

      if (data && data.detailData && Array.isArray(data.detailData)) {
        data.detailData.forEach(async (row: any, index: number) => {
          for (const [fieldName, fieldValue] of Object.entries(row)) {
            await db.requestData.create({
              data: {
                requestId: request.id,
                dataType: 'detail',
                fieldName,
                fieldValue: JSON.stringify(fieldValue),
                rowIndex: index,
              },
            });
          }
        });
      }

      // Move to next step
      const nextNode = this.getNextNode(flow, node.id);
      if (nextNode) {
        await db.request.update({
          where: { id: request.id },
          data: {
            currentStep: nextNode.id,
            status: 'in_progress',
          },
        });

        // If next node is approval, create tasks
        if (nextNode.type === 'approval') {
          await this.createApprovalTasks(request, nextNode);
        }
      }
    } catch (error) {
      console.error('Form step processing error:', error);
      throw error;
    }
  }

  private async processDecisionStep(
    request: any,
    node: FlowNode,
    data: any,
    flow: FlowDefinition
  ): Promise<void> {
    try {
      const config = node.data.config;
      if (!config || !config.conditions) {
        // Move to next node if no conditions
        const nextNode = this.getNextNode(flow, node.id);
        if (nextNode) {
          await db.request.update({
            where: { id: request.id },
            data: {
              currentStep: nextNode.id,
            },
          });
        }
        return;
      }

      // Get form data for evaluation
      const formData = await this.getFormData(request.id);
      
      // Simple condition evaluation - use first condition by default
      let nextNodeId = config.defaultTarget || this.getNextNode(flow, node.id)?.id;
      
      if (config.conditions && config.conditions.length > 0) {
        // For now, just use the first condition
        nextNodeId = config.conditions[0].target;
      }

      const nextNode = flow.nodes.find(n => n.id === nextNodeId);
      if (nextNode) {
        await db.request.update({
          where: { id: request.id },
          data: {
            currentStep: nextNode.id,
          },
        });

        // If next node is approval, create tasks
        if (nextNode.type === 'approval') {
          await this.createApprovalTasks(request, nextNode);
        }
      }
    } catch (error) {
      console.error('Decision step processing error:', error);
      throw error;
    }
  }

  private async processApprovalStep(
    request: any,
    node: FlowNode,
    data: any,
    userId: string | undefined,
    flow: FlowDefinition
  ): Promise<void> {
    try {
      if (!userId) {
        throw new Error('User ID required for approval action');
      }

      // Find the task for this user
      const task = await db.task.findFirst({
        where: {
          requestId: request.id,
          assignedTo: userId,
          status: 'pending',
        },
      });

      if (!task) {
        throw new Error('No pending task found for user');
      }

      // Update task
      const action = data && data.action ? data.action : 'approve'; // 'approve' or 'reject'
      await db.task.update({
        where: { id: task.id },
        data: {
          status: action === 'approve' ? 'approved' : 'rejected',
          completedAt: new Date(),
        },
      });

      // Check if all required approvals are completed
      const config = node.data.config;
      const requiredApprovals = config && config.requiredApprovals ? config.requiredApprovals : 1;
      
      const allTasks = await db.task.findMany({
        where: {
          requestId: request.id,
          taskType: 'approval',
        },
      });

      const approvedCount = allTasks.filter(t => t.status === 'approved').length;
      const rejectedCount = allTasks.filter(t => t.status === 'rejected').length;

      if (rejectedCount > 0) {
        // Move to end if any rejection
        const endNode = flow.nodes.find(n => n.type === 'end');
        if (endNode) {
          await db.request.update({
            where: { id: request.id },
            data: {
              currentStep: endNode.id,
              status: 'rejected',
            },
          });
        }
      } else if (approvedCount >= requiredApprovals) {
        // Move to next step if enough approvals
        const nextNode = this.getNextNode(flow, node.id);
        if (nextNode) {
          await db.request.update({
            where: { id: request.id },
            data: {
              currentStep: nextNode.id,
            },
          });

          if (nextNode.type === 'end') {
            await db.request.update({
              where: { id: request.id },
              data: {
                status: 'approved',
              },
            });
          }
        }
      }
    } catch (error) {
      console.error('Approval step processing error:', error);
      throw error;
    }
  }

  private async processEndStep(request: any): Promise<void> {
    try {
      await db.request.update({
        where: { id: request.id },
        data: {
          status: 'completed',
        },
      });
    } catch (error) {
      console.error('End step processing error:', error);
      throw error;
    }
  }

  private async createApprovalTasks(request: any, node: FlowNode): Promise<void> {
    try {
      const config = node.data.config;
      if (!config || !config.assignees) {
        // Create a default task for the request creator
        await db.task.create({
          data: {
            requestId: request.id,
            assignedTo: request.createdBy,
            taskType: 'approval',
            title: config.title || 'Approval Required',
            description: config.description,
            status: 'pending',
          },
        });
        return;
      }

      for (const assigneeEmail of config.assignees) {
        // Find user by email
        try {
          const user = await db.user.findUnique({
            where: { email: assigneeEmail },
          });

          if (user) {
            await db.task.create({
              data: {
                requestId: request.id,
                assignedTo: user.id,
                taskType: 'approval',
                title: config.title || 'Approval Required',
                description: config.description,
                status: 'pending',
              },
            });
          }
        } catch (userError) {
          console.log(`User not found for email: ${assigneeEmail}`);
        }
      }
    } catch (error) {
      console.error('Task creation error:', error);
      throw error;
    }
  }

  private getNextNode(flow: FlowDefinition, currentNodeId: string): FlowNode | null {
    const edge = flow.edges.find(e => e.source === currentNodeId);
    if (!edge) return null;

    return flow.nodes.find(n => n.id === edge.target) || null;
  }

  private async getFormData(requestId: string): Promise<any> {
    try {
      const requestData = await db.requestData.findMany({
        where: { requestId },
      });

      const formData: any = {};
      requestData.forEach(item => {
        const key = item.dataType === 'detail' 
          ? `${item.fieldName}_${item.rowIndex}` 
          : item.fieldName;
        try {
          formData[key] = JSON.parse(item.fieldValue);
        } catch {
          formData[key] = item.fieldValue;
        }
      });

      return formData;
    } catch (error) {
      console.error('Error getting form data:', error);
      return {};
    }
  }

  private async logAction(
    requestId: string,
    userId: string | undefined,
    action: string,
    data?: any
  ): Promise<void> {
    try {
      await db.auditLog.create({
        data: {
          requestId,
          userId: userId || 'system',
          action,
          description: `Action: ${action}`,
          metadata: data ? JSON.stringify(data) : null,
        },
      });
    } catch (error) {
      console.error('Error logging action:', error);
      // Don't throw error for logging failures
    }
  }

  async startFlow(requestTypeId: string, title: string, userId: string): Promise<string> {
    try {
      const requestType = await db.requestType.findUnique({
        where: { id: requestTypeId },
      });

      if (!requestType) {
        throw new Error('Request type not found');
      }

      const flowDefinition: FlowDefinition = JSON.parse(requestType.flowDefinition);
      const startNode = flowDefinition.nodes.find(n => n.type === 'start');

      if (!startNode) {
        throw new Error('Flow must have a start node');
      }

      const request = await db.request.create({
        data: {
          requestTypeId,
          title,
          createdBy: userId,
          currentStep: startNode.id,
          status: 'draft',
        },
      });

      // Log creation
      await this.logAction(request.id, userId, 'created', { title });

      return request.id;
    } catch (error) {
      console.error('Error starting flow:', error);
      throw error;
    }
  }
}