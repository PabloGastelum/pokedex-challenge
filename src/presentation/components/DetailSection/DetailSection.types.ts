import type { PropsWithChildren, ReactNode } from 'react';

export type DetailSectionProps = PropsWithChildren<{
  readonly title: string;
  readonly trailing?: ReactNode;
}>;
