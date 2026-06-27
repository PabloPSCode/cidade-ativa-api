import { getEnv } from '../../config/env.js';
import { getRequestCityId } from '../../../middlewares/cityContextStore.js';
import { prisma } from './prismaClient.js';

let cachedDefaultCityId: string | null = null;

/**
 * Resolves the City tenant a record belongs to when persisting it.
 *
 * It prefers the cityId carried by the current request (set from the JWT by the
 * tenant middleware), so authenticated creates are scoped to the caller's city.
 * When there is no request context — seeding, startup, or unauthenticated
 * onboarding (e.g. user registration) — it falls back to the default City
 * (matched by the CITY_NAME env var, then the first available City).
 */
export async function getCurrentCityId(): Promise<string> {
  const requestCityId = getRequestCityId();
  if (requestCityId) return requestCityId;

  return getDefaultCityId();
}

async function getDefaultCityId(): Promise<string> {
  if (cachedDefaultCityId) return cachedDefaultCityId;

  const name = getEnv().cityName.trim();
  const city =
    (name
      ? await prisma.city.findFirst({ where: { name, deletedAt: null } })
      : null) ?? (await prisma.city.findFirst({ where: { deletedAt: null } }));

  if (!city) {
    throw new Error(
      'No City tenant is configured. Ensure the City seed has run before persisting records.',
    );
  }

  cachedDefaultCityId = city.id;
  return cachedDefaultCityId;
}

export function resetCityContextCache(): void {
  cachedDefaultCityId = null;
}
