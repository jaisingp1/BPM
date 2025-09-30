'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ApprovalNodeProps {
  data: {
    label: string;
    config?: {
      assignees: string[];
      requiredApprovals: number;
    };
  };
  selected?: boolean;
}

export default function ApprovalNode({ data, selected }: ApprovalNodeProps) {
  const assigneeCount = data.config?.assignees?.length || 0;
  const requiredApprovals = data.config?.requiredApprovals || 1;

  return (
    <Card className={`min-w-[180px] border-2 border-purple-500 bg-purple-50 ${selected ? 'ring-2 ring-purple-600' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-purple-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-purple-500"
      />
      <div className="flex items-start gap-2 p-3">
        <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5" />
        <div className="flex-1">
          <span className="text-sm font-medium text-purple-800 block">
            {data.label || 'Approval'}
          </span>
          {assigneeCount > 0 && (
            <span className="text-xs text-purple-600">
              {assigneeCount} assignee{assigneeCount !== 1 ? 's' : ''} ({requiredApprovals} required)
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}