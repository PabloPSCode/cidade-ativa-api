import type { Seed } from './SeedRunner.js';
import { seedCity } from './seedCity.js';
import { seedCoolActions } from './seedCoolActions.js';
import { seedNeighborhoods } from './seedNeighborhoods.js';
import { seedPublicPhones } from './seedPublicPhones.js';
import { seedSolicitationTypes } from './seedSolicitationTypes.js';

export const seeds: Seed[] = [
  seedCity,
  seedSolicitationTypes,
  seedPublicPhones,
  seedCoolActions,
  seedNeighborhoods,
];
