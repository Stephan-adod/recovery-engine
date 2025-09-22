const functions = require('firebase-functions');

module.exports = functions
  .region('europe-west1')
  .https.onRequest((_req, res) => {
    res.status(200).json({ ok: true });
  });
