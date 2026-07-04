import { getRequestCityId } from '../../../middlewares/cityContextStore.js';
import { prisma } from './prismaClient.js';

let cachedDefaultCityId: string | null = null;

/**
 * Resolves the City tenant a record belongs to when persisting it.
 *
 * It prefers the cityId carried by the current request (set from the JWT by the
 * tenant middleware), so authenticated creates are scoped to the caller's city.
 * When there is no request context — seeding, startup, or unauthenticated
 * onboarding (e.g. user registration) — it falls back to the oldest existing
 * City.
 */
export async function getCurrentCityId(): Promise<string> {
  const requestCityId = getRequestCityId();
  if (requestCityId) return requestCityId;

  return getDefaultCityId();
}

async function getDefaultCityId(): Promise<string> {
  if (cachedDefaultCityId) return cachedDefaultCityId;

  const city = await prisma.city.findFirst({
    where: { deletedAt: null },
    orderBy: { createdAt: 'asc' },
  });

  if (!city) {
    throw new Error(
      'No City tenant exists. Create a city before persisting tenant-scoped records.',
    );
  }

  cachedDefaultCityId = city.id;
  return cachedDefaultCityId;
}
