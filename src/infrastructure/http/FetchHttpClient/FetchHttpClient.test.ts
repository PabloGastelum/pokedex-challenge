import { AppErrorCode } from '@/domain/enums/AppErrorCode';

import { FetchHttpClient } from './FetchHttpClient';

const jsonResponse = (body: unknown, status = 200) =>
  ({ ok: status >= 200 && status < 300, status, json: async () => body }) as Response;

const createClient = (fetchFn: typeof fetch, timeoutMs = 1000) =>
  new FetchHttpClient({ baseUrl: 'https://api.test', timeoutMs, fetchFn });

describe('FetchHttpClient', () => {
  it('devuelve el JSON y arma la URL con la base', async () => {
    const fetchFn = jest.fn().mockResolvedValue(jsonResponse({ ok: true }));

    await expect(createClient(fetchFn).getJson('/pokemon/1')).resolves.toEqual({ ok: true });
    expect(fetchFn.mock.calls[0][0]).toBe('https://api.test/pokemon/1');
  });

  it('no deja que la caché HTTP de la plataforma responda por la red', async () => {
    const fetchFn = jest.fn().mockResolvedValue(jsonResponse({}));

    await createClient(fetchFn).getJson('/x');

    expect(fetchFn.mock.calls[0][1].headers).toMatchObject({ 'Cache-Control': 'no-cache' });
  });

  it.each([
    [404, AppErrorCode.NotFound],
    [500, AppErrorCode.Server],
    [429, AppErrorCode.Server],
  ])('traduce HTTP %i a %s', async (status, code) => {
    const fetchFn = jest.fn().mockResolvedValue(jsonResponse({}, status));

    await expect(createClient(fetchFn).getJson('/x')).rejects.toMatchObject({ code });
  });

  it('traduce un rechazo de fetch a error de red', async () => {
    const fetchFn = jest.fn().mockRejectedValue(new TypeError('Network request failed'));

    await expect(createClient(fetchFn).getJson('/x')).rejects.toMatchObject({
      code: AppErrorCode.Network,
    });
  });

  it('traduce JSON inválido a datos inválidos', async () => {
    const response = {
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('bad json');
      },
    } as unknown as Response;

    await expect(
      createClient(jest.fn().mockResolvedValue(response)).getJson('/x'),
    ).rejects.toMatchObject({ code: AppErrorCode.InvalidData });
  });

  it('usa el fetch global si no se le inyecta otro', async () => {
    const globalFetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ ok: 1 }));
    const client = new FetchHttpClient({ baseUrl: 'https://api.test', timeoutMs: 1000 });

    await expect(client.getJson('/x')).resolves.toEqual({ ok: 1 });
    expect(globalFetch).toHaveBeenCalledTimes(1);

    globalFetch.mockRestore();
  });

  it('limpia el temporizador cuando la petición termina', async () => {
    const clear = jest.spyOn(globalThis, 'clearTimeout');

    await createClient(jest.fn().mockResolvedValue(jsonResponse({}))).getJson('/x');

    expect(clear).toHaveBeenCalled();
    clear.mockRestore();
  });

  it('cancela la petición al agotar el tiempo', async () => {
    const fetchFn = jest.fn(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    ) as typeof fetch;

    await expect(createClient(fetchFn, 5).getJson('/x')).rejects.toMatchObject({
      code: AppErrorCode.Timeout,
    });
  });
});
