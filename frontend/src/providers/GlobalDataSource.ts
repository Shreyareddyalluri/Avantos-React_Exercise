import { BlueprintGraph, DataSourceGroup } from "@/types";
import { PrefillDataSource } from "./PrefillDataSource";

/**
 * Provides global data sources that are available to all forms
 * regardless of their position in the DAG.
 *
 * These include Action Properties and Client Organisation Properties.
 * In a real implementation, these would come from the API;
 * here we use representative mock data.
 */
export class GlobalDataSource implements PrefillDataSource {
  readonly id = "global-data";
  readonly name = "Global Data";

  getAvailableData(
    _graph: BlueprintGraph,
    _targetNodeId: string
  ): DataSourceGroup[] {
    return [
      {
        sourceId: "action-properties",
        sourceName: "Action Properties",
        sourceType: "global",
        fields: [
          { fieldKey: "action_id", fieldLabel: "Action ID" },
          { fieldKey: "action_name", fieldLabel: "Action Name" },
          { fieldKey: "created_at", fieldLabel: "Created At" },
          { fieldKey: "status", fieldLabel: "Status" },
        ],
      },
      {
        sourceId: "client-org-properties",
        sourceName: "Client Organisation Properties",
        sourceType: "global",
        fields: [
          { fieldKey: "org_id", fieldLabel: "Organisation ID" },
          { fieldKey: "org_name", fieldLabel: "Organisation Name" },
          { fieldKey: "org_email", fieldLabel: "Organisation Email" },
        ],
      },
    ];
  }
}
