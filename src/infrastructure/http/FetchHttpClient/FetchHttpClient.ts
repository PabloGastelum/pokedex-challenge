import type { HttpClient } from '@/data/interfaces/HttpClient';
import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { AppError } from '@/domain/errors/AppError';

import type { FetchHttpClientOptions } from './FetchHttpClient.types';

export class FetchHttpClient implements HttpClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetchFn: typeof fetch;

  constructor({ baseUrl, timeoutMs, fetchFn }: FetchHttpClientOptions) {
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
    this.fetchFn = fetchFn ?? ((input, init) => fetch(input, init));
  }

  async getJson<T>(path: string): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchFn(`${this.baseUrl}${path}`, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
      if (!response.ok) throw this.toHttpError(response.status, path);
      return await this.parseJson<T>(response, path);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (controller.signal.aborted) {
        throw new AppError(AppErrorCode.Timeout, `Tiempo agotado: ${path}`, { cause: error });
      }
      throw new AppError(AppErrorCode.Network, `Sin conexión: ${path}`, { cause: error });
    } finally {
      clearTimeout(timer);
    }
  }

  private toHttpError(status: number, path: string): AppError {
    const code = status === 404 ? AppErrorCode.NotFound : AppErrorCode.Server;
    return new AppError(code, `HTTP ${status}: ${path}`);
  }

  private async parseJson<T>(response: Response, path: string): Promise<T> {
    try {
      return (await response.json()) as T;
    } catch (error) {
      throw new AppError(AppErrorCode.InvalidData, `JSON inválido: ${path}`, { cause: error });
    }
  }
}
