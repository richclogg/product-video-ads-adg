import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
      <h1 className="text-lg font-semibold">PVA Config Editor</h1>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user.email}</span>
          <button
            onClick={signOut}
            className="rounded-md px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
