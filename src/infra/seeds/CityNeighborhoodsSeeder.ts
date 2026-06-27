import { Injectable } from '@nestjs/common';
import type { INeighborhoodSeeder } from '../../domain/services/INeighborhoodSeeder.js';
import { prisma } from '../database/prisma/prismaClient.js';
import { listNeighborhoodsByCity } from '../integrations/openai/cityNeighborhoods.js';
import { logger } from '../logger/logger.js';

@Injectable()
export class CityNeighborhoodsSeeder implements INeighborhoodSeeder {
  /**
   * Seeds the neighborhoods for a single city, derived from its name. Skips
   * cities that already have neighborhoods so nothing is duplicated —
   * uniqueness is scoped per city via cityId, so the same neighborhood name can
   * still exist for other cities.
   */
  async seedForCity(city: { id: string; name: string }): Promise<void> {
    const cityName = city.name.trim();
    try {
      const existing = await prisma.neighborhood.count({
        where: { cityId: city.id },
      });
      if (existing > 0) return;

      const neighborhoods = await listNeighborhoodsByCity(cityName);
      if (neighborhoods.length === 0) return;

      await prisma.neighborhood.createMany({
        data: neighborhoods.map((name) => ({
          name,
          cityName,
          cityId: city.id,
        })),
      });

      logger.info({
        module: 'CityNeighborhoods',
        action: 'seedForCity',
        message: `Seeded ${neighborhoods.length} neighborhoods for "${cityName}".`,
      });
    } catch (error) {
      logger.error({
        module: 'CityNeighborhoods',
        action: 'seedForCity',
        message: `Failed to seed neighborhoods for "${cityName}": ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  }

  /**
   * Seeds neighborhoods for every city that does not have any yet. Safe to run
   * repeatedly (e.g. on startup) — already-populated cities are left untouched.
   */
  async seedMissing(): Promise<void> {
    const cities = await prisma.city.findMany({
      where: { deletedAt: null, neighborhoods: { none: {} } },
      select: { id: true, name: true },
    });

    for (const city of cities) {
      await this.seedForCity(city);
    }
  }
}
