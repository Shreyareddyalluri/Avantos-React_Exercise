"use client";

import { GraphNode } from "@/types";
import styles from "./FormList.module.css";

interface FormListProps {
  nodes: GraphNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}

export function FormList({ nodes, selectedNodeId, onSelectNode }: FormListProps) {
  // Sort by x position to approximate DAG left-to-right order
  const sorted = [...nodes].sort((a, b) => a.position.x - b.position.x);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Forms</h2>
      <ul className={styles.list}>
        {sorted.map((node) => (
          <li key={node.id}>
            <button
              className={`${styles.item} ${
                selectedNodeId === node.id ? styles.selected : ""
              }`}
              onClick={() => onSelectNode(node.id)}
            >
              <span className={styles.icon}>📋</span>
              <div>
                <div className={styles.name}>{node.data.name}</div>
                <div className={styles.meta}>
                  {node.data.prerequisites.length === 0
                    ? "No dependencies"
                    : `${node.data.prerequisites.length} prerequisite(s)`}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
