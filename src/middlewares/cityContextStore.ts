import { AsyncLocalStorage } from 'node:async_hooks';

interface CityContext {
  cityId?: string;
}

const storage = new AsyncLocalStorage<CityContext>();

/**
 * Runs `fn` (and everything it awaits) inside a request-scoped tenant context.
 *
 * The tenant middleware wraps each request with this so that downstream code —
 * notably `getCurrentCityId()` on create paths — can read the cityId carried by
 * the JWT without it being threaded through every signature.
 */
export function runWithCityContext<T>(
  cityId: string | undefined,
  fn: () => T,
): T {
  return storage.run({ cityId }, fn);
}

/**
 * Returns the cityId of the request currently being handled, or `undefined`
 * when there is no request context (e.g. seeding, startup, scripts).
 */
export function getRequestCityId(): string | undefined {
  return storage.getStore()?.cityId;
}
