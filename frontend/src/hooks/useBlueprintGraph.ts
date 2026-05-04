import { useState, useEffect } from "react";
import { BlueprintGraph } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Fetches the blueprint graph from the mock server.
 * The URL pattern matches the server's route:
 *   /api/v1/{tenant_id}/actions/blueprints/{blueprint_id}/graph
 */
export function useBlueprintGraph() {
  const [graph, setGraph] = useState<BlueprintGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGraph() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/1/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/graph`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BlueprintGraph = await res.json();
        setGraph(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch graph");
      } finally {
        setLoading(false);
      }
    }
    fetchGraph();
  }, []);

  return { graph, loading, error };
}
