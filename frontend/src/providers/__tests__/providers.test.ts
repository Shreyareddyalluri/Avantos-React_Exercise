import { DirectDependencySource } from "../DirectDependencySource";
import { TransitiveDependencySource } from "../TransitiveDependencySource";
import { GlobalDataSource } from "../GlobalDataSource";
import { BlueprintGraph } from "@/types";

// Same graph: A → B → D, A → C → E
const mockGraph: BlueprintGraph = {
  id: "test",
  tenant_id: "1",
  name: "Test",
  description: "",
  category: "",
  nodes: [
    {
      id: "node-a", type: "form", position: { x: 0, y: 0 },
      data: { id: "d-a", component_key: "node-a", component_type: "form", component_id: "form-1", name: "Form A", prerequisites: [], permitted_roles: [], input_mapping: {}, sla_duration: { number: 0, unit: "minutes" }, approval_required: false, approval_roles: [] },
    },
    {
      id: "node-b", type: "form", position: { x: 1, y: 0 },
      data: { id: "d-b", component_key: "node-b", component_type: "form", component_id: "form-1", name: "Form B", prerequisites: ["node-a"], permitted_roles: [], input_mapping: {}, sla_duration: { number: 0, unit: "minutes" }, approval_required: false, approval_roles: [] },
    },
    {
      id: "node-d", type: "form", position: { x: 2, y: 0 },
      data: { id: "d-d", component_key: "node-d", component_type: "form", component_id: "form-1", name: "Form D", prerequisites: ["node-b"], permitted_roles: [], input_mapping: {}, sla_duration: { number: 0, unit: "minutes" }, approval_required: false, approval_roles: [] },
    },
  ],
  edges: [
    { source: "node-a", target: "node-b" },
    { source: "node-b", target: "node-d" },
  ],
  forms: [
    {
      id: "form-1", name: "Test Form", description: "", is_reusable: false,
      field_schema: { type: "object", properties: { email: { avantos_type: "short-text", title: "Email", type: "string" }, name: { avantos_type: "short-text", title: "Name", type: "string" } }, required: ["email"] },
      ui_schema: { type: "VerticalLayout", elements: [] },
      dynamic_field_config: {},
    },
  ],
  branches: [],
  triggers: [],
};

describe("DirectDependencySource", () => {
  const source = new DirectDependencySource();

  it("returns empty for root node", () => {
    const data = source.getAvailableData(mockGraph, "node-a");
    expect(data).toHaveLength(0);
  });

  it("returns direct parent Form A for node-b", () => {
    const data = source.getAvailableData(mockGraph, "node-b");
    expect(data).toHaveLength(1);
    expect(data[0].sourceName).toBe("Form A");
    expect(data[0].fields.map((f) => f.fieldKey)).toContain("email");
  });

  it("returns direct parent Form B for node-d (not Form A)", () => {
    const data = source.getAvailableData(mockGraph, "node-d");
    expect(data).toHaveLength(1);
    expect(data[0].sourceName).toBe("Form B");
  });
});

describe("TransitiveDependencySource", () => {
  const source = new TransitiveDependencySource();

  it("returns empty for root node", () => {
    const data = source.getAvailableData(mockGraph, "node-a");
    expect(data).toHaveLength(0);
  });

  it("returns empty for node-b (only direct dep, no transitive)", () => {
    const data = source.getAvailableData(mockGraph, "node-b");
    expect(data).toHaveLength(0);
  });

  it("returns Form A for node-d (transitive ancestor, not direct)", () => {
    const data = source.getAvailableData(mockGraph, "node-d");
    expect(data).toHaveLength(1);
    expect(data[0].sourceName).toBe("Form A");
  });
});

describe("GlobalDataSource", () => {
  const source = new GlobalDataSource();

  it("returns global data groups regardless of node", () => {
    const data = source.getAvailableData(mockGraph, "node-a");
    expect(data.length).toBeGreaterThanOrEqual(2);
    const names = data.map((d) => d.sourceName);
    expect(names).toContain("Action Properties");
    expect(names).toContain("Client Organisation Properties");
  });

  it("all groups have sourceType 'global'", () => {
    const data = source.getAvailableData(mockGraph, "node-d");
    data.forEach((group) => expect(group.sourceType).toBe("global"));
  });
});
