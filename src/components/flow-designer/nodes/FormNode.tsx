'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface FormNodeProps {
  data: {
    label: string;
    config?: {
      fields: any[];
    };
  };
  selected?: boolean;
}

export default function FormNode({ data, selected }: FormNodeProps) {
  const fieldCount = data.config?.fields?.length || 0;

  return (
    <Card className={`min-w-[180px] border-2 border-blue-500 bg-blue-50 ${selected ? 'ring-2 ring-blue-600' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500"
      />
      <div className="flex items-start gap-2 p-3">
        <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <span className="text-sm font-medium text-blue-800 block">
            {data.label || 'Form'}
          </span>
          {fieldCount > 0 && (
            <span className="text-xs text-blue-600">
              {fieldCount} field{fieldCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}