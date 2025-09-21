const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.apps.length ? admin.app() : admin.initializeApp();
exports.helloWorld = functions.region('europe-west1').https.onRequest(async (_req, res) => {
  const db = admin.firestore();
  await db.collection('demo').doc('hello').set({ message: 'Hello World' });
  const doc = await db.collection('demo').doc('hello').get();
  res.status(200).json(doc.data());
});
