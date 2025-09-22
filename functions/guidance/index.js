const functions = require('firebase-functions');

const REGION = 'europe-west1';
const DEMO_TENANT_ID = 'demo';
const DEMO_RESPONSE = {
  advice: 'Reduziere Reibung im Checkout und aktiviere Reminder-Mails.',
  confidence: 0.7,
};
const DEFAULT_RESPONSE = {
  advice: 'Verbessere Checkout-Klarheit und Versandinfos.',
  confidence: 0.5,
};

function extractTenantId(req) {
  // 1) /guidance/:id in originalUrl
  const original = typeof req.originalUrl === 'string' ? req.originalUrl : '';
  const m1 = original.match(/\/guidance\/([^/?#]+)(?:[/?]|$)/);
  if (m1 && m1[1]) {
    try { return decodeURIComponent(m1[1]); } catch { return m1[1]; }
  }
  // 2) req.path -> /guidance/:id
  const path = typeof req.path === 'string' ? req.path : '';
  const segs = path.split('/').filter(Boolean);
  if (segs[0] === 'guidance' && segs[1]) return segs[1];
  // 3) req.url Fallback
  const url = typeof req.url === 'string' ? req.url.split('?')[0] : '';
  const m3 = url.match(/\/guidance\/([^/?#]+)(?:[/?]|$)/);
  if (m3 && m3[1]) return m3[1];
  return undefined;
}

module.exports = functions.region(REGION).https.onRequest((req, res) => {
  if (req.method !== 'GET') {
    res.set('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const tenantId = extractTenantId(req);
  const body = tenantId === DEMO_TENANT_ID ? DEMO_RESPONSE : DEFAULT_RESPONSE;
  return res.status(200).json(body);
});
