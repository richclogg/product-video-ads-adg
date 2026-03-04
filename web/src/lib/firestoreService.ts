import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { PvaConfig } from './types';

const COLLECTION = 'configs';

export async function saveConfig(config: PvaConfig): Promise<string> {
  const ref = config.id
    ? doc(db, COLLECTION, config.id)
    : doc(collection(db, COLLECTION));

  const data = {
    ...config,
    id: ref.id,
    updatedAt: serverTimestamp(),
    ...(config.id ? {} : { createdAt: serverTimestamp() }),
  };

  await setDoc(ref, data, { merge: true });
  return ref.id;
}

export async function loadConfig(configId: string): Promise<PvaConfig | null> {
  const snap = await getDoc(doc(db, COLLECTION, configId));
  if (!snap.exists()) return null;
  return { ...snap.data(), id: snap.id } as PvaConfig;
}

export async function listConfigs(userId: string): Promise<PvaConfig[]> {
  const q = query(
    collection(db, COLLECTION),
    where('createdBy', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as PvaConfig);
}

export async function deleteConfig(configId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, configId));
}
