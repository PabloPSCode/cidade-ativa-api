import { getEnv } from '../../config/env.js';
import { logger } from '../../logger/logger.js';

const OPENAI_CHAT_COMPLETIONS_URL =
  'https://api.openai.com/v1/chat/completions';

const OPENAI_REQUEST_TIMEOUT_MS = 120_000;

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
    signal: AbortSignal.timeout(OPENAI_REQUEST_TIMEOUT_MS),
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
