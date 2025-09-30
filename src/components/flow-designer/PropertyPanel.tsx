'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { FlowNode, FormField } from '@/types/flow';
import { X, Plus } from 'lucide-react';

interface PropertyPanelProps {
  selectedNode: FlowNode | null;
  onUpdateNode: (nodeId: string, updates: Partial<FlowNode>) => void;
}

export default function PropertyPanel({ selectedNode, onUpdateNode }: PropertyPanelProps) {
  const [formFields, setFormFields] = useState<FormField[]>(
    selectedNode?.data.config?.fields || []
  );

  if (!selectedNode) {
    return (
      <Card className="p-4">
        <div className="text-center text-muted-foreground">
          Select a node to edit its properties
        </div>
      </Card>
    );
  }

  const handleLabelChange = (label: string) => {
    onUpdateNode(selectedNode.id, {
      data: { ...selectedNode.data, label }
    });
  };

  const addFormField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      name: '',
      label: '',
      type: 'text',
      required: false,
    };
    const updatedFields = [...formFields, newField];
    setFormFields(updatedFields);
    updateNodeConfig({ fields: updatedFields });
  };

  const updateFormField = (index: number, field: FormField) => {
    const updatedFields = [...formFields];
    updatedFields[index] = field;
    setFormFields(updatedFields);
    updateNodeConfig({ fields: updatedFields });
  };

  const removeFormField = (index: number) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
    updateNodeConfig({ fields: updatedFields });
  };

  const updateNodeConfig = (config: any) => {
    onUpdateNode(selectedNode.id, {
      data: { ...selectedNode.data, config }
    });
  };

  const renderFormConfig = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Form Fields</Label>
        <div className="mt-2 space-y-3">
          {formFields.map((field, index) => (
            <Card key={field.id} className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Field {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFormField(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Field name"
                  value={field.name}
                  onChange={(e) => updateFormField(index, { ...field, name: e.target.value })}
                />
                <Input
                  placeholder="Field label"
                  value={field.label}
                  onChange={(e) => updateFormField(index, { ...field, label: e.target.value })}
                />
                <select
                  className="w-full p-2 border rounded"
                  value={field.type}
                  onChange={(e) => updateFormField(index, { ...field, type: e.target.value as any })}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="textarea">Textarea</option>
                  <option value="dropdown">Dropdown</option>
                </select>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={field.required}
                    onCheckedChange={(checked) => updateFormField(index, { ...field, required: checked })}
                  />
                  <Label className="text-sm">Required</Label>
                </div>
              </div>
            </Card>
          ))}
          <Button variant="outline" size="sm" onClick={addFormField} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>
      </div>
    </div>
  );

  const renderDecisionConfig = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Conditions</Label>
        <Textarea
          placeholder="Enter decision conditions (one per line)"
          className="mt-2"
          rows={4}
        />
      </div>
    </div>
  );

  const renderApprovalConfig = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Assignees</Label>
        <Input
          placeholder="Enter user emails (comma separated)"
          className="mt-2"
        />
      </div>
      <div>
        <Label className="text-sm font-medium">Required Approvals</Label>
        <Input
          type="number"
          min="1"
          defaultValue="1"
          className="mt-2"
        />
      </div>
    </div>
  );

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Node Type</Label>
          <Badge variant="secondary" className="mt-1">
            {selectedNode.type}
          </Badge>
        </div>
        
        <div>
          <Label htmlFor="node-label" className="text-sm font-medium">Label</Label>
          <Input
            id="node-label"
            value={selectedNode.data.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            className="mt-1"
          />
        </div>

        {selectedNode.type === 'form' && renderFormConfig()}
        {selectedNode.type === 'decision' && renderDecisionConfig()}
        {selectedNode.type === 'approval' && renderApprovalConfig()}
      </div>
    </Card>
  );
}