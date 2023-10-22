// TODO: Change how we handle loading the service account
//       Important: cloud functions don't require that
//       https://firebase.google.com/docs/firestore/quickstart?authuser=0#initialize
import serviceAccount from '../service-account.json';

import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

let firestore: Firestore;

function db() {
  if (firestore) return firestore;

  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });

  firestore = getFirestore();
  return firestore;
}

export async function testDataStore() {
  console.log('... Testing data store');
  const snapshot = await db().collection('test').get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
}
