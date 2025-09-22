const functions = require('firebase-functions');

module.exports = functions
  .region('europe-west1')
  .https.onRequest((req, res) => {
    if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' });

    // /guidance/:tenantId → letztes Segment
    const segs = (req.path || '').split('/').filter(Boolean);
    const tenantId = segs[segs.length - 1];

    const body = tenantId === 'demo'
      ? { advice: 'Reduziere Reibung im Checkout und aktiviere Reminder-Mails.', confidence: 0.7 }
      : { advice: 'Verbessere Checkout-Klarheit und Versandinfos.', confidence: 0.5 };

    return res.status(200).json(body);
  });
