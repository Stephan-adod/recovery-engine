const admin = require("firebase-admin");
const { onRequest, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");

setGlobalOptions({ region: "europe-west1", maxInstances: 3 });
if (!admin.apps.length) admin.initializeApp();

admin.firestore().settings({ ignoreUndefinedProperties: true });
function authz(req){
  const t = req.get("x-tenant-id");
  if(!t) throw new HttpsError("unauthenticated","x-tenant-id fehlt");
  return t;
}
async function writeDoc(tenant,col,obj){
  return admin.firestore().collection("tenants").doc(tenant).collection(col).add({tenantId:tenant,...obj});
}

exports.helloWorld = onRequest(async (req, res) => {
  try {
    if (req.method !== "GET" && req.method !== "POST") {
      res.set("Allow", ["GET", "POST"]);
      throw new HttpsError("invalid-argument", "Only GET and POST supported");
    }

    const docRef = admin.firestore().collection("demo").doc("hello");
    const ts = new Date().toISOString();
    const payload = { message: "Hello World", ts };

    await docRef.set(payload);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      throw new HttpsError("internal", "Document not found after write");
    }

    res.status(200).json(snapshot.data());
  } catch (error) {
    const statusCode = error.httpErrorCode?.status || 500;
    res.status(statusCode).json({ error: error.message });
  }
});

exports.ingestEvent = onRequest(async (req,res)=>{
  try{ if(req.method!=="POST") throw new HttpsError("invalid-argument","POST");
       const tenant=authz(req);
       const {type,ts,data} = req.body||{};
       if(!type||!ts) throw new HttpsError("invalid-argument","type/ts fehlt");
       await writeDoc(tenant,"events", { type, ts, data: data ?? null });
       res.status(200).json({ok:true}); } 
  catch(e){ res.status(400).json({ok:false,error:e.message}); }
});

exports.ingestCart = onRequest(async (req,res)=>{
  try{ if(req.method!=="POST") throw new HttpsError("invalid-argument","POST");
       const tenant=authz(req);
       const {status,abandonedAt,ts,data}=req.body||{};
       if(!status||!ts) throw new HttpsError("invalid-argument","status/ts fehlt");
       await writeDoc(tenant,"carts",  { status, abandonedAt, ts, data: data ?? null });
       res.status(200).json({ok:true}); }
  catch(e){ res.status(400).json({ok:false,error:e.message}); }
});

exports.ingestOrder = onRequest(async (req,res)=>{
  try{ if(req.method!=="POST") throw new HttpsError("invalid-argument","POST");
       const tenant=authz(req);
       const {completedAt,amount,currency,ts,data}=req.body||{};
       if(!completedAt||!amount||!currency||!ts) throw new HttpsError("invalid-argument","fields fehlen");
       await writeDoc(tenant,"orders", { completedAt, amount, currency, ts, data: data ?? null });
       res.status(200).json({ok:true}); }
  catch(e){ res.status(400).json({ok:false,error:e.message}); }
});
