import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { Storage } from '@google-cloud/storage';

initializeApp();
const storage = new Storage();

export const uploadConfigToGcs = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be signed in.');
  }

  const { config, storageBucket } = request.data as {
    config: unknown;
    storageBucket: string;
  };

  if (!config || !storageBucket) {
    throw new HttpsError('invalid-argument', 'config and storageBucket required.');
  }

  const jsonString = JSON.stringify(config, null, 2);
  const randStr = Math.random().toString(36).slice(2);
  const folderName = `${new Date().toISOString()} ${randStr}`;
  const fileName = `${folderName}/config.json`;

  const bucket = storage.bucket(storageBucket);
  await bucket.file(fileName).save(jsonString, {
    contentType: 'application/json',
  });

  const gcsPath = `gs://${storageBucket}/${fileName}`;
  console.log(`Uploaded by ${request.auth.uid}: ${gcsPath}`);
  return { gcsPath };
});
