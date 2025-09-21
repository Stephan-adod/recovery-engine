const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.apps.length ? admin.app() : admin.initializeApp();

exports.helloWorld = functions.region('europe-west1').https.onRequest(async (_req, res) => {
  const db = admin.firestore();
  const payload = {
    message: 'Hello World',
    ts: new Date().toISOString(),
  };
  const docRef = db.collection('demo').doc('hello');
  await docRef.set(payload);
  const doc = await docRef.get();
  res.status(200).json(doc.data());
});

exports.lostRevenueMock = functions
  .region('europe-west1')
  .https.onRequest((_req, res) => {
    res.status(200).json({
      lostRevenue: 1234,
      ts: new Date().toISOString(),
    });
  });
