'use client';

import React, { useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  NodeTypes,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Circle, 
  Square, 
  Diamond, 
  CheckCircle, 
  Settings,
  Plus,
  Trash2
} from 'lucide-react';

// Epiroc color scheme from requirements
const colors = {
  primary: 'rgb(0, 30, 50)',
  secondary: 'rgb(255, 199, 44)',
  background: 'rgb(236, 235, 228)',
  text: 'rgb(66, 85, 99)',
  success: 'rgb(76, 140, 43)',
  warning: 'rgb(216, 96, 24)',
  error: 'rgb(183, 49, 44)',
  info: 'rgb(72, 169, 197)',
  lightGrey: 'rgb(236, 235, 228)',
  mediumGrey: 'rgb(180, 180, 170)',
  darkGrey: 'rgb(119, 116, 110)',
  violet: 'rgb(97, 44, 81)',
  lightBlue: 'rgb(72, 169, 197)',
  orange: 'rgb(216, 96, 24)',
  green: 'rgb(76, 140, 43)',
  electricGreen: 'rgb(134, 200, 188)',
  darkYellow: 'rgb(230, 179, 39)',
  darkRed: 'rgb(163, 40, 35)',
  darkGreen: 'rgb(66, 120, 33)'
};

// Start Node Component
const StartNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-2 shadow-md rounded-full border-2 ${
    selected ? 'border-orange-500' : 'border-green-500'
  } bg-green-100 text-green-800`}>
    <Handle type="source" position={Position.Bottom} />
    <div className="flex items-center space-x-2">
      <Circle className="w-4 h-4" />
      <span className="text-sm font-medium">Start</span>
    </div>
  </div>
);

// Form Node Component
const FormNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <Card className={`min-w-[200px] ${selected ? 'ring-2 ring-orange-500' : ''}`}>
    <Handle type="target" position={Position.Top} />
    <CardHeader className="pb-2">
      <CardTitle className="text-sm flex items-center space-x-2">
        <Square className="w-4 h-4 text-blue-600" />
        <span>Form</span>
        <Badge variant="outline" className="text-xs">{data.formType || 'Standard'}</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <p className="text-xs text-gray-600 mb-2">{data.description || 'Form description'}</p>
      {data.fields && data.fields.length > 0 && (
        <div className="text-xs text-gray-500">
          {data.fields.length} field(s)
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </CardContent>
  </Card>
);

// Decision Node Component
const DecisionNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`relative transform rotate-45 ${selected ? 'ring-2 ring-orange-500' : ''}`}>
    <div className="w-32 h-32 bg-yellow-100 border-2 border-yellow-500 flex items-center justify-center">
      <Handle type="target" position={Position.Top} className="transform -rotate-45" />
      <div className="transform -rotate-45 text-center">
        <Diamond className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
        <span className="text-xs font-medium">Decision</span>
        <div className="text-xs text-gray-600 mt-1">{data.condition || 'IF condition'}</div>
      </div>
      <Handle type="source" position={Position.Right} className="transform -rotate-45" />
      <Handle type="source" position={Position.Left} className="transform -rotate-45" />
      <Handle type="source" position={Position.Bottom} className="transform -rotate-45" />
    </div>
  </div>
);

// Approval Node Component
const ApprovalNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <Card className={`min-w-[200px] ${selected ? 'ring-2 ring-orange-500' : ''}`}>
    <Handle type="target" position={Position.Top} />
    <CardHeader className="pb-2">
      <CardTitle className="text-sm flex items-center space-x-2">
        <CheckCircle className="w-4 h-4 text-purple-600" />
        <span>Approval</span>
        <Badge variant="outline" className="text-xs">{data.assigneeRole || 'Manager'}</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <p className="text-xs text-gray-600 mb-2">{data.description || 'Approval required'}</p>
      <div className="text-xs text-gray-500">
        Actions: {data.actions?.join(', ') || 'Approve, Reject'}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </CardContent>
  </Card>
);

// End Node Component
const EndNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <div className={`px-4 py-2 shadow-md rounded-full border-2 ${
    selected ? 'border-orange-500' : 'border-red-500'
  } bg-red-100 text-red-800`}>
    <Handle type="target" position={Position.Top} />
    <div className="flex items-center space-x-2">
      <Circle className="w-4 h-4" />
      <span className="text-sm font-medium">End</span>
    </div>
  </div>
);

// Custom node types
const nodeTypes: NodeTypes = {
  start: StartNode,
  form: FormNode,
  decision: DecisionNode,
  approval: ApprovalNode,
  end: EndNode,
};

interface FlowCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  onNodeSelect?: (node: Node | null) => void;
  readOnly?: boolean;
}

export function FlowCanvas({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
  onNodeSelect,
  readOnly = false
}: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  }, [onNodeSelect]);

  const onPaneClick = useCallback(() => {
    if (onNodeSelect) {
      onNodeSelect(null);
    }
  }, [onNodeSelect]);

  // Sync with parent component
  React.useEffect(() => {
    if (onNodesChange) {
      onNodesChange(nodes);
    }
  }, [nodes, onNodesChange]);

  React.useEffect(() => {
    if (onEdgesChange) {
      onEdgesChange(edges);
    }
  }, [edges, onEdgesChange]);

  // Handle internal changes
  const handleNodesChange = useCallback((changes: any) => {
    onNodesChangeInternal(changes);
  }, [onNodesChangeInternal]);

  const handleEdgesChange = useCallback((changes: any) => {
    onEdgesChangeInternal(changes);
  }, [onEdgesChangeInternal]);

  // Handle drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    const type = event.dataTransfer.getData('application/reactflow');
    if (typeof type === 'undefined' || !type) {
      return;
    }

    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        description: `${type} node description`
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  return (
    <div className="w-full h-full" style={{ backgroundColor: colors.lightGrey }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
      >
        <Background color={colors.mediumGrey} variant={BackgroundVariant.Dots} />
        <Controls 
          showInteractive={!readOnly}
          style={{ backgroundColor: 'white', border: `1px solid ${colors.mediumGrey}` }}
        />
        <MiniMap 
          style={{ backgroundColor: colors.lightGrey }}
          nodeColor={(node) => {
            switch (node.type) {
              case 'start': return colors.success;
              case 'end': return colors.error;
              case 'decision': return colors.warning;
              case 'approval': return colors.violet;
              case 'form': return colors.info;
              default: return colors.text;
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}

// Node toolbar for adding new nodes
export function NodeToolbar({ onAddNode }: { onAddNode: (type: string) => void }) {
  const nodeTypes = [
    { type: 'form', label: 'Form', icon: Square, color: 'text-blue-600' },
    { type: 'decision', label: 'Decision', icon: Diamond, color: 'text-yellow-600' },
    { type: 'approval', label: 'Approval', icon: CheckCircle, color: 'text-purple-600' },
  ];

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="text-sm">Add Nodes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.type}
            draggable
            onDragStart={(event) => onDragStart(event, nodeType.type)}
            className="cursor-move"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddNode(nodeType.type)}
              className="w-full justify-start"
            >
              <nodeType.icon className={`w-4 h-4 mr-2 ${nodeType.color}`} />
              {nodeType.label}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Default initial flow
export const defaultFlowNodes: Node[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 250, y: 50 },
    data: { label: 'Start' },
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 250, y: 400 },
    data: { label: 'End' },
  },
];

export const defaultFlowEdges: Edge[] = [];