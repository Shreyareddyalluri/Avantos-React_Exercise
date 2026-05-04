"use client";

import { useState, useMemo } from "react";
import { DataSourceGroup } from "@/types";
import styles from "./PrefillModal.module.css";

interface PrefillModalProps {
  isOpen: boolean;
  availableData: DataSourceGroup[];
  onSelect: (sourceId: string, sourceName: string, fieldKey: string) => void;
  onCancel: () => void;
}

export function PrefillModal({
  isOpen,
  availableData,
  onSelect,
  onCancel,
}: PrefillModalProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState<{
    sourceId: string;
    sourceName: string;
    fieldKey: string;
  } | null>(null);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return availableData;
    const q = searchQuery.toLowerCase();
    return availableData
      .map((group) => ({
        ...group,
        fields: group.fields.filter(
          (f) =>
            f.fieldKey.toLowerCase().includes(q) ||
            f.fieldLabel.toLowerCase().includes(q) ||
            group.sourceName.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.fields.length > 0);
  }, [availableData, searchQuery]);

  if (!isOpen) return null;

  const handleSelect = () => {
    if (selectedField) {
      onSelect(
        selectedField.sourceId,
        selectedField.sourceName,
        selectedField.fieldKey
      );
      setSelectedField(null);
      setExpandedGroup(null);
      setSearchQuery("");
    }
  };

  const handleCancel = () => {
    setSelectedField(null);
    setExpandedGroup(null);
    setSearchQuery("");
    onCancel();
  };

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Select data element to map</h3>

        <div className={styles.body}>
          <div className={styles.sidebar}>
            <p className={styles.sidebarLabel}>Available data</p>
            <div className={styles.searchWrapper}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <ul className={styles.groupList}>
              {filteredData.map((group) => (
                <li key={group.sourceId}>
                  <button
                    className={`${styles.groupButton} ${
                      expandedGroup === group.sourceId ? styles.groupActive : ""
                    }`}
                    onClick={() =>
                      setExpandedGroup(
                        expandedGroup === group.sourceId
                          ? null
                          : group.sourceId
                      )
                    }
                  >
                    <span className={styles.chevron}>
                      {expandedGroup === group.sourceId ? "▾" : "▸"}
                    </span>
                    {group.sourceName}
                  </button>

                  {expandedGroup === group.sourceId && (
                    <ul className={styles.fieldList}>
                      {group.fields.map((field) => (
                        <li key={field.fieldKey}>
                          <button
                            className={`${styles.fieldButton} ${
                              selectedField?.sourceId === group.sourceId &&
                              selectedField?.fieldKey === field.fieldKey
                                ? styles.fieldSelected
                                : ""
                            }`}
                            onClick={() =>
                              setSelectedField({
                                sourceId: group.sourceId,
                                sourceName: group.sourceName,
                                fieldKey: field.fieldKey,
                              })
                            }
                          >
                            {field.fieldKey}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.preview}>
            {selectedField ? (
              <p className={styles.previewText}>
                <strong>{selectedField.sourceName}</strong> →{" "}
                {selectedField.fieldKey}
              </p>
            ) : (
              <p className={styles.previewEmpty}>
                Select a field from the left panel
              </p>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            CANCEL
          </button>
          <button
            className={styles.selectButton}
            disabled={!selectedField}
            onClick={handleSelect}
          >
            SELECT
          </button>
        </div>
      </div>
    </div>
  );
}
