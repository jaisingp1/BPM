'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Save,
  FileText,
  Hash,
  Calendar,
  List,
  MessageSquare,
  GitBranch,
  Users,
  Clock,
  Link
} from 'lucide-react';
import { Node } from '@xyflow/react';

// Epiroc color scheme
const colors = {
  primary: 'rgb(0, 30, 50)',
  secondary: 'rgb(255, 199, 44)',
  background: 'rgb(236, 235, 228)',
  text: 'rgb(66, 85, 99)',
  success: 'rgb(76, 140, 43)',
  warning: 'rgb(216, 96, 24)',
  error: 'rgb(183, 49, 44)',
  info: 'rgb(72, 169, 197)'
};

interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'dropdown' | 'checkbox';
  required: boolean;
  options?: string[];
  dataSource?: string;
  isMasterField?: boolean;
  isDetailField?: boolean;
  masterDetailRelation?: string;
}

interface PropertyPanelProps {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, updates: any) => void;
  dataSources?: Array<{ id: string; name: string; sourceType: string }>;
}

export function PropertyPanel({ selectedNode, onNodeUpdate, dataSources = [] }: PropertyPanelProps) {
  const [nodeData, setNodeData] = useState<any>({});
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode.data);
      if (selectedNode.type === 'form' && selectedNode.data.fields) {
        setFormFields(selectedNode.data.fields);
      } else {
        setFormFields([]);
      }
    } else {
      setNodeData({});
      setFormFields([]);
    }
  }, [selectedNode]);

  const updateNodeData = async (key: string, value: any) => {
    setSaveStatus('saving');
    const newData = { ...nodeData, [key]: value };
    setNodeData(newData);
    if (selectedNode) {
      await onNodeUpdate(selectedNode.id, { data: newData });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const addFormField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      name: '',
      label: '',
      type: 'text',
      required: false
    };
    const updatedFields = [...formFields, newField];
    setFormFields(updatedFields);
    
    // Also update the node data immediately to ensure changes are saved
    if (selectedNode) {
      const newData = { ...nodeData, fields: updatedFields };
      setNodeData(newData);
      onNodeUpdate(selectedNode.id, { data: newData });
    }
  };

  const updateFormField = async (fieldId: string, updates: Partial<FormField>) => {
    setSaveStatus('saving');
    const updatedFields = formFields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    );
    setFormFields(updatedFields);
    
    // Also update the node data immediately to ensure changes are saved
    if (selectedNode) {
      const newData = { ...nodeData, fields: updatedFields };
      setNodeData(newData);
      await onNodeUpdate(selectedNode.id, { data: newData });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const removeFormField = (fieldId: string) => {
    const updatedFields = formFields.filter(field => field.id !== fieldId);
    setFormFields(updatedFields);
    
    // Also update the node data immediately to ensure changes are saved
    if (selectedNode) {
      const newData = { ...nodeData, fields: updatedFields };
      setNodeData(newData);
      onNodeUpdate(selectedNode.id, { data: newData });
    }
  };

  const renderFormNodeProperties = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="form-name">Form Name</Label>
        <Input
          id="form-name"
          value={nodeData.name || ''}
          onChange={(e) => updateNodeData('name', e.target.value)}
          placeholder="Enter form name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="form-description">Description</Label>
        <Textarea
          id="form-description"
          value={nodeData.description || ''}
          onChange={(e) => updateNodeData('description', e.target.value)}
          placeholder="Describe this form"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-type">Form Type</Label>
        <Select 
          value={nodeData.formType || 'standard'} 
          onValueChange={(value) => updateNodeData('formType', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="master_detail">Master/Detail</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {nodeData.formType === 'master_detail' && (
        <div className="space-y-2">
          <Label>Master-Detail Relationship</Label>
          <div className="text-xs text-gray-600 mb-2">
            Select the field that links master and detail records
          </div>
          <Select 
            value={nodeData.masterDetailField || ''} 
            onValueChange={(value) => updateNodeData('masterDetailField', value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select relationship field" />
            </SelectTrigger>
            <SelectContent>
              {formFields.filter(field => (field.type === 'text' || field.type === 'number' || field.type === 'dropdown') && field.name).map((field) => (
                <SelectItem key={field.id} value={field.name}>
                  {field.label || field.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {nodeData.masterDetailField && (
            <div className="text-xs text-green-600 mt-1">
              ✓ Relationship field: {nodeData.masterDetailField}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Form Fields</Label>
          <Button size="sm" onClick={addFormField}>
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>
        
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {formFields.map((field) => (
              <Card key={field.id} className="p-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {field.type}
                      </Badge>
                      {field.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                      {nodeData.formType === 'master_detail' && nodeData.masterDetailField === field.name && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          <Link className="w-3 h-3 mr-1" />
                          Relation
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFormField(field.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`field-name-${field.id}`} className="text-xs">Name</Label>
                      <Input
                        id={`field-name-${field.id}`}
                        value={field.name}
                        onChange={(e) => updateFormField(field.id, { name: e.target.value })}
                        placeholder="field_name"
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`field-label-${field.id}`} className="text-xs">Label</Label>
                      <Input
                        id={`field-label-${field.id}`}
                        value={field.label}
                        onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                        placeholder="Field Label"
                        className="h-8"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`field-type-${field.id}`} className="text-xs">Type</Label>
                      <Select 
                        value={field.type} 
                        onValueChange={(value: any) => updateFormField(field.id, { type: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                          <SelectItem value="dropdown">Dropdown</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`field-required-${field.id}`}
                        checked={field.required}
                        onCheckedChange={(checked) => updateFormField(field.id, { required: !!checked })}
                      />
                      <Label htmlFor={`field-required-${field.id}`} className="text-xs">Required</Label>
                    </div>
                  </div>
                  
                  {field.type === 'dropdown' && (
                    <div>
                      <Label htmlFor={`field-datasource-${field.id}`} className="text-xs">Data Source</Label>
                      <Select 
                        value={field.dataSource || ''} 
                        onValueChange={(value) => updateFormField(field.id, { dataSource: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select data source" />
                        </SelectTrigger>
                        <SelectContent>
                          {dataSources.map((source) => (
                            <SelectItem key={source.id} value={source.id}>
                              {source.name} ({source.sourceType})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  const renderDecisionNodeProperties = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="decision-name">Decision Name</Label>
        <Input
          id="decision-name"
          value={nodeData.name || ''}
          onChange={(e) => updateNodeData('name', e.target.value)}
          placeholder="Enter decision name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="decision-condition">Condition</Label>
        <Textarea
          id="decision-condition"
          value={nodeData.condition || ''}
          onChange={(e) => updateNodeData('condition', e.target.value)}
          placeholder="Enter condition (e.g., amount > 1000)"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Branches</Label>
        <div className="space-y-2">
          <div className="p-2 border rounded">
            <Label className="text-xs">True Branch</Label>
            <Input
              value={nodeData.trueBranch || ''}
              onChange={(e) => updateNodeData('trueBranch', e.target.value)}
              placeholder="Label for true condition"
              className="h-8 mt-1"
            />
          </div>
          <div className="p-2 border rounded">
            <Label className="text-xs">False Branch</Label>
            <Input
              value={nodeData.falseBranch || ''}
              onChange={(e) => updateNodeData('falseBranch', e.target.value)}
              placeholder="Label for false condition"
              className="h-8 mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderApprovalNodeProperties = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="approval-name">Approval Name</Label>
        <Input
          id="approval-name"
          value={nodeData.name || ''}
          onChange={(e) => updateNodeData('name', e.target.value)}
          placeholder="Enter approval name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="approval-description">Description</Label>
        <Textarea
          id="approval-description"
          value={nodeData.description || ''}
          onChange={(e) => updateNodeData('description', e.target.value)}
          placeholder="Describe this approval step"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee-role">Assignee Role</Label>
        <Select 
          value={nodeData.assigneeRole || ''} 
          onValueChange={(value) => updateNodeData('assigneeRole', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="procurement">Procurement</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="it_support">IT Support</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="safety_officer">Safety Officer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Available Actions</Label>
        <div className="space-y-2">
          {['Approve', 'Reject', 'Request More Info'].map((action) => (
            <div key={action} className="flex items-center space-x-2">
              <Checkbox
                id={`action-${action}`}
                checked={nodeData.actions?.includes(action) || false}
                onCheckedChange={(checked) => {
                  const currentActions = nodeData.actions || [];
                  const updatedActions = checked
                    ? [...currentActions, action]
                    : currentActions.filter((a: string) => a !== action);
                  updateNodeData('actions', updatedActions);
                }}
              />
              <Label htmlFor={`action-${action}`} className="text-sm">{action}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeout-hours">Timeout (hours)</Label>
        <Input
          id="timeout-hours"
          type="number"
          value={nodeData.timeoutHours || ''}
          onChange={(e) => updateNodeData('timeoutHours', parseInt(e.target.value) || 0)}
          placeholder="0 for no timeout"
        />
      </div>
    </div>
  );

  if (!selectedNode) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select a node to edit its properties</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Properties
          </div>
          <div className="flex items-center space-x-2">
            {saveStatus === 'saving' && (
              <div className="text-xs text-orange-600">Saving...</div>
            )}
            {saveStatus === 'saved' && (
              <div className="text-xs text-green-600">✓ Saved</div>
            )}
            <Badge variant="outline" className="text-xs">
              {selectedNode.type}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {selectedNode.type === 'form' && renderFormNodeProperties()}
          {selectedNode.type === 'decision' && renderDecisionNodeProperties()}
          {selectedNode.type === 'approval' && renderApprovalNodeProperties()}
          {selectedNode.type === 'start' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="start-name">Start Node Name</Label>
                <Input
                  id="start-name"
                  value={nodeData.name || 'Start'}
                  onChange={(e) => updateNodeData('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-description">Description</Label>
                <Textarea
                  id="start-description"
                  value={nodeData.description || ''}
                  onChange={(e) => updateNodeData('description', e.target.value)}
                  placeholder="Workflow start point"
                  rows={3}
                />
              </div>
            </div>
          )}
          {selectedNode.type === 'end' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="end-name">End Node Name</Label>
                <Input
                  id="end-name"
                  value={nodeData.name || 'End'}
                  onChange={(e) => updateNodeData('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-description">Description</Label>
                <Textarea
                  id="end-description"
                  value={nodeData.description || ''}
                  onChange={(e) => updateNodeData('description', e.target.value)}
                  placeholder="Workflow end point"
                  rows={3}
                />
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}