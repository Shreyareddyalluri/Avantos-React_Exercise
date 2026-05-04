import { useState, useCallback } from "react";
import { PrefillMapping } from "@/types";

/**
 * Manages the prefill mapping state for all forms.
 * Maps: formNodeId -> fieldKey -> PrefillMapping
 */
export function usePrefillMappings() {
  const [mappings, setMappings] = useState<
    Record<string, Record<string, PrefillMapping>>
  >({});

  const setMapping = useCallback(
    (
      targetNodeId: string,
      targetFieldKey: string,
      mapping: PrefillMapping
    ) => {
      setMappings((prev) => ({
        ...prev,
        [targetNodeId]: {
          ...(prev[targetNodeId] || {}),
          [targetFieldKey]: mapping,
        },
      }));
    },
    []
  );

  const clearMapping = useCallback(
    (targetNodeId: string, targetFieldKey: string) => {
      setMappings((prev) => {
        const formMappings = { ...(prev[targetNodeId] || {}) };
        delete formMappings[targetFieldKey];
        return { ...prev, [targetNodeId]: formMappings };
      });
    },
    []
  );

  const getMappingsForNode = useCallback(
    (nodeId: string): Record<string, PrefillMapping> => {
      return mappings[nodeId] || {};
    },
    [mappings]
  );

  return { mappings, setMapping, clearMapping, getMappingsForNode };
}
