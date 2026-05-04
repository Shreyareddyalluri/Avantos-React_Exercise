"use client";

import { BlueprintGraph, PrefillMapping } from "@/types";
import { getFormDefinitionForNode, getNodeById } from "@/lib/dag";
import styles from "./PrefillPanel.module.css";

interface PrefillPanelProps {
  graph: BlueprintGraph;
  selectedNodeId: string;
  mappings: Record<string, PrefillMapping>;
  onFieldClick: (fieldKey: string) => void;
  onClearMapping: (fieldKey: string) => void;
}

export function PrefillPanel({
  graph,
  selectedNodeId,
  mappings,
  onFieldClick,
  onClearMapping,
}: PrefillPanelProps) {
  const node = getNodeById(graph, selectedNodeId);
  const formDef = getFormDefinitionForNode(graph, selectedNodeId);

  if (!node || !formDef) {
    return <div className={styles.container}>Form not found.</div>;
  }

  const fields = Object.entries(formDef.field_schema.properties).filter(
    ([_, prop]) => prop.avantos_type !== "button"
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{node.data.name}</h2>
        <p className={styles.subtitle}>Prefill fields for this form</p>
      </div>

      <div className={styles.fieldList}>
        {fields.map(([key, prop]) => {
          const mapping = mappings[key];
          const isMapped = !!mapping;

          return (
            <div
              key={key}
              className={`${styles.field} ${isMapped ? styles.mapped : styles.unmapped}`}
              onClick={() => !isMapped && onFieldClick(key)}
              role={isMapped ? undefined : "button"}
              tabIndex={isMapped ? undefined : 0}
            >
              <div className={styles.fieldContent}>
                {isMapped ? (
                  <span className={styles.fieldLabel}>
                    {key}: {mapping.sourceName}.{mapping.fieldKey}
                  </span>
                ) : (
                  <span className={styles.fieldLabelEmpty}>
                    {prop.title || key}
                  </span>
                )}
              </div>
              {isMapped && (
                <button
                  className={styles.clearButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearMapping(key);
                  }}
                  aria-label={`Clear prefill for ${key}`}
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
