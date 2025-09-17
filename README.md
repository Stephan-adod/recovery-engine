# recovery-engine
Recovery Engine

Run the Firestore emulator with `firebase emulators:start --only firestore` to validate the security rules.
Use the auth payload `{"uid":"tenant-user","token":{"tenantId":"demo-tenant"}}` for tenant read simulations.
Service accounts can be tested with `{"uid":"svc","token":{"email":"worker@project.iam.gserviceaccount.com"}}`.
