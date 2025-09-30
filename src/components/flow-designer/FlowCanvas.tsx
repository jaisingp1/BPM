'use client';

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FlowDefinition, FlowNode, FlowEdge } from '@/types/flow';
import StartNode from './nodes/StartNode';
import FormNode from './nodes/FormNode';
import DecisionNode from './nodes/DecisionNode';
import ApprovalNode from './nodes/ApprovalNode';
import EndNode from './nodes/EndNode';

interface FlowCanvasProps {
  initialFlow?: FlowDefinition;
  onFlowChange?: (flow: FlowDefinition) => void;
  readonly?: boolean;
}

const nodeTypes = {
  start: StartNode,
  form: FormNode,
  decision: DecisionNode,
  approval: ApprovalNode,
  end: EndNode,
};

export default function FlowCanvas({ 
  initialFlow, 
  onFlowChange, 
  readonly = false 
}: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialFlow?.nodes || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialFlow?.edges || []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (readonly) return;
      
      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}`,
      } as Edge;
      
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, readonly]
  );

  const flowDefinition = useMemo(() => ({
    nodes,
    edges,
  }), [nodes, edges]);

  React.useEffect(() => {
    if (onFlowChange) {
      onFlowChange(flowDefinition);
    }
  }, [flowDefinition, onFlowChange]);

  return (
    <div className="w-full h-full bg-background border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readonly ? undefined : onNodesChange}
        onEdgesChange={readonly ? undefined : onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        nodesDraggable={!readonly}
        nodesConnectable={!readonly}
        elementsSelectable={!readonly}
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.type) {
              case 'start': return '#10b981';
              case 'end': return '#ef4444';
              case 'form': return '#3b82f6';
              case 'decision': return '#f59e0b';
              case 'approval': return '#8b5cf6';
              default: return '#6b7280';
            }
          }}
        />
        {!readonly && (
          <Panel position="top-right" className="bg-background border rounded p-2">
            <div className="text-sm font-medium">Flow Designer</div>
            <div className="text-xs text-muted-foreground">
              Drag nodes to connect them
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}