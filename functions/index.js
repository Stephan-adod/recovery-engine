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

exports.eventsList = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    const DEFAULT_LIMIT = 10;
    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;

    const rawLimit = req.query?.limit;
    const limitCandidate = Array.isArray(rawLimit) ? rawLimit[0] : rawLimit;
    const parsedLimit = Number(limitCandidate);
    const limit =
      Number.isInteger(parsedLimit) &&
      parsedLimit >= MIN_LIMIT &&
      parsedLimit <= MAX_LIMIT
        ? parsedLimit
        : DEFAULT_LIMIT;

    try {
      const snapshot = await admin
        .firestore()
        .collection('events')
        .orderBy('ts', 'desc')
        .limit(limit)
        .get();

      const items = snapshot.docs.map((doc) => {
        const data = doc.data() ?? {};

        return {
          id: doc.id,
          type: data.type,
          ts: data.ts,
        };
      });

      res.status(200).json({
        items,
        count: items.length,
      });
    } catch (error) {
      console.error('[AT-006] Failed to list events', error);
      res.status(500).json({
        error: 'internal',
      });
    }
  });
