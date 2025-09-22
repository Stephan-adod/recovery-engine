const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.apps.length ? admin.app() : admin.initializeApp();

exports.helloWorld = functions.region('europe-west1').https.onRequest(async (req, res) => {
  const timestamp = new Date().toISOString();
  let serializedPayload;

  try {
    serializedPayload = JSON.stringify(req.body ?? null);
  } catch (_error) {
    serializedPayload = '"[unserializable payload]"';
  }

  console.log(
    `[AT-004] Function helloWorld called at ${timestamp}, payload: ${serializedPayload}`
  );

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
  .https.onRequest((req, res) => {
    const timestamp = new Date().toISOString();
    let serializedPayload;

    try {
      serializedPayload = JSON.stringify(req.body ?? null);
    } catch (_error) {
      serializedPayload = '"[unserializable payload]"';
    }

    console.log(
      `[AT-004] Function lostRevenueMock called at ${timestamp}, payload: ${serializedPayload}`
    );

    res.status(200).json({
      lostRevenue: 1234,
      ts: new Date().toISOString(),
    });
  });

exports.eventWriteMock = functions
  .region('europe-west1')
  .https.onRequest(async (_req, res) => {
    const db = admin.firestore();
    const payload = {
      type: 'test',
      ts: new Date().toISOString(),
    };

    const docRef = await db.collection('events').add(payload);

    res.status(200).json({
      id: docRef.id,
      ...payload,
    });
  });
