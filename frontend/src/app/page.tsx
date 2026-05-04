"use client";

import { useState } from "react";
import { useBlueprintGraph } from "@/hooks/useBlueprintGraph";
import { usePrefillMappings } from "@/hooks/usePrefillMappings";
import { useAvailablePrefillData } from "@/hooks/useAvailablePrefillData";
import { FormList } from "@/components/FormList/FormList";
import { PrefillPanel } from "@/components/PrefillPanel/PrefillPanel";
import { PrefillModal } from "@/components/PrefillModal/PrefillModal";
import styles from "./page.module.css";

export default function Home() {
  const { graph, loading, error } = useBlueprintGraph();
  const { setMapping, clearMapping, getMappingsForNode } =
    usePrefillMappings();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [modalFieldKey, setModalFieldKey] = useState<string | null>(null);

  // Ensure strict boolean
  const isReadyForPrefill = !!graph && !!selectedNodeId;

  const availableData = useAvailablePrefillData(
    graph,
    selectedNodeId ?? null
  );

  if (loading) {
    return (
      <div className={styles.center}>
        <p>Loading blueprint graph…</p>
      </div>
    );
  }

  if (error || !graph) {
    return (
      <div className={styles.center}>
        <p className={styles.error}>
          Failed to load graph: {error}
          <br />
          <small>
            Make sure the backend server is running on{" "}
            {process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}
          </small>
        </p>
      </div>
    );
  }

  const currentMappings = selectedNodeId
    ? getMappingsForNode(selectedNodeId)
    : {};

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.appTitle}>{graph.name}</h1>
        <p className={styles.appSubtitle}>
          {graph.nodes.length} forms · Prefill configuration
        </p>
      </header>

      <div className={styles.workspace}>
        <FormList
          nodes={graph.nodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
        />

        {selectedNodeId ? (
          <PrefillPanel
            graph={graph}
            selectedNodeId={selectedNodeId}
            mappings={currentMappings}
            onFieldClick={(fieldKey) => setModalFieldKey(fieldKey)}
            onClearMapping={(fieldKey) =>
              clearMapping(selectedNodeId, fieldKey)
            }
          />
        ) : (
          <div className={styles.emptyState}>
            <p>Select a form to configure its prefill mappings</p>
          </div>
        )}
      </div>

      <PrefillModal
        isOpen={isReadyForPrefill && modalFieldKey !== null}
        availableData={isReadyForPrefill ? availableData : []}
        onSelect={(sourceId, sourceName, fieldKey) => {
          if (selectedNodeId && modalFieldKey) {
            setMapping(selectedNodeId, modalFieldKey, {
              sourceType: "form",       // ✅ REQUIRED
              sourceId: sourceId,       // ✅ matches type
              sourceName: sourceName,   // ✅ matches type
              fieldKey: fieldKey,       // ✅ matches type
            });
          }
          setModalFieldKey(null);
        }}
        onCancel={() => setModalFieldKey(null)}
      />
    </main>
  );
}