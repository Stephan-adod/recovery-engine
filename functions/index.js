const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.apps.length ? admin.app() : admin.initializeApp();

exports.health = require('./health');
exports.guidance = functions
  .region('europe-west1')
  .https.onRequest((req, res) => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'method_not_allowed' });
    }

    const segments = (req.path || '').split('/').filter(Boolean);
    const tenantId = segments[segments.length - 1];
    const isDemoTenant = tenantId === 'demo';

    const body = isDemoTenant
      ? {
          advice: 'Reduziere Reibung im Checkout und aktiviere Reminder-Mails.',
          confidence: 0.7,
        }
      : {
          advice: 'Verbessere Checkout-Klarheit und Versandinfos.',
          confidence: 0.5,
        };

    res.set('Content-Type', 'application/json');
    return res.status(200).json(body);
  });

exports.onboarding = functions
  .region('europe-west1')
  .https.onRequest((req, res) => {
    if (req.method !== 'GET') {
      res.set('Allow', 'GET');
      return res.status(405).json({ error: 'method_not_allowed' });
    }

    const p = (req.path || '').replace(/\/+$/, '');
    if (p !== '/onboarding' && p !== '/onboarding/checklist') {
      return res.status(404).json({ error: 'not_found' });
    }

    return res
      .type('application/json')
      .status(200)
      .json({
        items: [
          { id: 'connect-shop', title: 'Shop verbinden', done: false },
          { id: 'set-branding', title: 'Branding konfigurieren', done: false },
          {
            id: 'import-data',
            title: 'Beispieldaten laden (Demo Mode)',
            done: false,
          },
          {
            id: 'send-first-mail',
            title: 'Erste Recovery-Mail aktivieren',
            done: false,
          },
          { id: 'review-billing', title: 'Billing prüfen', done: false },
        ],
      });
  });

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

exports.lostRevenueSummary = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    const rawTenantId = req.query?.tenantId;
    const tenantIdCandidate = Array.isArray(rawTenantId)
      ? rawTenantId[0]
      : rawTenantId;

    if (typeof tenantIdCandidate !== 'string' || tenantIdCandidate.trim() === '') {
      return res.status(400).json({ error: 'bad_request' });
    }

    const tenantId = tenantIdCandidate.trim();

    try {
      const snapshot = await admin
        .firestore()
        .collection('events')
        .where('tenantId', '==', tenantId)
        .where('type', '==', 'cart_abandon')
        .get();

      const totalLostRevenue = snapshot.docs.reduce((acc, doc) => {
        const data = doc.data() ?? {};
        const amount = data.amount;

        if (typeof amount === 'number' && Number.isFinite(amount) && amount >= 0) {
          return acc + amount;
        }

        return acc;
      }, 0);

      const roundedLostRevenue = Math.round(totalLostRevenue * 100) / 100;

      return res.status(200).json({
        tenantId,
        lostRevenue: roundedLostRevenue,
        ts: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[AT-008] Failed to calculate lost revenue summary', error);
      return res.status(500).json({ error: 'internal' });
    }
  });

exports.recoveryStatus = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    const rawTenantId = req.query?.tenantId;
    const tenantIdCandidate = Array.isArray(rawTenantId)
      ? rawTenantId[0]
      : rawTenantId;

    if (typeof tenantIdCandidate !== 'string' || tenantIdCandidate.trim() === '') {
      return res.status(400).json({ error: 'bad_request' });
    }

    const tenantId = tenantIdCandidate.trim();

    try {
      const db = admin.firestore();
      const [eventsSnapshot, emailsSnapshot] = await Promise.all([
        db
          .collection('events')
          .where('tenantId', '==', tenantId)
          .where('type', '==', 'cart_abandon')
          .get(),
        db
          .collection('emails')
          .where('tenantId', '==', tenantId)
          .where('status', '==', 'queued')
          .get(),
      ]);

      const totalLostRevenue = eventsSnapshot.docs.reduce((acc, doc) => {
        const data = doc.data() ?? {};
        const amount = data.amount;

        if (typeof amount === 'number' && Number.isFinite(amount) && amount >= 0) {
          return acc + amount;
        }

        return acc;
      }, 0);

      const lostRevenue = Number.parseFloat(totalLostRevenue.toFixed(2));

      return res.status(200).json({
        tenantId,
        lostRevenue,
        emailsQueued: emailsSnapshot.size,
        ts: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[AT-011] Failed to build recovery status', error);
      return res.status(500).json({ error: 'internal' });
    }
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

exports.shopifyAuthMock = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    if (req.method !== 'GET') {
      res.set('Allow', 'GET');
      return res.status(405).json({ error: 'method_not_allowed' });
    }

    const rawShop = req.query?.shop;
    const rawTenantId = req.query?.tenantId;

    const shopCandidate = Array.isArray(rawShop) ? rawShop[0] : rawShop;
    const tenantIdCandidate = Array.isArray(rawTenantId)
      ? rawTenantId[0]
      : rawTenantId;

    if (
      typeof shopCandidate !== 'string' ||
      shopCandidate.trim() === '' ||
      typeof tenantIdCandidate !== 'string' ||
      tenantIdCandidate.trim() === ''
    ) {
      return res.status(400).json({ error: 'bad_request' });
    }

    const shopDomain = shopCandidate.trim();
    const tenantId = tenantIdCandidate.trim();
    const createdAt = new Date().toISOString();
    const docPayload = {
      shopDomain,
      tenantId,
      createdAt,
    };

    try {
      await admin.firestore().collection('shops').add(docPayload);
      return res.status(200).json({
        ok: true,
        shopDomain,
        tenantId,
        createdAt,
      });
    } catch (error) {
      console.error('[AT-009] Failed to store Shopify auth mock payload', error);
      return res.status(500).json({ error: 'internal' });
    }
  });

exports.recoveryEmailMock = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
      res.set('Allow', 'POST');
      return res.status(405).json({ error: 'method_not_allowed' });
    }

    const body = req.body;
    const errors = [];

    if (body === null || typeof body !== 'object') {
      errors.push('request body must be a JSON object');
    }

    const tenantId = typeof body?.tenantId === 'string' ? body.tenantId.trim() : body?.tenantId;
    const to = typeof body?.to === 'string' ? body.to.trim() : body?.to;
    const template =
      typeof body?.template === 'string' ? body.template.trim() : body?.template;
    const data = body?.data;

    if (typeof tenantId !== 'string' || tenantId === '') {
      errors.push('tenantId must be a non-empty string');
    }

    if (typeof to !== 'string' || to === '' || !to.includes('@')) {
      errors.push('to must be a string containing "@"');
    }

    if (typeof template !== 'string' || template === '') {
      errors.push('template must be a non-empty string');
    }

    if (data !== undefined) {
      if (data === null || typeof data !== 'object' || Array.isArray(data)) {
        errors.push('data must be an object when provided');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'bad_request',
        details: errors,
      });
    }

    const queuedAt = new Date().toISOString();
    const emailPayload = {
      tenantId,
      to,
      template,
      data: data ?? {},
      status: 'queued',
      queuedAt,
    };

    try {
      await admin.firestore().collection('emails').add(emailPayload);

      return res.status(202).json({
        ok: true,
        status: 'queued',
        tenantId,
        to,
        template,
        queuedAt,
      });
    } catch (error) {
      console.error('[AT-010] Failed to queue recovery email mock', error);
      return res.status(500).json({ error: 'internal' });
    }
  });
