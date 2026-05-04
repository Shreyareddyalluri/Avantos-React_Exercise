import {
  getDirectDependencies,
  getTransitiveDependencies,
  getAllUpstreamDependencies,
  getFieldKeysForNode,
} from "../dag";
import { BlueprintGraph } from "@/types";

/**
 * Test graph structure (matches the challenge screenshot):
 *
 *   Form A ──→ Form B ──→ Form D
 *     │                      ↑
 *     └──→ Form C ──→ Form E ┘
 *                       (Form F depends on Form D and Form E)
 */
const mockGraph: BlueprintGraph = {
  id: "test-graph",
  tenant_id: "1",
  name: "Test",
  description: "",
  category: "",
  nodes: [
    {
      id: "node-a",
      type: "form",
      position: { x: 0, y: 0 },
      data: {
        id: "d-a",
        component_key: "node-a",
        component_type: "form",
        component_id: "form-def-1",
        name: "Form A",
        prerequisites: [],
        permitted_roles: [],
        input_mapping: {},
        sla_duration: { number: 0, unit: "minutes" },
        approval_required: false,
        approval_roles: [],
      },
    },
    {
      id: "node-b",
      type: "form",
      position: { x: 1, y: 0 },
      data: {
        id: "d-b",
        component_key: "node-b",
        component_type: "form",
        component_id: "form-def-1",
        name: "Form B",
        prerequisites: ["node-a"],
        permitted_roles: [],
        input_mapping: {},
        sla_duration: { number: 0, unit: "minutes" },
        approval_required: false,
        approval_roles: [],
      },
    },
    {
      id: "node-c",
      type: "form",
      position: { x: 1, y: 1 },
      data: {
        id: "d-c",
        component_key: "node-c",
        component_type: "form",
        component_id: "form-def-1",
        name: "Form C",
        prerequisites: ["node-a"],
        permitted_roles: [],
        input_mapping: {},
        sla_duration: { number: 0, unit: "minutes" },
        approval_required: false,
        approval_roles: [],
      },
    },
    {
      id: "node-d",
      type: "form",
      position: { x: 2, y: 0 },
      data: {
        id: "d-d",
        component_key: "node-d",
        component_type: "form",
        component_id: "form-def-1",
        name: "Form D",
        prerequisites: ["node-b"],
        permitted_roles: [],
        input_mapping: {},
        sla_duration: { number: 0, unit: "minutes" },
        approval_required: false,
        approval_roles: [],
      },
    },
    {
      id: "node-e",
      type: "form",
      position: { x: 2, y: 1 },
      data: {
        id: "d-e",
        component_key: "node-e",
        component_type: "form",
        component_id: "form-def-1",
        name: "Form E",
        prerequisites: ["node-c"],
        permitted_roles: [],
        input_mapping: {},
        sla_duration: { number: 0, unit: "minutes" },
        approval_required: false,
        approval_roles: [],
      },
    },
  ],
  edges: [
    { source: "node-a", target: "node-b" },
    { source: "node-a", target: "node-c" },
    { source: "node-b", target: "node-d" },
    { source: "node-c", target: "node-e" },
  ],
  forms: [
    {
      id: "form-def-1",
      name: "Test Form",
      description: "",
      is_reusable: false,
      field_schema: {
        type: "object",
        properties: {
          email: { avantos_type: "short-text", title: "Email", type: "string" },
          name: { avantos_type: "short-text", title: "Name", type: "string" },
          button: { avantos_type: "button", title: "Submit", type: "object" },
        },
        required: ["email"],
      },
      ui_schema: { type: "VerticalLayout", elements: [] },
      dynamic_field_config: {},
    },
  ],
  branches: [],
  triggers: [],
};

describe("getDirectDependencies", () => {
  it("returns empty array for root node (Form A)", () => {
    expect(getDirectDependencies(mockGraph, "node-a")).toEqual([]);
  });

  it("returns direct parent for Form B", () => {
    expect(getDirectDependencies(mockGraph, "node-b")).toEqual(["node-a"]);
  });

  it("returns direct parent for Form D", () => {
    expect(getDirectDependencies(mockGraph, "node-d")).toEqual(["node-b"]);
  });
});

describe("getTransitiveDependencies", () => {
  it("returns empty for root node", () => {
    expect(getTransitiveDependencies(mockGraph, "node-a")).toEqual([]);
  });

  it("returns only direct parent for nodes one level deep", () => {
    const deps = getTransitiveDependencies(mockGraph, "node-b");
    expect(deps).toEqual(["node-a"]);
  });

  it("returns full ancestor chain for Form D (B → A)", () => {
    const deps = getTransitiveDependencies(mockGraph, "node-d");
    expect(deps).toContain("node-b");
    expect(deps).toContain("node-a");
    expect(deps).toHaveLength(2);
  });

  it("returns full ancestor chain for Form E (C → A)", () => {
    const deps = getTransitiveDependencies(mockGraph, "node-e");
    expect(deps).toContain("node-c");
    expect(deps).toContain("node-a");
    expect(deps).toHaveLength(2);
  });
});

describe("getFieldKeysForNode", () => {
  it("excludes button-type fields", () => {
    const keys = getFieldKeysForNode(mockGraph, "node-a");
    expect(keys).toContain("email");
    expect(keys).toContain("name");
    expect(keys).not.toContain("button");
  });
});
