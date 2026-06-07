import { logger } from '../logger/logger.js';

export interface Seed {
  name: string;
  isPending(): Promise<boolean>;
  run(): Promise<void>;
}

export async function runSeeds(seeds: Seed[]): Promise<void> {
  for (const seed of seeds) {
    const pending = await seed.isPending();
    if (!pending) {
      logger.debug({
        module: 'SeedRunner',
        action: 'check',
        message: `Seed already applied: ${seed.name}`,
      });
      continue;
    }
    logger.info({
      module: 'SeedRunner',
      action: 'run',
      message: `Running seed: ${seed.name}`,
    });
    await seed.run();
    logger.info({
      module: 'SeedRunner',
      action: 'run',
      message: `Seed completed: ${seed.name}`,
    });
  }
}
