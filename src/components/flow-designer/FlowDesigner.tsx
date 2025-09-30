'use client';

import React, { useState, useCallback } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import FlowCanvas from './FlowCanvas';
import NodeToolbar from './NodeToolbar';
import PropertyPanel from './PropertyPanel';
import { FlowDefinition, FlowNode } from '@/types/flow';
import { v4 as uuidv4 } from 'uuid';

interface FlowDesignerProps {
  initialFlow?: FlowDefinition;
  onFlowChange?: (flow: FlowDefinition) => void;
  readonly?: boolean;
}

export default function FlowDesigner({ 
  initialFlow, 
  onFlowChange, 
  readonly = false 
}: FlowDesignerProps) {
  const [flow, setFlow] = useState<FlowDefinition>(initialFlow || { nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);

  const handleFlowChange = useCallback((newFlow: FlowDefinition) => {
    setFlow(newFlow);
    if (onFlowChange) {
      onFlowChange(newFlow);
    }
  }, [onFlowChange]);

  const handleAddNode = useCallback((type: string) => {
    const newNode: FlowNode = {
      id: uuidv4(),
      type: type as any,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        config: type === 'form' ? { fields: [] } : undefined,
      },
    };

    const updatedFlow = {
      ...flow,
      nodes: [...flow.nodes, newNode],
    };

    handleFlowChange(updatedFlow);
  }, [flow, handleFlowChange]);

  const handleUpdateNode = useCallback((nodeId: string, updates: Partial<FlowNode>) => {
    const updatedFlow = {
      ...flow,
      nodes: flow.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    };

    handleFlowChange(updatedFlow);
    
    // Update selected node if it's the one being updated
    if (selectedNode?.id === nodeId) {
      setSelectedNode({ ...selectedNode, ...updates });
    }
  }, [flow, handleFlowChange, selectedNode]);

  const handleNodeSelection = useCallback((node: FlowNode | null) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="w-full h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        {!readonly && (
          <>
            <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
              <div className="p-4 h-full overflow-y-auto">
                <NodeToolbar onAddNode={handleAddNode} />
              </div>
            </ResizablePanel>
            <ResizableHandle />
          </>
        )}
        
        <ResizablePanel defaultSize={50}>
          <div className="p-4 h-full">
            <FlowCanvas
              initialFlow={flow}
              onFlowChange={handleFlowChange}
              readonly={readonly}
            />
          </div>
        </ResizablePanel>
        
        {!readonly && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={30} minSize={25} maxSize={35}>
              <div className="p-4 h-full overflow-y-auto">
                <PropertyPanel
                  selectedNode={selectedNode}
                  onUpdateNode={handleUpdateNode}
                />
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}