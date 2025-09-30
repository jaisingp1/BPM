'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Save, 
  Play, 
  Settings, 
  Trash2, 
  Edit,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Users,
  FileText,
  MessageSquare,
  Eye,
  GitBranch,
  Circle
} from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { FlowDesigner } from '@/components/workflow/FlowDesigner';
import { LoadingSpinner, CardSkeleton } from '@/components/ui/loading';
import { useLoading } from '@/contexts/loading-context';
import { Node, Edge } from '@xyflow/react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

export default function WorkflowDesignerPage() {
  const { startLoading, stopLoading } = useLoading();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDesigner, setShowDesigner] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    setLoading(true);
    startLoading('Loading workflows...');
    try {
      const response = await fetch('/api/workflows');
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data.workflows || []);
      }
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const createWorkflow = async () => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: 'Click to edit this workflow',
      category: 'General',
      isActive: true,
      nodes: [
        {
          id: 'start-1',
          type: 'start',
          position: { x: 250, y: 50 },
          data: { label: 'Start', name: 'Start' },
        },
        {
          id: 'end-1',
          type: 'end',
          position: { x: 250, y: 400 },
          data: { label: 'End', name: 'End' },
        }
      ],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSelectedWorkflow(newWorkflow);
    setShowDesigner(true);
  };

  const saveWorkflow = async (workflow: Workflow) => {
    setLoading(true);
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: workflow.name,
          description: workflow.description,
          category: workflow.category,
          flowDefinition: JSON.stringify({
            nodes: workflow.nodes,
            edges: workflow.edges
          })
        })
      });

      if (response.ok) {
        const savedWorkflow = await response.json();
        setWorkflows([...workflows, savedWorkflow]);
        setSelectedWorkflow(savedWorkflow);
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateWorkflow = async (workflow: Workflow) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/workflows/${workflow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: workflow.name,
          description: workflow.description,
          category: workflow.category,
          flowDefinition: JSON.stringify({
            nodes: workflow.nodes,
            edges: workflow.edges
          })
        })
      });

      if (response.ok) {
        const updatedWorkflow = await response.json();
        setWorkflows(workflows.map(w => w.id === updatedWorkflow.id ? updatedWorkflow : w));
        setSelectedWorkflow(updatedWorkflow);
      }
    } catch (error) {
      console.error('Error updating workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setWorkflows(workflows.filter(w => w.id !== workflowId));
        if (selectedWorkflow?.id === workflowId) {
          setSelectedWorkflow(null);
          setShowDesigner(false);
        }
      }
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  };

  const duplicateWorkflow = async (workflow: Workflow) => {
    const duplicatedWorkflow: Workflow = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: duplicatedWorkflow.name,
          description: duplicatedWorkflow.description,
          category: duplicatedWorkflow.category,
          flowDefinition: JSON.stringify({
            nodes: duplicatedWorkflow.nodes,
            edges: duplicatedWorkflow.edges
          })
        })
      });

      if (response.ok) {
        const savedWorkflow = await response.json();
        setWorkflows([...workflows, savedWorkflow]);
      }
    } catch (error) {
      console.error('Error duplicating workflow:', error);
    }
  };

  const testWorkflow = async (workflow: Workflow) => {
    alert(`Testing workflow: ${workflow.name}\n\nThis would create a test instance of the workflow with sample data.`);
  };

  const openWorkflow = (workflow: Workflow) => {
    // Parse the flow definition to get nodes and edges
    let nodes = workflow.nodes || [];
    let edges = workflow.edges || [];
    
    try {
      if (workflow.flowDefinition) {
        const flowData = JSON.parse(workflow.flowDefinition);
        nodes = flowData.nodes || [];
        edges = flowData.edges || [];
      }
    } catch (error) {
      console.error('Error parsing flow definition:', error);
    }

    setSelectedWorkflow({
      ...workflow,
      nodes,
      edges
    });
    setShowDesigner(true);
  };

  if (showDesigner && selectedWorkflow) {
    return (
      <FlowDesigner
        workflow={selectedWorkflow}
        onSave={isCreating ? saveWorkflow : updateWorkflow}
        onTest={testWorkflow}
        readOnly={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="lg:pl-80">
        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Workflow Designer</h1>
              <p className="text-gray-600 mt-1">Design and automate your business processes</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={createWorkflow} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                New Workflow
              </Button>
            </div>
          </div>

          {/* Workflow List */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <CardSkeleton count={6} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {workflow.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                        {workflow.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {workflow.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {workflow.nodes?.length || 0} nodes, {workflow.edges?.length || 0} connections
                      </span>
                      <span>
                        Updated {new Date(workflow.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openWorkflow(workflow)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => testWorkflow(workflow)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => duplicateWorkflow(workflow)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteWorkflow(workflow.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {workflows.length === 0 && !loading && (
              <div className="col-span-3">
                <Card>
                  <CardContent className="p-12 text-center">
                    <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No workflows yet</h3>
                    <p className="text-gray-600 mb-6">Create your first workflow to start automating your business processes</p>
                    <Button onClick={createWorkflow} className="bg-orange-600 hover:bg-orange-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Workflow
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}