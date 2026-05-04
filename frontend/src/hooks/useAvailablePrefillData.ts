import { useMemo } from "react";
import { BlueprintGraph, DataSourceGroup } from "@/types";
import { getRegisteredDataSources } from "@/providers";

/**
 * Aggregates available prefill data from all registered data sources.
 */
export function useAvailablePrefillData(
  graph: BlueprintGraph | null,
  targetNodeId: string | null
): DataSourceGroup[] {
  return useMemo(() => {
    // ✅ Guard FIRST — prevents invalid hook execution paths
    if (!graph || !targetNodeId) return [];

    const sources = getRegisteredDataSources();

    return sources.flatMap((source) => {
      try {
        return source.getAvailableData(graph, targetNodeId);
      } catch (e) {
        console.error("Prefill data source failed:", source.id, e);
        return [];
      }
    });
  }, [graph, targetNodeId]);
}