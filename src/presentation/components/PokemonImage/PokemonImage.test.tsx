import { fireEvent, render, screen } from '@testing-library/react-native';

import { PokemonImage } from './PokemonImage';

const props = { label: 'Pikachu', fallbackColor: '#000000' };

describe('PokemonImage', () => {
  it('muestra la imagen con su etiqueta y caché en disco', async () => {
    await render(<PokemonImage {...props} uri="a.png" />);

    const image = screen.getByLabelText('Pikachu');
    expect(image.props.source).toEqual({ uri: 'a.png' });
    expect(image.props.cachePolicy).toBe('memory-disk');
  });

  it('usa el tamaño indicado', async () => {
    await render(<PokemonImage {...props} uri="a.png" size={200} />);

    expect(screen.getByLabelText('Pikachu')).toHaveStyle({ width: 200, height: 200 });
  });

  it('muestra un reemplazo si no hay imagen', async () => {
    await render(<PokemonImage {...props} uri={null} />);

    expect(screen.getByText('Sin imagen')).toBeTruthy();
    expect(screen.getByLabelText('Pikachu: sin imagen')).toBeTruthy();
  });

  it('muestra un reemplazo si la imagen no carga', async () => {
    await render(<PokemonImage {...props} uri="a.png" />);

    await fireEvent(screen.getByLabelText('Pikachu'), 'error');

    expect(screen.getByText('Sin imagen')).toBeTruthy();
  });

  it('vuelve a intentar cuando cambia la imagen', async () => {
    const { rerender } = await render(<PokemonImage {...props} uri="a.png" />);
    await fireEvent(screen.getByLabelText('Pikachu'), 'error');

    await rerender(<PokemonImage {...props} uri="b.png" />);

    expect(screen.queryByText('Sin imagen')).toBeNull();
    expect(screen.getByLabelText('Pikachu').props.source).toEqual({ uri: 'b.png' });
  });
});
