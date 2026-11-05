import { createContext, useContext } from 'react';

import type { AppDependencies, DependenciesProviderProps } from './DependenciesContext.types';

const DependenciesContext = createContext<AppDependencies | null>(null);

export function DependenciesProvider({ dependencies, children }: DependenciesProviderProps) {
  return (
    <DependenciesContext.Provider value={dependencies}>{children}</DependenciesContext.Provider>
  );
}

export function useDependencies(): AppDependencies {
  const dependencies = useContext(DependenciesContext);
  if (!dependencies) throw new Error('useDependencies requiere un DependenciesProvider');
  return dependencies;
}
