import { BlueprintGraph, DataSourceGroup } from "@/types";

/**
 * Interface for data sources that can provide prefill data for a form.
 *
 * To add a new data source:
 * 1. Create a class implementing this interface
 * 2. Register it in src/providers/registry.ts
 *
 * That's it — no other code changes needed.
 */
export interface PrefillDataSource {
  /** Unique identifier for this data source type */
  readonly id: string;

  /** Human-readable name shown in the UI */
  readonly name: string;

  /**
   * Returns the available data groups for a given form node.
   * Each group represents a source (e.g., a parent form) and its fields.
   *
   * @param graph - The full blueprint graph
   * @param targetNodeId - The node whose fields we want to prefill
   * @returns Array of data source groups with their available fields
   */
  getAvailableData(
    graph: BlueprintGraph,
    targetNodeId: string
  ): DataSourceGroup[];
}
