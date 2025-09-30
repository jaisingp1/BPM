'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Square } from 'lucide-react';

interface EndNodeProps {
  data: {
    label: string;
  };
  selected?: boolean;
}

export default function EndNode({ data, selected }: EndNodeProps) {
  return (
    <Card className={`min-w-[150px] border-2 border-red-500 bg-red-50 ${selected ? 'ring-2 ring-red-600' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-red-500"
      />
      <div className="flex items-center gap-2 p-3">
        <Square className="w-4 h-4 text-red-600" />
        <span className="text-sm font-medium text-red-800">
          {data.label || 'End'}
        </span>
      </div>
    </Card>
  );
}