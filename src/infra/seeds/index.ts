import type { Seed } from './SeedRunner.js';
import { seedPublicPhones } from './seedPublicPhones.js';
import { seedSolicitationTypes } from './seedSolicitationTypes.js';
import { seedUFsAndCities } from './seedUFsAndCities.js';

export const seeds: Seed[] = [
  seedUFsAndCities,
  seedSolicitationTypes,
  seedPublicPhones,
];
