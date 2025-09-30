'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Play, 
  FileText, 
  GitBranch, 
  CheckCircle, 
  Square 
} from 'lucide-react';

interface NodeToolbarProps {
  onAddNode: (type: string) => void;
}

export default function NodeToolbar({ onAddNode }: NodeToolbarProps) {
  const nodeTypes = [
    { type: 'start', label: 'Start', icon: Play, color: 'text-green-600' },
    { type: 'form', label: 'Form', icon: FileText, color: 'text-blue-600' },
    { type: 'decision', label: 'Decision', icon: GitBranch, color: 'text-amber-600' },
    { type: 'approval', label: 'Approval', icon: CheckCircle, color: 'text-purple-600' },
    { type: 'end', label: 'End', icon: Square, color: 'text-red-600' },
  ];

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-3">Node Types</h3>
      <div className="space-y-2">
        {nodeTypes.map(({ type, label, icon: Icon, color }) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => onAddNode(type)}
          >
            <Icon className={`w-4 h-4 ${color}`} />
            {label}
          </Button>
        ))}
      </div>
    </Card>
  );
}