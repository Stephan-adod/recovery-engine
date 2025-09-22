const functions = require('firebase-functions');

const REGION = 'europe-west1';
const DEMO_TENANT_ID = 'demo';
const DEMO_RESPONSE = {
  advice: 'Reduziere Reibung im Checkout und aktiviere Reminder-Mails.',
  confidence: 0.7,
};

const DEFAULT_RESPONSE = {
  advice: 'Optimiere den Checkout-Prozess und aktiviere Erinnerungs-Mails.',
  confidence: 0.5,
};

const extractTenantId = (req) => {
  const originalUrl = typeof req.originalUrl === 'string' ? req.originalUrl : '';
  const originalMatch = originalUrl.match(/\/guidance\/([^/?#]+)(?:[/?]|$)/);

  if (originalMatch && originalMatch[1]) {
    try {
      return decodeURIComponent(originalMatch[1]);
    } catch (_error) {
      return originalMatch[1];
    }
  }

  const path = typeof req.path === 'string' ? req.path : '';
  const pathSegments = path.split('/').filter(Boolean);

  if (pathSegments.length > 0) {
    if (pathSegments[0] === 'guidance' && pathSegments[1]) {
      return pathSegments[1];
    }

    if (pathSegments[0] !== 'guidance') {
      return pathSegments[0];
    }
  }

  const url = typeof req.url === 'string' ? req.url : '';
  const urlSegments = url.split('?')[0].split('/').filter(Boolean);
  if (urlSegments[0] === 'guidance' && urlSegments[1]) {
    return urlSegments[1];
  }
  if (urlSegments.length > 0) {
    return urlSegments[0];
  }

  return undefined;
};

module.exports = functions.region(REGION).https.onRequest((req, res) => {
  const tenantId = extractTenantId(req);

  if (tenantId === DEMO_TENANT_ID) {
    return res.status(200).json(DEMO_RESPONSE);
  }

  return res.status(200).json(DEFAULT_RESPONSE);
});
