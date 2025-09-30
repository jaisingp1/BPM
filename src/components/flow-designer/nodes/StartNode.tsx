'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Play } from 'lucide-react';

interface StartNodeProps {
  data: {
    label: string;
  };
  selected?: boolean;
}

export default function StartNode({ data, selected }: StartNodeProps) {
  return (
    <Card className={`min-w-[150px] border-2 border-green-500 bg-green-50 ${selected ? 'ring-2 ring-green-600' : ''}`}>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500"
      />
      <div className="flex items-center gap-2 p-3">
        <Play className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">
          {data.label || 'Start'}
        </span>
      </div>
    </Card>
  );
}