import { BlueprintGraph, DataSourceGroup, DataField } from "@/types";
import {
  getDirectDependencies,
  getNodeById,
  getFormDefinitionForNode,
} from "@/lib/dag";
import { PrefillDataSource } from "./PrefillDataSource";

/**
 * Provides fields from forms that the target form directly depends on.
 * E.g., if Form D depends on Form B, this source provides Form B's fields.
 */
export class DirectDependencySource implements PrefillDataSource {
  readonly id = "direct-dependencies";
  readonly name = "Direct Dependencies";

  getAvailableData(
    graph: BlueprintGraph,
    targetNodeId: string
  ): DataSourceGroup[] {
    const directDeps = getDirectDependencies(graph, targetNodeId);

    return directDeps
      .map((depNodeId) => {
        const node = getNodeById(graph, depNodeId);
        const formDef = getFormDefinitionForNode(graph, depNodeId);
        if (!node || !formDef) return null;

        const fields: DataField[] = Object.entries(
          formDef.field_schema.properties
        )
          .filter(([_, prop]) => prop.avantos_type !== "button")
          .map(([key, prop]) => ({
            fieldKey: key,
            fieldLabel: prop.title || key,
          }));

        return {
          sourceId: depNodeId,
          sourceName: node.data.name,
          sourceType: "form" as const,
          fields,
        };
      })
      .filter((group): group is DataSourceGroup => group !== null);
  }
}
