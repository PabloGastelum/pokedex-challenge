import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { PokemonTypeName } from '@/domain/enums/PokemonTypeName';
import { StatName } from '@/domain/enums/StatName';

import type { ErrorCopy } from './labels.types';

export const STALE_DATA_MESSAGE = 'Sin conexión. Estás viendo datos guardados.';

export const typeLabels: Readonly<Record<PokemonTypeName, string>> = {
  [PokemonTypeName.Normal]: 'Normal',
  [PokemonTypeName.Fire]: 'Fuego',
  [PokemonTypeName.Water]: 'Agua',
  [PokemonTypeName.Electric]: 'Eléctrico',
  [PokemonTypeName.Grass]: 'Planta',
  [PokemonTypeName.Ice]: 'Hielo',
  [PokemonTypeName.Fighting]: 'Lucha',
  [PokemonTypeName.Poison]: 'Veneno',
  [PokemonTypeName.Ground]: 'Tierra',
  [PokemonTypeName.Flying]: 'Volador',
  [PokemonTypeName.Psychic]: 'Psíquico',
  [PokemonTypeName.Bug]: 'Bicho',
  [PokemonTypeName.Rock]: 'Roca',
  [PokemonTypeName.Ghost]: 'Fantasma',
  [PokemonTypeName.Dragon]: 'Dragón',
  [PokemonTypeName.Dark]: 'Siniestro',
  [PokemonTypeName.Steel]: 'Acero',
  [PokemonTypeName.Fairy]: 'Hada',
  [PokemonTypeName.Unknown]: 'Desconocido',
};

export const statLabels: Readonly<Record<StatName, string>> = {
  [StatName.Hp]: 'Salud',
  [StatName.Attack]: 'Ataque',
  [StatName.Defense]: 'Defensa',
  [StatName.SpecialAttack]: 'At. especial',
  [StatName.SpecialDefense]: 'Def. especial',
  [StatName.Speed]: 'Velocidad',
};

export const errorCopy: Readonly<Record<AppErrorCode, ErrorCopy>> = {
  [AppErrorCode.Network]: {
    title: 'Sin conexión',
    message: 'No pudimos conectarnos. Revisa tu internet e inténtalo de nuevo.',
  },
  [AppErrorCode.Timeout]: {
    title: 'La respuesta tardó demasiado',
    message: 'El servidor no respondió a tiempo. Inténtalo de nuevo.',
  },
  [AppErrorCode.NotFound]: {
    title: 'Pokémon no encontrado',
    message: 'No existe un Pokémon con ese número.',
  },
  [AppErrorCode.Server]: {
    title: 'El servicio no está disponible',
    message: 'PokéAPI tuvo un problema. Inténtalo de nuevo en unos minutos.',
  },
  [AppErrorCode.InvalidData]: {
    title: 'Respuesta inesperada',
    message: 'Recibimos datos que no pudimos leer. Inténtalo de nuevo más tarde.',
  },
  [AppErrorCode.Unknown]: {
    title: 'Algo salió mal',
    message: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
  },
};
