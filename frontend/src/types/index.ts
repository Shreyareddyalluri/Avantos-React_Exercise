// ─── API Response Types (from action-blueprint-graph-get) ───

export interface BlueprintGraph {
  $schema?: string;
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  category: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: FormDefinition[];
  branches: unknown[];
  triggers: unknown[];
}

export interface GraphNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: GraphNodeData;
}

export interface GraphNodeData {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  prerequisites: string[];
  permitted_roles: string[];
  input_mapping: Record<string, PrefillMapping>;
  sla_duration: { number: number; unit: string };
  approval_required: boolean;
  approval_roles: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface FormDefinition {
  id: string;
  name: string;
  description: string;
  is_reusable: boolean;
  field_schema: FieldSchema;
  ui_schema: UISchema;
  dynamic_field_config: Record<string, unknown>;
}

export interface FieldSchema {
  type: string;
  properties: Record<string, FieldProperty>;
  required: string[];
}

export interface FieldProperty {
  avantos_type: string;
  title?: string;
  type: string;
  format?: string;
  items?: unknown;
  enum?: unknown;
  uniqueItems?: boolean;
}

export interface UISchema {
  type: string;
  elements: UISchemaElement[];
}

export interface UISchemaElement {
  type: string;
  scope: string;
  label: string;
  options?: Record<string, unknown>;
}

// ─── Prefill Domain Types ───

/** A single prefill mapping: "this field gets its value from sourceForm.sourceField" */
export interface PrefillMapping {
  sourceFormNodeId: string;
  sourceFormName: string;
  sourceFieldKey: string;
}

/** A field available for selection in the prefill modal */
export interface DataField {
  fieldKey: string;
  fieldLabel: string;
}

/** A group of fields from a single data source */
export interface DataSourceGroup {
  sourceId: string;
  sourceName: string;
  sourceType: "form" | "global";
  fields: DataField[];
}
