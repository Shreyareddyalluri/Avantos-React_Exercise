import { useMemo } from "react";
import { BlueprintGraph, DataSourceGroup } from "@/types";
import { getRegisteredDataSources } from "@/providers";

/**
 * Aggregates available prefill data from all registered data sources.
 * Each data source contributes its groups independently.
 */
export function useAvailablePrefillData(
  graph: BlueprintGraph | null,
  targetNodeId: string | null
): DataSourceGroup[] {
  return useMemo(() => {
    if (!graph || !targetNodeId) return [];

    const sources = getRegisteredDataSources();
    return sources.flatMap((source) =>
      source.getAvailableData(graph, targetNodeId)
    );
  }, [graph, targetNodeId]);
}
