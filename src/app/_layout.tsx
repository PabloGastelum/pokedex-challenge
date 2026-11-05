import { createContainer, resolveDependencies } from '@/di/container';
import { AppNavigator } from '@/presentation/components/AppNavigator';
import { AppProviders } from '@/presentation/components/AppProviders';

export { AppErrorFallback as ErrorBoundary } from '@/presentation/components/AppErrorFallback';

const dependencies = resolveDependencies(createContainer());

export default function RootLayout() {
  return (
    <AppProviders dependencies={dependencies}>
      <AppNavigator />
    </AppProviders>
  );
}
