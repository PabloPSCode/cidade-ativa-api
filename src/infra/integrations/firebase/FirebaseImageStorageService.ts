import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { IImageStorageService } from '../../../domain/services/IImageStorageService.js';
import { getCurrentCityId } from '../../database/prisma/cityContext.js';
import { logger } from '../../logger/logger.js';
import { getFirebaseBucket } from './firebaseApp.js';

const MIME_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

interface DecodedImage {
  buffer: Buffer;
  contentType: string;
  extension: string;
}

/**
 * Uploads base64 images to Firebase Cloud Storage and returns their public
 * URLs. Each object is stored under the caller's tenant folder
 * (`<cityId>/<folder>/<uuid>.<ext>`), so every city owns its assets.
 */
@Injectable()
export class FirebaseImageStorageService implements IImageStorageService {
  async uploadImage(image: string, folder: string): Promise<string> {
    const cityId = await getCurrentCityId();
    return this.upload(image, folder, cityId);
  }

  async uploadImages(images: string[], folder: string): Promise<string[]> {
    const cityId = await getCurrentCityId();
    return Promise.all(
      images.map((image) => this.upload(image, folder, cityId)),
    );
  }

  private async upload(
    image: string,
    folder: string,
    cityId: string,
  ): Promise<string> {
    // Already a stored URL (e.g. re-submitted on an update) — keep it as is.
    if (this.isUrl(image)) return image;

    const bucket = getFirebaseBucket();
    if (!bucket) {
      // Firebase not configured: leave the value untouched so non-production
      // environments keep working without credentials.
      return image;
    }

    const decoded = this.decode(image);
    if (!decoded) {
      throw new Error('Invalid image payload: expected base64 or data URI.');
    }

    const objectPath = `${cityId}/${folder}/${randomUUID()}.${decoded.extension}`;
    const downloadToken = randomUUID();
    const file = bucket.file(objectPath);

    await file.save(decoded.buffer, {
      resumable: false,
      contentType: decoded.contentType,
      metadata: {
        contentType: decoded.contentType,
        metadata: { firebaseStorageDownloadTokens: downloadToken },
      },
    });

    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      objectPath,
    )}?alt=media&token=${downloadToken}`;

    logger.info({
      module: 'Firebase',
      action: 'uploadImage',
      message: `Image uploaded to ${objectPath}`,
    });

    return url;
  }

  private isUrl(value: string): boolean {
    return /^https?:\/\//i.test(value.trim());
  }

  private decode(image: string): DecodedImage | null {
    const dataUri = /^data:(?<mime>[^;,]+);base64,(?<data>.+)$/s.exec(
      image.trim(),
    );

    if (dataUri?.groups) {
      const contentType = dataUri.groups.mime;
      return {
        buffer: Buffer.from(dataUri.groups.data, 'base64'),
        contentType,
        extension: MIME_EXTENSIONS[contentType] ?? 'bin',
      };
    }

    // Raw base64 without a data URI prefix — default to PNG.
    const raw = image.trim();
    if (!raw) return null;
    return {
      buffer: Buffer.from(raw, 'base64'),
      contentType: 'image/png',
      extension: 'png',
    };
  }
}
