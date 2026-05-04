import { PrefillDataSource } from "./PrefillDataSource";
import { DirectDependencySource } from "./DirectDependencySource";
import { TransitiveDependencySource } from "./TransitiveDependencySource";
import { GlobalDataSource } from "./GlobalDataSource";

/**
 * Registry of all active prefill data sources.
 *
 * To add a new data source:
 * 1. Create a class implementing PrefillDataSource
 * 2. Add an instance to this array
 *
 * To remove a data source, simply remove it from this array.
 * No other code changes are required.
 */
const dataSources: PrefillDataSource[] = [
  new DirectDependencySource(),
  new TransitiveDependencySource(),
  new GlobalDataSource(),
];

export function getRegisteredDataSources(): PrefillDataSource[] {
  return dataSources;
}

export function getDataSourceById(id: string): PrefillDataSource | undefined {
  return dataSources.find((ds) => ds.id === id);
}
