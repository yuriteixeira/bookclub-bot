// TODO: Change how we handle loading the service account
//       Important: cloud functions don't require that
//       https://firebase.google.com/docs/firestore/quickstart?authuser=0#initialize
import serviceAccount from '../../service-account.json';

import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';

import {
  CollectionReference,
  FieldValue,
  Firestore,
  getFirestore,
} from 'firebase-admin/firestore';

import { ReaderId, Reading, ReadingModel, ReadingProgress } from './types';

let firestore: Firestore;

function db() {
  if (firestore) return firestore;

  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });

  firestore = getFirestore();
  return firestore;
}

type CollectionTypes = {
  readings: Reading;
};

type Collections = keyof CollectionTypes;

const getCollection = <T extends Collections>(collectionName: T) =>
  db().collection(collectionName) as CollectionReference<CollectionTypes[T]>;

const currentReadingDoc = getCollection('readings').doc('current');

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
    const now = new Date();
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
