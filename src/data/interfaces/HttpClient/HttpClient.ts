export interface HttpClient {
  getJson<T>(path: string): Promise<T>;
}
