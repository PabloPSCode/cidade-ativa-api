import { Injectable } from '@nestjs/common';
import type { ICityCatalogSeeder } from '../../domain/services/ICityCatalogSeeder.js';
import { prisma } from '../database/prisma/prismaClient.js';
import { logger } from '../logger/logger.js';
import { coolActions } from './seedCoolActions.js';
import { publicPhones } from './seedPublicPhones.js';

@Injectable()
export class CityCatalogSeeder implements ICityCatalogSeeder {
  async seedForCity(cityId: string): Promise<void> {
    await this.seedCoolActions(cityId);
    await this.seedPublicPhones(cityId);
  }

  private async seedCoolActions(cityId: string): Promise<void> {
    try {
      const existing = await prisma.coolAction.count({ where: { cityId } });
      if (existing > 0) return;

      await prisma.coolAction.createMany({
        data: coolActions.map((action) => ({ ...action, cityId })),
      });
      logger.info({
        module: 'CityCatalog',
        action: 'seedCoolActions',
        message: `Seeded ${coolActions.length} cool actions for city ${cityId}.`,
      });
    } catch (error) {
      logger.error({
        module: 'CityCatalog',
        action: 'seedCoolActions',
        message: `Failed to seed cool actions for city ${cityId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  }

  private async seedPublicPhones(cityId: string): Promise<void> {
    try {
      const existing = await prisma.publicPhone.count({ where: { cityId } });
      if (existing > 0) return;

      await prisma.publicPhone.createMany({
        data: publicPhones.map((phone) => ({ ...phone, cityId })),
      });
      logger.info({
        module: 'CityCatalog',
        action: 'seedPublicPhones',
        message: `Seeded ${publicPhones.length} public phones for city ${cityId}.`,
      });
    } catch (error) {
      logger.error({
        module: 'CityCatalog',
        action: 'seedPublicPhones',
        message: `Failed to seed public phones for city ${cityId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  }
}
