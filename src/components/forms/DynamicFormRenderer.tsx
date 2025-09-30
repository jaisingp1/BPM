'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormConfig } from '@/types/flow';
import { Plus, Trash2 } from 'lucide-react';

interface DynamicFormRendererProps {
  config: FormConfig;
  onSubmit: (data: any) => void;
  initialData?: any;
  readonly?: boolean;
}

interface FormData {
  [key: string]: any;
}

export default function DynamicFormRenderer({ 
  config, 
  onSubmit, 
  initialData = {}, 
  readonly = false 
}: DynamicFormRendererProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: initialData
  });

  const [detailRows, setDetailRows] = useState<any[]>(
    initialData.detailData || [{}]
  );

  const renderField = (field: FormField, value?: any, onChange?: (value: any) => void) => {
    const fieldRegister = register(field.name, {
      required: field.required ? `${field.label} is required` : false,
    });

    switch (field.type) {
      case 'text':
        return (
          <Input
            {...fieldRegister}
            placeholder={field.label}
            disabled={readonly}
            value={value || ''}
            onChange={(e) => {
              fieldRegister.onChange(e);
              if (onChange) onChange(e.target.value);
            }}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            {...fieldRegister}
            placeholder={field.label}
            disabled={readonly}
            value={value || ''}
            onChange={(e) => {
              fieldRegister.onChange(e);
              if (onChange) onChange(e.target.value);
            }}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            {...fieldRegister}
            disabled={readonly}
            value={value || ''}
            onChange={(e) => {
              fieldRegister.onChange(e);
              if (onChange) onChange(e.target.value);
            }}
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...fieldRegister}
            placeholder={field.label}
            disabled={readonly}
            value={value || ''}
            onChange={(e) => {
              fieldRegister.onChange(e);
              if (onChange) onChange(e.target.value);
            }}
          />
        );

      case 'dropdown':
        return (
          <Select
            value={value || ''}
            onValueChange={(newValue) => {
              setValue(field.name, newValue);
              if (onChange) onChange(newValue);
            }}
            disabled={readonly}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {/* TODO: Load options from data source */}
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            {...fieldRegister}
            placeholder={field.label}
            disabled={readonly}
          />
        );
    }
  };

  const addDetailRow = () => {
    setDetailRows([...detailRows, {}]);
  };

  const removeDetailRow = (index: number) => {
    setDetailRows(detailRows.filter((_, i) => i !== index));
  };

  const updateDetailRow = (index: number, field: string, value: any) => {
    const updatedRows = [...detailRows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setDetailRows(updatedRows);
  };

  const onFormSubmit = (data: FormData) => {
    const headerData: any = {};
    const detailData: any[] = [];

    // Separate header and detail data
    config.fields.forEach(field => {
      if (config.headerFields.includes(field.name)) {
        headerData[field.name] = data[field.name];
      }
    });

    // Process detail rows
    detailRows.forEach(row => {
      const detailRow: any = {};
      config.detailFields.forEach(field => {
        detailRow[field] = row[field];
      });
      detailData.push(detailRow);
    });

    onSubmit({
      headerData,
      detailData
    });
  };

  const headerFields = config.fields.filter(field => 
    config.headerFields.includes(field.name)
  );

  const detailFields = config.fields.filter(field => 
    config.detailFields.includes(field.name)
  );

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Header Fields */}
      {headerFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Header Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {headerFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderField(field)}
                {errors[field.name] && (
                  <p className="text-sm text-red-500">{errors[field.name]?.message}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Detail Fields */}
      {detailFields.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Detail Items</CardTitle>
              {!readonly && (
                <Button type="button" variant="outline" size="sm" onClick={addDetailRow}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {detailRows.map((row, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Item {index + 1}</span>
                    {!readonly && detailRows.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDetailRow(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {detailFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {renderField(field, row[field.name], (value) => 
                          updateDetailRow(index, field.name, value)
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simple Fields (neither header nor detail) */}
      {config.fields.filter(field => 
        !config.headerFields.includes(field.name) && 
        !config.detailFields.includes(field.name)
      ).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.fields
              .filter(field => 
                !config.headerFields.includes(field.name) && 
                !config.detailFields.includes(field.name)
              )
              .map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                  {errors[field.name] && (
                    <p className="text-sm text-red-500">{errors[field.name]?.message}</p>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {!readonly && (
        <div className="flex justify-end">
          <Button type="submit">Submit Form</Button>
        </div>
      )}
    </form>
  );
}