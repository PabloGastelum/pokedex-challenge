import { TOKENS } from './tokens';

describe('TOKENS', () => {
  it('asigna un símbolo distinto a cada dependencia', () => {
    const symbols = Object.values(TOKENS);

    expect(new Set(symbols).size).toBe(symbols.length);
  });
});
