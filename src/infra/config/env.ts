import 'dotenv/config';

export const getEnv = () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3337),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtPublicKey: process.env.JWT_PUBLIC_KEY ?? '',
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY ?? '',
  openAiApiKey: process.env.OPEN_AI_API_KEY ?? '',
  openAiModel: process.env.OPEN_AI_MODEL ?? 'gpt-5.5',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? '',
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
  // Private keys carry literal "\n" sequences when stored in a single-line env
  // var; normalize them back into real newlines so the SDK can parse the PEM.
  firebasePrivateKey: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(
    /\\n/g,
    '\n',
  ),
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? '',
  // Comma-separated list of front-end origins allowed to call this API.
  // Trailing slashes are stripped so values can be pasted as plain URLs.
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean),
});

export const env = {
  ...getEnv(),
};
