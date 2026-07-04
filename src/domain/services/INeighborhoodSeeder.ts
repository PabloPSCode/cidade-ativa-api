export interface INeighborhoodSeeder {
  /**
   * Populates the neighborhoods of a city from its name. Idempotent: it must
   * skip cities that already have neighborhoods so they are never duplicated.
   * The same neighborhood name may exist for different cities.
   *
   * Implementations must be self-contained: log and swallow failures rather
   * than throwing, so callers can run it in the background (fire-and-forget)
   * without blocking their response on a slow external lookup.
   */
  seedForCity(city: { id: string; name: string }): Promise<void>;
}
