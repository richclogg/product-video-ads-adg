import { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ConfigProvider } from '@/context/ConfigContext';
import { useFirestoreAutoSave } from '@/hooks/useFirestoreConfig';
import { LoginPage } from '@/pages/LoginPage';
import { EditorPage } from '@/pages/EditorPage';
import { ConfigListPage } from '@/pages/ConfigListPage';
import type { PvaConfig } from '@/lib/types';

function EditorWithAutoSave({ onBack }: { onBack: () => void }) {
  const { save } = useFirestoreAutoSave();
  return <EditorPage onSave={save} onBack={onBack} />;
}

function AuthenticatedApp() {
  const [editing, setEditing] = useState<PvaConfig | 'new' | null>(null);

  if (editing !== null) {
    return (
      <ConfigProvider key={editing === 'new' ? 'new' : editing.id} initialConfig={editing === 'new' ? undefined : editing}>
        <EditorWithAutoSave onBack={() => setEditing(null)} />
      </ConfigProvider>
    );
  }

  return (
    <ConfigListPage
      onSelect={(config) => setEditing(config)}
      onNew={() => setEditing('new')}
    />
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  return user ? <AuthenticatedApp /> : <LoginPage />;
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
