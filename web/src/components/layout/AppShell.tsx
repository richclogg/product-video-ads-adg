import { type ReactNode } from 'react';
import { Header } from './Header';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">{children}</div>
    </div>
  );
}
