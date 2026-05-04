import {
  BlueprintGraph,
  DataSourceGroup,
  DataField,
  FieldProperty,
} from "@/types";
import {
  getDirectDependencies,
  getTransitiveDependencies,
  getNodeById,
  getFormDefinitionForNode,
} from "@/lib/dag";
import { PrefillDataSource } from "./PrefillDataSource";

/**
 * Provides fields from forms that the target form transitively depends on.
 * These are ancestors that are NOT direct parents — e.g., grandparents in the DAG.
 *
 * If Form D → Form B → Form A, and we're looking at Form D:
 *   - DirectDependencySource provides Form B
 *   - This source provides Form A (transitive, not direct)
 */
export class TransitiveDependencySource implements PrefillDataSource {
  readonly id = "transitive-dependencies";
  readonly name = "Transitive Dependencies";

  getAvailableData(
    graph: BlueprintGraph,
    targetNodeId: string
  ): DataSourceGroup[] {
    const directDeps = new Set(getDirectDependencies(graph, targetNodeId));
    const allAncestors = getTransitiveDependencies(graph, targetNodeId);

    const transitiveOnly = Array.from(
      new Set(allAncestors.filter((id) => !directDeps.has(id)))
    );

    return transitiveOnly.flatMap((depNodeId) => {
      const node = getNodeById(graph, depNodeId);
      const formDef = getFormDefinitionForNode(graph, depNodeId);
      if (!node || !formDef) return [];

      const properties = formDef.field_schema
        .properties as Record<string, FieldProperty>;

      const fields: DataField[] = Object.entries(properties)
        .filter(([_, prop]) => prop.avantos_type !== "button")
        .map(([key, prop]) => ({
          fieldKey: key,
          fieldLabel: prop.title ?? key,
        }));

      return [
        {
          sourceId: depNodeId,
          sourceName: node.data.name,
          sourceType: "form" as const,
          fields,
        },
      ];
    });
  }
}