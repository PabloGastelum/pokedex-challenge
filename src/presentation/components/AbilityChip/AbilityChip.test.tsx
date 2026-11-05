import { render, screen } from '@testing-library/react-native';

import { AbilityChip } from './AbilityChip';

describe('AbilityChip', () => {
  it('formatea el nombre de una habilidad normal', async () => {
    await render(<AbilityChip ability={{ name: 'solar-power', isHidden: false }} />);

    expect(screen.getByLabelText('Solar Power')).toBeTruthy();
    expect(screen.queryByText('Oculta', { includeHiddenElements: true })).toBeNull();
  });

  it('marca y anuncia una habilidad oculta', async () => {
    await render(<AbilityChip ability={{ name: 'blaze', isHidden: true }} />);

    expect(screen.getByLabelText('Blaze, habilidad oculta')).toBeTruthy();
    expect(screen.getByText('Oculta', { includeHiddenElements: true })).toBeTruthy();
  });
});
