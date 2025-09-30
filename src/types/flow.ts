export interface FlowNode {
  id: string;
  type: 'start' | 'form' | 'decision' | 'approval' | 'end';
  position: { x: number; y: number };
  data: {
    label: string;
    config?: Record<string, any>;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  condition?: string;
}

export interface FlowDefinition {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'dropdown';
  required: boolean;
  dataSource?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface FormConfig {
  fields: FormField[];
  headerFields: string[];
  detailFields: string[];
}

export interface DecisionConfig {
  conditions: Array<{
    expression: string;
    target: string;
  }>;
  defaultTarget: string;
}

export interface ApprovalConfig {
  assignees: string[];
  requiredApprovals: number;
  title: string;
  description?: string;
}