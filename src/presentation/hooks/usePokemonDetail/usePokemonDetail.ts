import { useCallback, useEffect, useState } from 'react';

import { AppError } from '@/domain/errors/AppError';
import { useDependencies } from '@/presentation/context/DependenciesContext';

import type { PokemonDetailState, UsePokemonDetailResult } from './usePokemonDetail.types';

const LOADING: PokemonDetailState = { status: 'loading' };

interface SettledRequest {
  readonly key: string;
  readonly state: PokemonDetailState;
}

export function usePokemonDetail(id: number): UsePokemonDetailResult {
  const { getPokemonDetail } = useDependencies();
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<SettledRequest | null>(null);

  const key = `${id}:${attempt}`;
  const state = settled?.key === key ? settled.state : LOADING;

  useEffect(() => {
    let isCurrent = true;
    getPokemonDetail
      .execute(id)
      .then(({ data, isStale }) => {
        if (isCurrent) setSettled({ key, state: { status: 'ready', detail: data, isStale } });
      })
      .catch((error: unknown) => {
        if (isCurrent) setSettled({ key, state: { status: 'error', error: AppError.from(error) } });
      });
    return () => {
      isCurrent = false;
    };
  }, [getPokemonDetail, id, key]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  return { ...state, retry };
}
