import 'dotenv/config';

export const getEnv = () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3337),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtPublicKey: process.env.JWT_PUBLIC_KEY ?? '',
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY ?? '',
});

export const env = {
  ...getEnv(),
};
