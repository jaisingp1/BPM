'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Save, 
  Play, 
  Download, 
  Upload,
  Settings,
  Layers,
  Eye,
  Trash2,
  Plus,
  FileText,
  GitBranch
} from 'lucide-react';
import { FlowCanvas, NodeToolbar, defaultFlowNodes, defaultFlowEdges } from './FlowCanvas';
import { PropertyPanel } from './PropertyPanel';
import { LoadingOverlay } from '@/components/ui/loading';
import { useLoading } from '@/contexts/loading-context';

// Epiroc color scheme
const colors = {
  primary: 'rgb(0, 30, 50)',
  secondary: 'rgb(255, 199, 44)',
  background: 'rgb(236, 235, 228)',
  text: 'rgb(66, 85, 99)',
  success: 'rgb(76, 140, 43)',
  warning: 'rgb(216, 96, 24)',
  error: 'rgb(183, 49, 44)',
  info: 'rgb(72, 169, 197)'
};

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

interface FlowDesignerProps {
  workflow?: Workflow;
  onSave?: (workflow: Workflow) => void;
  onTest?: (workflow: Workflow) => void;
  readOnly?: boolean;
}

export function FlowDesigner({ 
  workflow, 
  onSave, 
  onTest, 
  readOnly = false 
}: FlowDesignerProps) {
  const { startLoading, stopLoading } = useLoading();
  const [nodes, setNodes] = useState<Node[]>(workflow?.nodes || defaultFlowNodes);
  const [edges, setEdges] = useState<Edge[]>(workflow?.edges || defaultFlowEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState(workflow?.name || 'New Workflow');
  const [workflowDescription, setWorkflowDescription] = useState(workflow?.description || '');
  const [workflowCategory, setWorkflowCategory] = useState(workflow?.category || 'General');
  const [isSaving, setIsSaving] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);

  const nodeIdCounter = useRef(1);

  const addNode = useCallback((type: string) => {
    const newNode: Node = {
      id: `${type}-${nodeIdCounter.current++}`,
      type,
      position: { 
        x: 250 + Math.random() * 200, 
        y: 150 + Math.random() * 200 
      },
      data: {
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        description: `${type} node description`
      }
    };

    setNodes((nds) => [...nds, newNode]);
  }, []);

  const updateNode = useCallback((nodeId: string, updates: any) => {
    setNodes((nds) => 
      nds.map((node) => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
  }, []);

  const deleteSelectedNode = useCallback(() => {
    if (selectedNode && selectedNode.type !== 'start' && selectedNode.type !== 'end') {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const saveWorkflow = useCallback(async () => {
    if (!onSave) return;

    setIsSaving(true);
    startLoading('Saving workflow...');
    try {
      const workflowData: Workflow = {
        id: workflow?.id || `workflow-${Date.now()}`,
        name: workflowName,
        description: workflowDescription,
        category: workflowCategory,
        isActive: workflow?.isActive ?? true,
        nodes,
        edges,
        createdAt: workflow?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSave(workflowData);
    } catch (error) {
      console.error('Error saving workflow:', error);
    } finally {
      setIsSaving(false);
      stopLoading();
    }
  }, [workflowName, workflowDescription, workflowCategory, nodes, edges, workflow, onSave, startLoading, stopLoading]);

  const testWorkflow = useCallback(() => {
    if (!onTest) return;

    const workflowData: Workflow = {
      id: workflow?.id || `test-workflow-${Date.now()}`,
      name: workflowName,
      description: workflowDescription,
      category: workflowCategory,
      isActive: false,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onTest(workflowData);
    setShowTestDialog(false);
  }, [workflowName, workflowDescription, workflowCategory, nodes, edges, workflow, onTest]);

  const exportWorkflow = useCallback(() => {
    const workflowData = {
      name: workflowName,
      description: workflowDescription,
      category: workflowCategory,
      nodes,
      edges
    };

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [workflowName, workflowDescription, workflowCategory, nodes, edges]);

  const importWorkflow = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflowData = JSON.parse(e.target?.result as string);
        setWorkflowName(workflowData.name || 'Imported Workflow');
        setWorkflowDescription(workflowData.description || '');
        setWorkflowCategory(workflowData.category || 'General');
        setNodes(workflowData.nodes || defaultFlowNodes);
        setEdges(workflowData.edges || defaultFlowEdges);
      } catch (error) {
        console.error('Error importing workflow:', error);
      }
    };
    reader.readAsText(file);
  }, []);

  const validateWorkflow = useCallback(() => {
    const errors: string[] = [];

    // Check if workflow has start and end nodes
    const hasStart = nodes.some(node => node.type === 'start');
    const hasEnd = nodes.some(node => node.type === 'end');
    
    if (!hasStart) errors.push('Workflow must have a start node');
    if (!hasEnd) errors.push('Workflow must have an end node');

    // Check if all non-start nodes are connected
    const nodeIds = new Set(nodes.map(node => node.id));
    const connectedNodes = new Set<string>();
    
    edges.forEach(edge => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });

    // Find nodes that are not connected (except start nodes)
    const disconnectedNodes = nodes.filter(node => 
      node.type !== 'start' && !connectedNodes.has(node.id)
    );

    if (disconnectedNodes.length > 0) {
      errors.push(`${disconnectedNodes.length} node(s) are not connected`);
    }

    return errors;
  }, [nodes, edges]);

  const validationErrors = validateWorkflow();

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-6 h-6" style={{ color: colors.primary }} />
              <h1 className="text-xl font-bold" style={{ color: colors.primary }}>
                Workflow Designer
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <div>
                <Label htmlFor="workflow-name" className="sr-only">Name</Label>
                <Input
                  id="workflow-name"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="w-64"
                  placeholder="Workflow name"
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="workflow-category" className="sr-only">Category</Label>
                <Select 
                  value={workflowCategory} 
                  onValueChange={setWorkflowCategory}
                  disabled={readOnly}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="IT Support">IT Support</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Procurement">Procurement</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {validationErrors.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {validationErrors.length} error(s)
              </Badge>
            )}
            
            {!readOnly && (
              <>
                <Button variant="outline" size="sm" onClick={exportWorkflow}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importWorkflow}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>

                <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Test
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Test Workflow</DialogTitle>
                      <DialogDescription>
                        This will create a test instance of your workflow. Are you sure?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowTestDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={testWorkflow}>
                        Run Test
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button 
                  size="sm" 
                  onClick={saveWorkflow}
                  disabled={isSaving || validationErrors.length > 0}
                  style={{ backgroundColor: colors.secondary, color: colors.primary }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </>
            )}
          </div>
        </div>

        {workflowDescription && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">{workflowDescription}</p>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-red-600">
              {validationErrors.join(', ')}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Node Toolbar */}
        {!readOnly && (
          <div className="w-64 p-4 border-r border-gray-200">
            <NodeToolbar onAddNode={addNode} />
            
            {selectedNode && selectedNode.type !== 'start' && selectedNode.type !== 'end' && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteSelectedNode}
                  className="w-full text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Node
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1">
          <LoadingOverlay isLoading={isSaving} text="Saving workflow...">
            <FlowCanvas
              initialNodes={nodes}
              initialEdges={edges}
              onNodesChange={setNodes}
              onEdgesChange={setEdges}
              onNodeSelect={setSelectedNode}
              readOnly={readOnly}
            />
          </LoadingOverlay>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 p-4 border-l border-gray-200">
          <PropertyPanel
            selectedNode={selectedNode}
            onNodeUpdate={updateNode}
            dataSources={[
              { id: '1', name: 'Countries', sourceType: 'table' },
              { id: '2', name: 'Departments', sourceType: 'query' },
              { id: '3', name: 'Products', sourceType: 'table' }
            ]}
          />
        </div>
      </div>
    </div>
  );
}