import 'dotenv/config';

export const getEnv = () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3337),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtPublicKey: process.env.JWT_PUBLIC_KEY ?? '',
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY ?? '',
  cityName: process.env.CITY_NAME ?? '',
  cityUf: process.env.CITY_UF ?? 'SP',
  openAiApiKey: process.env.OPEN_AI_API_KEY ?? '',
  openAiModel: process.env.OPEN_AI_MODEL ?? 'gpt-5.5',
});

export const env = {
  ...getEnv(),
};
