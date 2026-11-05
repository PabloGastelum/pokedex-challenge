import Storage from 'expo-sqlite/kv-store';

import { SqliteKeyValueStore } from './SqliteKeyValueStore';

jest.mock('expo-sqlite/kv-store', () => ({
  __esModule: true,
  default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));

const storage = jest.mocked(Storage);

describe('SqliteKeyValueStore', () => {
  const store = new SqliteKeyValueStore();

  beforeEach(() => jest.clearAllMocks());

  it('lee un valor guardado', async () => {
    storage.getItem.mockResolvedValue('valor');

    await expect(store.getItem('clave')).resolves.toBe('valor');
    expect(storage.getItem).toHaveBeenCalledWith('clave');
  });

  it('devuelve null si la clave no existe', async () => {
    storage.getItem.mockResolvedValue(null);

    await expect(store.getItem('nada')).resolves.toBeNull();
  });

  it('guarda un valor', async () => {
    storage.setItem.mockResolvedValue(undefined);

    await expect(store.setItem('clave', 'valor')).resolves.toBeUndefined();
    expect(storage.setItem).toHaveBeenCalledWith('clave', 'valor');
  });

  it('elimina un valor', async () => {
    storage.removeItem.mockResolvedValue(undefined);

    await expect(store.removeItem('clave')).resolves.toBeUndefined();
    expect(storage.removeItem).toHaveBeenCalledWith('clave');
  });

  it.each([
    ['getItem', () => store.getItem('clave')],
    ['setItem', () => store.setItem('clave', 'valor')],
    ['removeItem', () => store.removeItem('clave')],
  ] as const)('propaga los fallos de %s para que el repositorio decida', async (method, call) => {
    storage[method].mockRejectedValue(new Error('disco lleno'));

    await expect(call()).rejects.toThrow('disco lleno');
  });
});
