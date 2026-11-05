import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { PokemonTypeName } from '@/domain/enums/PokemonTypeName';
import { StatName } from '@/domain/enums/StatName';

import { errorCopy, statLabels, typeLabels } from './labels';

describe('labels', () => {
  it.each(Object.values(PokemonTypeName))('el tipo %s tiene etiqueta', (type) => {
    expect(typeLabels[type]).toBeTruthy();
  });

  it.each(Object.values(StatName))('la estadística %s tiene etiqueta', (stat) => {
    expect(statLabels[stat]).toBeTruthy();
  });

  it.each(Object.values(AppErrorCode))('el error %s tiene título y mensaje', (code) => {
    expect(errorCopy[code].title).toBeTruthy();
    expect(errorCopy[code].message).toBeTruthy();
  });

  it('no repite mensajes de error, para que cada fallo se distinga', () => {
    const messages = Object.values(errorCopy).map(({ message }) => message);

    expect(new Set(messages).size).toBe(messages.length);
  });
});
