# recovery-engine

## Lokales Testing der Hello-World-Funktion

1. Abhängigkeiten installieren (falls noch nicht geschehen):
   ```bash
   cd infra/functions
   npm install
   ```
2. Firebase Emulator für Functions und Firestore starten:
   ```bash
   npx firebase emulators:start --only functions,firestore --project recovery-engine
   ```
3. In einem zweiten Terminal die Funktion aufrufen (Standard-Port 5001):
   ```bash
   curl http://127.0.0.1:5001/recovery-engine/europe-west1/helloWorld
   ```
   Als Antwort sollte `{ "message": "Hello World" }` zurückgegeben werden. Zusätzlich wird das Dokument `demo/hello` in der Emulator-Firestore-Datenbank erstellt bzw. aktualisiert.

## Optionale Deployment-Notiz

Für ein Deployment ins GCP-Projekt kann folgende CLI genutzt werden:
```bash
cd infra/functions
npx firebase deploy --only functions:helloWorld --project recovery-engine
```

## Firestore Security Tests

Run the Firestore emulator with `firebase emulators:start --only firestore` to validate the security rules.
Use the auth payload `{ "uid":"tenant-user","token":{"tenantId":"demo-tenant"}}` for tenant read simulations.
Service accounts can be tested with `{ "uid":"svc","token":{"email":"worker@project.iam.gserviceaccount.com"}}`.
