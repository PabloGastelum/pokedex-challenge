import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { AppError } from '@/domain/errors/AppError';
import { errorCopy } from '@/presentation/utils/labels';

import { PokemonListFooter } from './PokemonListFooter';

const error = new AppError(AppErrorCode.Network, 'sin red');

describe('PokemonListFooter', () => {
  it('no muestra nada sin actividad', async () => {
    await render(<PokemonListFooter paging="idle" error={null} onRetry={jest.fn()} />);

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByLabelText('Cargando más Pokémon')).toBeNull();
  });

  it('indica que está cargando más', async () => {
    await render(<PokemonListFooter paging="loadingMore" error={null} onRetry={jest.fn()} />);

    expect(screen.getByLabelText('Cargando más Pokémon')).toBeTruthy();
  });

  it('muestra el error y permite reintentar', async () => {
    const onRetry = jest.fn();
    await render(<PokemonListFooter paging="idle" error={error} onRetry={onRetry} />);

    expect(screen.getByText(errorCopy[AppErrorCode.Network].message)).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Reintentar' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('prioriza la carga sobre un error anterior', async () => {
    await render(<PokemonListFooter paging="loadingMore" error={error} onRetry={jest.fn()} />);

    expect(screen.getByLabelText('Cargando más Pokémon')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
