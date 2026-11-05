import { formatCount, formatHeight, formatName, formatNumber, formatWeight } from './format';

describe('formatName', () => {
  it.each([
    ['bulbasaur', 'Bulbasaur'],
    ['mr-mime', 'Mr Mime'],
    ['ho-oh', 'Ho Oh'],
    ['-raro-', 'Raro'],
    ['', ''],
  ])('%j -> %j', (input, expected) => {
    expect(formatName(input)).toBe(expected);
  });
});

describe('formatNumber', () => {
  it.each([
    [1, '#001'],
    [25, '#025'],
    [151, '#151'],
    [10001, '#10001'],
  ])('%i -> %s', (input, expected) => {
    expect(formatNumber(input)).toBe(expected);
  });
});

describe('formatCount', () => {
  it.each([
    [0, '0'],
    [999, '999'],
    [1351, '1,351'],
    [1000000, '1,000,000'],
  ])('%i -> %s', (input, expected) => {
    expect(formatCount(input)).toBe(expected);
  });
});

describe('unidades de PokéAPI', () => {
  it.each([
    [7, '0.7 m'],
    [10, '1.0 m'],
    [0, '0.0 m'],
  ])('altura %i dm -> %s', (input, expected) => {
    expect(formatHeight(input)).toBe(expected);
  });

  it.each([
    [69, '6.9 kg'],
    [1000, '100.0 kg'],
  ])('peso %i hg -> %s', (input, expected) => {
    expect(formatWeight(input)).toBe(expected);
  });
});
