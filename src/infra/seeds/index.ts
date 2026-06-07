import type { Seed } from './SeedRunner.js';
import { seedUFsAndCities } from './seedUFsAndCities.js';
import { seedSolicitationTypes } from './seedSolicitationTypes.js';

export const seeds: Seed[] = [seedUFsAndCities, seedSolicitationTypes];
