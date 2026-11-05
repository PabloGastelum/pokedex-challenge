export interface FetchHttpClientOptions {
  readonly baseUrl: string;
  readonly timeoutMs: number;
  readonly fetchFn?: typeof fetch;
}
