export const IMAGE_STORAGE_SERVICE = Symbol('IImageStorageService');

/**
 * Uploads images to the configured object storage (Firebase Cloud Storage) and
 * returns the public URL the application should persist.
 *
 * Images arrive as base64 payloads (raw or `data:` URIs). Implementations must:
 * - upload each image under the caller's tenant folder, namespaced by `folder`
 *   (e.g. `<cityId>/solicitations/<file>`), so every city keeps its own assets;
 * - return the public URL of the stored object instead of the base64 payload;
 * - treat a value that is already an http(s) URL as a no-op and return it as
 *   is, so re-submitting an existing image on updates never re-uploads it.
 */
export interface IImageStorageService {
  /**
   * Uploads a single image under `<tenant>/<folder>/` and returns its URL.
   * Returns the input unchanged when it is already a URL.
   */
  uploadImage(image: string, folder: string): Promise<string>;

  /**
   * Uploads many images under `<tenant>/<folder>/`, preserving order, and
   * returns their URLs. Values that are already URLs are kept as is.
   */
  uploadImages(images: string[], folder: string): Promise<string[]>;
}

/**
 * Tenant-scoped folders under which each resource's images are stored. The
 * final object path is `<cityId>/<folder>/<file>`.
 */
export const IMAGE_FOLDERS = {
  solicitations: 'solicitations',
  signatures: 'signatures',
  solicitationSignatures: 'solicitation-signatures',
  doneCoolActions: 'done-cool-actions',
  polls: 'polls',
} as const;
