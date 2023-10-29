// TODO: Change how we handle loading the service account
//       Important: cloud functions don't require that
//       https://firebase.google.com/docs/firestore/quickstart?authuser=0#initialize
import serviceAccount from '../service-account.json';

import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';

import {
  CollectionReference,
  Firestore,
  getFirestore,
} from 'firebase-admin/firestore';

import { Reading, ReadingModel } from './types';

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

export const readingModel: Partial<ReadingModel> = {
  async startNewReading(book) {
    await getCollection('readings').doc('current').set({
      book,
      start: new Date(),
      isCurrent: true,
      readersProgress: [],
    });
  },

  async getCurrentReading() {
    const doc = await getCollection('readings').doc('current').get();
    if (!doc.exists) return;
    return doc.data();
  },
};

export async function testDataStore() {
  console.log('Testing data store');

  const { getCurrentReading, startNewReading } = readingModel;
  if (!startNewReading) return;
  if (!getCurrentReading) return;

  console.log('Current reading: ADD');
  await startNewReading({
    isbn: '123',
    name: 'Fake Book',
    url: 'https://fake.book',
  });

  console.log('Current reading: GET');
  console.log(await getCurrentReading());
}
