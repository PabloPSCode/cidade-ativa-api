export interface ApiResponse<T = unknown> {
  RES: T | null;
  MSG: { message: string; error?: string } | null;
  SUCCESS: boolean;
  TIMESTAMP: string;
  PATH: string;
  STATUS: number;
}

export function buildResponse<T>(params: {
  res: T | null;
  success: boolean;
  status: number;
  path: string;
  message?: string;
  error?: string;
}): ApiResponse<T> {
  return {
    RES: params.res,
    MSG: params.success
      ? null
      : { message: params.message ?? 'An error occurred.', error: params.error },
    SUCCESS: params.success,
    TIMESTAMP: new Date().toISOString(),
    PATH: params.path,
    STATUS: params.status,
  };
}
