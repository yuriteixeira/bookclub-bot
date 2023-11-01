import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';

import {
  CollectionReference,
  FieldValue,
  Firestore,
  getFirestore,
} from 'firebase-admin/firestore';

import { ReaderId, Reading, ReadingModel, ReadingProgress } from './types';

import 'dotenv/config';

let firestore: Firestore;

function db() {
  if (firestore) return firestore;

  const serviceAccountData = process.env.GCP_SERVICE_ACCOUNT_JSON;
  console.log('>>> serviceAccountData', { serviceAccountData });

  if (!serviceAccountData)
    throw new Error('GCP_SERVICE_ACCOUNT_JSON env variable is not set!');

  const serviceAccount = JSON.parse(serviceAccountData);

  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });

  firestore = getFirestore();
  return firestore;
}

type CollectionTypes = {
  readings: Reading;
  readings_dev: Reading;
};

type Collections = keyof CollectionTypes;

const collectionName =
  process.env.NODE_ENV === 'production' ? 'readings' : 'readings_dev';

const getCollection = <T extends Collections>(collectionName: T) =>
  db().collection(collectionName) as CollectionReference<CollectionTypes[T]>;

const currentReadingDoc = getCollection(collectionName).doc('current');

export const readingModel: ReadingModel = {
  async startNewReading(book) {
    await currentReadingDoc.set({
      book,
      start: new Date(),
      isCurrent: true,
      readersProgress: {},
    });
  },

  async getCurrentReading() {
    const doc = await currentReadingDoc.get();
    if (!doc.exists) return;
    return doc.data();
  },

  async joinCurrentReading(id: ReaderId, name: string) {
    const now = new Date();
    await currentReadingDoc.update({
      [`readersProgress.${id}`]: {
        name,
        pctg: 0,
        start: now,
        lastUpdate: now,
      } as ReadingProgress,
    });
  },

  async leaveCurrentReading(id: ReaderId) {
    await currentReadingDoc.update({
      [`readersProgress.${id}`]: FieldValue.delete(),
    });
  },

  async updateProgressCurrentReading(id: ReaderId, pctg: number) {
    await currentReadingDoc.update({
      [`readersProgress.${id}.pctg`]: pctg,
    });
  },
};
