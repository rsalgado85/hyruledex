/**
 * ItemProvider — Interface for item/equipment data operations
 *
 * For providers that include items or equipment data
 * (e.g. Hyrule Compendium has an equipment category).
 * Currently a stub — PokeAPI items are not used in DashDex.
 */

import type { DataListResponse } from './types';

export interface ItemProvider {
  /** Fetch paginated list of items */
  fetchItemList(): Promise<DataListResponse>;

  /** Fetch a single item by ID or name */
  fetchItem(id: number | string): Promise<unknown>;
}
