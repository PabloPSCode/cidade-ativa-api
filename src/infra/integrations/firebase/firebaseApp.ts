import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import type { Bucket } from '@google-cloud/storage';
import { getEnv } from '../../config/env.js';
import { logger } from '../../logger/logger.js';

const FIREBASE_APP_NAME = 'cidade-ativa';

/**
 * Lazily initializes (once) the Firebase Admin app from the service-account env
 * vars and returns the default Cloud Storage bucket.
 *
 * Returns `null` when Firebase is not configured, so callers can degrade
 * gracefully (e.g. during local development or tests) instead of crashing.
 */
export function getFirebaseBucket(): Bucket | null {
  const {
    firebaseProjectId,
    firebaseClientEmail,
    firebasePrivateKey,
    firebaseStorageBucket,
  } = getEnv();

  if (
    !firebaseProjectId ||
    !firebaseClientEmail ||
    !firebasePrivateKey ||
    !firebaseStorageBucket
  ) {
    logger.warn({
      module: 'Firebase',
      action: 'getFirebaseBucket',
      message:
        'Firebase service account is not fully configured; image uploads are disabled.',
    });
    return null;
  }

  const app = getApps().some((a) => a.name === FIREBASE_APP_NAME)
    ? getApp(FIREBASE_APP_NAME)
    : initializeApp(
        {
          credential: cert({
            projectId: firebaseProjectId,
            clientEmail: firebaseClientEmail,
            privateKey: firebasePrivateKey,
          }),
          storageBucket: firebaseStorageBucket,
        },
        FIREBASE_APP_NAME,
      );

  return getStorage(app).bucket();
}
