export const workflowTemplates = [
  {
    id: 'it-support',
    name: 'IT Support Request',
    description: 'Technical support and IT service requests',
    category: 'IT',
    estimatedDuration: '2-3 days',
    steps: [
      {
        id: 'submit',
        name: 'Submit Request',
        description: 'Fill out the support request form',
        type: 'form',
        requiredFields: ['title', 'description', 'priority', 'category'],
        assigneeRole: 'user'
      },
      {
        id: 'review',
        name: 'IT Review',
        description: 'IT team reviews the request',
        type: 'approval',
        assigneeRole: 'it_support',
        possibleActions: ['approve', 'reject', 'request_more_info']
      },
      {
        id: 'implement',
        name: 'Implementation',
        description: 'Implement the solution',
        type: 'task',
        assigneeRole: 'it_support',
        estimatedDuration: '1-2 days'
      },
      {
        id: 'verify',
        name: 'Verification',
        description: 'User verifies the solution',
        type: 'approval',
        assigneeRole: 'user',
        possibleActions: ['approve', 'reject']
      },
      {
        id: 'close',
        name: 'Close Request',
        description: 'Request completed and closed',
        type: 'automated',
        assigneeRole: 'system'
      }
    ]
  },
  {
    id: 'purchase-approval',
    name: 'Purchase Approval',
    description: 'Equipment and material purchase requests',
    category: 'Procurement',
    estimatedDuration: '5-7 days',
    steps: [
      {
        id: 'submit',
        name: 'Submit Purchase Request',
        description: 'Fill out purchase request details',
        type: 'form',
        requiredFields: ['item', 'quantity', 'budget_code', 'justification'],
        assigneeRole: 'user'
      },
      {
        id: 'manager-approval',
        name: 'Manager Approval',
        description: 'Direct manager approves the request',
        type: 'approval',
        assigneeRole: 'manager',
        possibleActions: ['approve', 'reject']
      },
      {
        id: 'finance-review',
        name: 'Finance Review',
        description: 'Finance team reviews budget availability',
        type: 'approval',
        assigneeRole: 'finance',
        possibleActions: ['approve', 'reject']
      },
      {
        id: 'procurement',
        name: 'Procurement Process',
        description: 'Procurement team handles the purchase',
        type: 'task',
        assigneeRole: 'procurement',
        estimatedDuration: '3-4 days'
      },
      {
        id: 'delivery',
        name: 'Delivery & Receipt',
        description: 'Item delivery and confirmation',
        type: 'form',
        assigneeRole: 'user',
        requiredFields: ['delivery_confirmation', 'condition_check']
      },
      {
        id: 'close',
        name: 'Close Request',
        description: 'Purchase request completed',
        type: 'automated',
        assigneeRole: 'system'
      }
    ]
  },
  {
    id: 'maintenance-request',
    name: 'Equipment Maintenance',
    description: 'Maintenance and repair requests for equipment',
    category: 'Maintenance',
    estimatedDuration: '3-5 days',
    steps: [
      {
        id: 'submit',
        name: 'Report Issue',
        description: 'Report equipment issue or maintenance need',
        type: 'form',
        requiredFields: ['equipment_id', 'issue_type', 'description', 'urgency'],
        assigneeRole: 'user'
      },
      {
        id: 'assessment',
        name: 'Technical Assessment',
        description: 'Technical team assesses the issue',
        type: 'inspection',
        assigneeRole: 'maintenance',
        estimatedDuration: '1 day'
      },
      {
        id: 'approval',
        name: 'Maintenance Approval',
        description: 'Approve maintenance work',
        type: 'approval',
        assigneeRole: 'maintenance_supervisor',
        possibleActions: ['approve', 'reject', 'defer']
      },
      {
        id: 'repair',
        name: 'Repair/Maintenance',
        description: 'Perform the maintenance work',
        type: 'task',
        assigneeRole: 'maintenance',
        estimatedDuration: '2-3 days'
      },
      {
        id: 'testing',
        name: 'Testing & QA',
        description: 'Test equipment after repair',
        type: 'inspection',
        assigneeRole: 'quality_assurance'
      },
      {
        id: 'complete',
        name: 'Complete Request',
        description: 'Maintenance completed and documented',
        type: 'automated',
        assigneeRole: 'system'
      }
    ]
  },
  {
    id: 'access-request',
    name: 'System Access Request',
    description: 'Request access to systems and applications',
    category: 'IT',
    estimatedDuration: '1-2 days',
    steps: [
      {
        id: 'submit',
        name: 'Request Access',
        description: 'Specify system access requirements',
        type: 'form',
        requiredFields: ['system', 'access_level', 'business_justification', 'duration'],
        assigneeRole: 'user'
      },
      {
        id: 'supervisor-approval',
        name: 'Supervisor Approval',
        description: 'Direct supervisor approves access request',
        type: 'approval',
        assigneeRole: 'manager',
        possibleActions: ['approve', 'reject']
      },
      {
        id: 'it-provisioning',
        name: 'IT Provisioning',
        description: 'IT team provisions the access',
        type: 'task',
        assigneeRole: 'it_support',
        estimatedDuration: '4-8 hours'
      },
      {
        id: 'confirmation',
        name: 'Access Confirmation',
        description: 'User confirms access is working',
        type: 'form',
        assigneeRole: 'user',
        requiredFields: ['access_confirmation']
      },
      {
        id: 'close',
        name: 'Close Request',
        description: 'Access request completed',
        type: 'automated',
        assigneeRole: 'system'
      }
    ]
  },
  {
    id: 'safety-incident',
    name: 'Safety Incident Report',
    description: 'Report and track safety incidents',
    category: 'Safety',
    estimatedDuration: '2-4 days',
    steps: [
      {
        id: 'report',
        name: 'Report Incident',
        description: 'Report safety incident details',
        type: 'form',
        requiredFields: ['incident_type', 'location', 'description', 'severity', 'injuries'],
        assigneeRole: 'user'
      },
      {
        id: 'immediate-action',
        name: 'Immediate Action',
        description: 'Take immediate safety measures',
        type: 'task',
        assigneeRole: 'safety_officer',
        estimatedDuration: '2-4 hours'
      },
      {
        id: 'investigation',
        name: 'Investigation',
        description: 'Investigate root causes',
        type: 'inspection',
        assigneeRole: 'safety_investigator',
        estimatedDuration: '1-2 days'
      },
      {
        id: 'corrective-action',
        name: 'Corrective Action',
        description: 'Implement corrective measures',
        type: 'task',
        assigneeRole: 'maintenance',
        estimatedDuration: '1-2 days'
      },
      {
        id: 'review',
        name: 'Safety Review',
        description: 'Safety committee review',
        type: 'approval',
        assigneeRole: 'safety_committee',
        possibleActions: ['approve', 'request_additional_actions']
      },
      {
        id: 'close',
        name: 'Close Report',
        description: 'Incident report closed',
        type: 'automated',
        assigneeRole: 'system'
      }
    ]
  }
];

export const getWorkflowById = (id: string) => {
  return workflowTemplates.find(workflow => workflow.id === id);
};

export const getWorkflowsByCategory = (category: string) => {
  return workflowTemplates.filter(workflow => workflow.category === category);
};

export const getAllCategories = () => {
  return [...new Set(workflowTemplates.map(workflow => workflow.category))];
};