export interface ICityCatalogSeeder {
  /**
   * Seeds a city's default catalog — cool actions and public phones — from its
   * cityId. Idempotent per table: it must skip a table that already has records
   * for the city, so existing data is never duplicated.
   *
   * Implementations must be self-contained: log and swallow failures rather
   * than throwing, so callers (e.g. admin onboarding) are never broken by a
   * seeding hiccup.
   */
  seedForCity(cityId: string): Promise<void>;
}
