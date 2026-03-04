import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import { saveConfig } from '@/lib/firestoreService';

const DEBOUNCE_MS = 2000;

/**
 * Auto-saves the config to Firestore after 2s of inactivity.
 * Returns a manual save function.
 */
export function useFirestoreAutoSave() {
  const { user } = useAuth();
  const { config, dispatch } = useConfig();
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const save = useCallback(async () => {
    if (!user) return;

    const toSave = { ...config, createdBy: user.uid };
    const id = await saveConfig(toSave);

    if (!config.id) {
      dispatch({ type: 'SET_CONFIG', payload: { ...toSave, id } });
    }
  }, [user, config, dispatch]);

  // Debounced auto-save on config changes
  useEffect(() => {
    if (!user || !config.id) return; // Only auto-save existing configs

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void saveConfig({ ...config, createdBy: user.uid });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timerRef.current);
  }, [user, config]);

  return { save };
}
