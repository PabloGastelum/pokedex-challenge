import { contrastRatio, INK, readableOn, WHITE, withAlpha } from './contrast';

describe('contrastRatio', () => {
  it('calcula los extremos de WCAG', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 5);
  });

  it('no depende del orden de los colores', () => {
    expect(contrastRatio('#123456', '#ABCDEF')).toBeCloseTo(contrastRatio('#ABCDEF', '#123456'), 5);
  });
});

describe('readableOn', () => {
  it('usa tinta sobre fondos claros', () => {
    expect(readableOn('#F2C81E')).toBe(INK);
  });

  it('usa blanco sobre fondos oscuros', () => {
    expect(readableOn('#6B3BF0')).toBe(WHITE);
  });
});

describe('withAlpha', () => {
  it('convierte el color a rgba', () => {
    expect(withAlpha('#FF8000', 0.5)).toBe('rgba(255, 128, 0, 0.5)');
    expect(withAlpha('#000000', 0)).toBe('rgba(0, 0, 0, 0)');
  });
});
