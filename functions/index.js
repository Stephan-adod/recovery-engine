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

exports.ingestEvent = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
      res.set('Allow', 'POST');
      return res.status(405).json({ error: 'method_not_allowed' });
    }

    const body = (req.body && typeof req.body === 'object') ? req.body : {};
    const errors = [];

    const tenantId = body.tenantId;
    const eventType = body.type;
    const refId = body.refId;
    const amount = body.amount;
    const tsInput = body.ts;

    if (typeof tenantId !== 'string' || tenantId.trim() === '') {
      errors.push('tenantId must be a non-empty string');
    }

    if (typeof eventType !== 'string' || eventType.trim() === '') {
      errors.push('type must be a non-empty string');
    }

    if (typeof refId !== 'string' || refId.trim() === '') {
      errors.push('refId must be a non-empty string');
    }

    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) {
      errors.push('amount must be a number greater than or equal to 0');
    }

    let resolvedTimestamp;

    if (tsInput === undefined) {
      resolvedTimestamp = new Date().toISOString();
    } else if (typeof tsInput !== 'string' || tsInput.trim() === '') {
      errors.push('ts must be an ISO-8601 string when provided');
    } else {
      const parsedTs = new Date(tsInput);
      if (Number.isNaN(parsedTs.getTime())) {
        errors.push('ts must be a valid ISO-8601 string when provided');
      } else {
        resolvedTimestamp = parsedTs.toISOString();
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'bad_request',
        details: errors,
      });
    }

    const eventPayload = {
      tenantId: tenantId.trim(),
      type: eventType.trim(),
      refId: refId.trim(),
      amount,
      ts: resolvedTimestamp,
      source: 'api',
    };

    try {
      const docRef = await admin.firestore().collection('events').add(eventPayload);
      return res.status(201).json({
        ok: true,
        id: docRef.id,
      });
    } catch (error) {
      console.error('[AT-007] Failed to ingest event', error);
      return res.status(500).json({
        error: 'internal',
      });
    }
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
