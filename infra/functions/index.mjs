import * as admin from "firebase-admin";
import { onRequest, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
setGlobalOptions({ region: "europe-west1" });
if (!admin.apps.length) admin.initializeApp();

export const ping = onRequest((req, res) => {
  if (req.method !== "GET") throw new HttpsError("invalid-argument","GET only");
  res.status(200).json({ ok: true, ts: Date.now() });
});