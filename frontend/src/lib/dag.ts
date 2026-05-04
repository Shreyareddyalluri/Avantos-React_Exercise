import { BlueprintGraph, GraphNode } from "@/types";

/**
 * Returns the IDs of nodes that are direct predecessors (parents) of the given node.
 * A predecessor is any node whose edge points TO the given node
 * (i.e., edge.target === nodeId, so edge.source is the predecessor).
 */
export function getDirectDependencies(
  graph: BlueprintGraph,
  nodeId: string
): string[] {
  return graph.edges
    .filter((edge) => edge.target === nodeId)
    .map((edge) => edge.source);
}

/**
 * Returns all ancestor node IDs by walking up the DAG recursively.
 * Uses BFS to avoid stack overflow on deep graphs.
 */
export function getTransitiveDependencies(
  graph: BlueprintGraph,
  nodeId: string
): string[] {
  const visited = new Set<string>();
  const queue = [...getDirectDependencies(graph, nodeId)];

  // We guard against cycles using a visited set,
  // even though the backend guarantees a DAG.
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    const parents = getDirectDependencies(graph, current);
    queue.push(...parents);
  }

  return Array.from(visited);
}

/**
 * Returns all upstream node IDs: direct + transitive dependencies.
 * This is every form whose fields could be used to prefill the target form.
 */
export function getAllUpstreamDependencies(
  graph: BlueprintGraph,
  nodeId: string
): string[] {
  return getTransitiveDependencies(graph, nodeId);
}

/**
 * Resolves a node ID to its GraphNode object.
 */
export function getNodeById(
  graph: BlueprintGraph,
  nodeId: string
): GraphNode | undefined {
  return graph.nodes.find((node) => node.id === nodeId);
}

/**
 * Given a node, returns the FormDefinition (field schema) for that node
 * by matching node.data.component_id to forms[].id.
 */
export function getFormDefinitionForNode(
  graph: BlueprintGraph,
  nodeId: string
) {
  const node = getNodeById(graph, nodeId);
  if (!node) return undefined;
  return graph.forms.find((form) => form.id === node.data.component_id);
}

/**
 * Returns field keys for a given node (the list of fields on its form).
 * Excludes button-type fields since they aren't data fields.
 */
export function getFieldKeysForNode(
  graph: BlueprintGraph,
  nodeId: string
): string[] {
  const formDef = getFormDefinitionForNode(graph, nodeId);
  if (!formDef) return [];

  return Object.entries(formDef.field_schema.properties)
    .filter(([_, prop]) => prop.avantos_type !== "button")
    .map(([key]) => key);
}
