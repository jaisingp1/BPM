'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

interface DecisionNodeProps {
  data: {
    label: string;
    config?: {
      conditions: any[];
    };
  };
  selected?: boolean;
}

export default function DecisionNode({ data, selected }: DecisionNodeProps) {
  const conditionCount = data.config?.conditions?.length || 0;

  return (
    <Card className={`min-w-[160px] border-2 border-amber-500 bg-amber-50 ${selected ? 'ring-2 ring-amber-600' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-amber-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-amber-500"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="w-3 h-3 bg-amber-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-amber-500"
      />
      <div className="flex items-start gap-2 p-3">
        <GitBranch className="w-4 h-4 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <span className="text-sm font-medium text-amber-800 block">
            {data.label || 'Decision'}
          </span>
          {conditionCount > 0 && (
            <span className="text-xs text-amber-600">
              {conditionCount} condition{conditionCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}