import { PrefillDataSource } from "./PrefillDataSource";
import { DirectDependencySource } from "./DirectDependencySource";
import { TransitiveDependencySource } from "./TransitiveDependencySource";
import { GlobalDataSource } from "./GlobalDataSource";

// Central registry for managing all PrefillDataSource instances
const registry = new Map<string, PrefillDataSource>();

/**
 * Registers a new data source in the registry
 * @param source - The PrefillDataSource to register
 */
export function registerDataSource(source: PrefillDataSource) {
  registry.set(source.id, source);
}

/**
 * Retrieves all registered data sources
 * @returns Array of all PrefillDataSource instances
 */
export function getRegisteredDataSources(): PrefillDataSource[] {
  return Array.from(registry.values());
}

/**
 * Retrieves a specific data source by its id
 * @param id - The identifier of the data source
 * @returns The PrefillDataSource if found, otherwise undefined
 */
export function getDataSourceById(id: string): PrefillDataSource | undefined {
  return registry.get(id);
}

// Initial registration (can be moved elsewhere if needed)
registerDataSource(new DirectDependencySource());
registerDataSource(new TransitiveDependencySource());
registerDataSource(new GlobalDataSource());