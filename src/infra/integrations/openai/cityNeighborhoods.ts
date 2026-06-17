import { getEnv } from '../../config/env.js';
import { logger } from '../../logger/logger.js';

const OPENAI_CHAT_COMPLETIONS_URL =
  'https://api.openai.com/v1/chat/completions';

interface OpenAiChatResponse {
  choices?: { message?: { content?: string } }[];
}

const buildPrompt = (cityName: string): string =>
  [
    `Liste todos os bairros oficiais da cidade de "${cityName}", no Brasil.`,
    'Responda exclusivamente com um objeto JSON no formato:',
    '{ "neighborhoods": ["Bairro 1", "Bairro 2", ...] }',
    'Cada item deve conter apenas o nome do bairro, sem duplicatas,',
    'sem numeração e sem nenhum texto adicional fora do JSON.',
  ].join(' ');

const parseNeighborhoods = (content: string): string[] => {
  const parsed = JSON.parse(content) as { neighborhoods?: unknown };
  if (!Array.isArray(parsed.neighborhoods)) return [];
  return parsed.neighborhoods
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

/**
 * Asks the configured OpenAI model (OPEN_AI_MODEL, defaults to gpt-5.5) for the
 * list of neighborhoods of a given city. The API key and model are read from
 * environment variables.
 */
export const listNeighborhoodsByCity = async (
  cityName: string,
): Promise<string[]> => {
  const { openAiApiKey, openAiModel } = getEnv();
  const model =
    typeof openAiModel === 'string' && openAiModel.trim().length > 0
      ? openAiModel
      : 'gpt-5.5';

  if (!cityName.trim()) {
    logger.warn({
      module: 'CityNeighborhoods',
      action: 'listNeighborhoodsByCity',
      message: 'City name is empty; skipping neighborhood lookup.',
    });
    return [];
  }

  if (!openAiApiKey) {
    logger.warn({
      module: 'CityNeighborhoods',
      action: 'listNeighborhoodsByCity',
      message: 'OPEN_AI_API_KEY is not set; skipping neighborhood lookup.',
    });
    return [];
  }

  const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'Você é um assistente que conhece a divisão administrativa de cidades brasileiras e responde apenas em JSON válido.',
        },
        { role: 'user', content: buildPrompt(cityName) },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as OpenAiChatResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content) return [];

  return parseNeighborhoods(content);
};

let cachedNeighborhoods: string[] = [];

/**
 * Loads the neighborhoods for the city configured via the CITY_NAME env var.
 * Intended to be called once during server startup. Caches the result so it
 * can be retrieved later through getCityNeighborhoods().
 */
export const loadCityNeighborhoods = async (): Promise<string[]> => {
  const { cityName } = getEnv();

  if (typeof cityName !== 'string' || !cityName.trim()) {
    logger.warn({
      module: 'CityNeighborhoods',
      action: 'loadCityNeighborhoods',
      message: 'CITY_NAME is not set or empty; skipping neighborhood loading.',
    });
    return [];
  }

  const normalizedCityName = cityName.trim().toLowerCase();

  try {
    cachedNeighborhoods = await listNeighborhoodsByCity(normalizedCityName);
    logger.info({
      module: 'CityNeighborhoods',
      action: 'loadCityNeighborhoods',
      message: `Loaded ${cachedNeighborhoods.length} neighborhoods for "${normalizedCityName}".`,
    });
  } catch (error) {
    cachedNeighborhoods = [];
    logger.error({
      module: 'CityNeighborhoods',
      action: 'loadCityNeighborhoods',
      message: `Failed to load neighborhoods for "${normalizedCityName}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }

  return cachedNeighborhoods;
};

export const getCityNeighborhoods = (): string[] => cachedNeighborhoods;
