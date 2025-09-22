# Infrastructure_v.01.md

**Version:** v0.1\
**Datum:** 2025-09-05\
**Autor:** Stephan Gauglitz / RPE_MVP Projekt\
**Geltungsbereich:** INFRA-01 (GCP Basisprojekt) & INFRA-02 (Firestore
Collections & Security Rules)\
**Status:** abgeschlossen, produktiv nutzbar\
---

## Inhaltsverzeichnis

1.  Überblick
2.  Architektur
3.  Konfiguration INFRA-01 (GCP Projekt Setup)
    -   3.1 Projekt & Billing
    -   3.2 Standard-Regionen
    -   3.3 Aktivierte APIs
    -   3.4 Firestore-DB
    -   3.5 Service Accounts & Rollen
4.  Konfiguration INFRA-02 (Firestore Schema & Security Rules)
    -   4.1 Ordnerstruktur
    -   4.2 Tools & Abhängigkeiten
    -   4.3 Firebase-Projektbindung
    -   4.4 Firestore Sicherheitsregeln
    -   4.5 Firestore Indizes
    -   4.6 Smoke-Tests
5.  Schnittstellen & Endpunkte
6.  Beispiele (Befehle & API Calls)
7.  Graphische Übersicht
8.  Metadaten & Pflege

------------------------------------------------------------------------

## 1. Überblick

Die Infrastruktur stellt die technische Grundlage für das RPE_MVP dar.
Sie umfasst: - **INFRA-01**: Einrichtung eines isolierten GCP-Projekts
mit Firestore, Cloud Functions, Cloud Run, Secret Manager, Scheduler und
Logging.\
- **INFRA-02**: Definition und Deployment von Firestore Collections,
Security Rules und Indizes zur Mandanten-Trennung und effizienten
Query-Ausführung.

------------------------------------------------------------------------

## 2. Architektur

``` mermaid
flowchart TD
  subgraph GCP Project [GCP Project: recovery-engine]
    direction TB
    SA[Service Account: app-sa] --> CF[Cloud Functions]
    CF --> FS[Firestore (eur3)]
    CF --> SM[Secret Manager]
    CF --> SCH[Cloud Scheduler]
    MON[Monitoring & Logging]
  end

  User[Client mit ID-Token] --> CF
  CF --> FS
```

------------------------------------------------------------------------

## 3. Konfiguration INFRA-01 (GCP Projekt Setup)

### 3.1 Projekt & Billing

-   Projekt: `recovery-engine`
-   Project Number: automatisch generiert (z. B. `544034667602`)
-   Billing Account: verknüpft via `gcloud beta billing projects link`

### 3.2 Standard-Regionen

-   Compute / Cloud Functions / Run: `europe-west1` (Belgien)
-   Firestore: `eur3` (Multi-Region EU)

### 3.3 Aktivierte APIs

``` yaml
- cloudfunctions.googleapis.com
- run.googleapis.com
- firestore.googleapis.com
- cloudbuild.googleapis.com
- secretmanager.googleapis.com
- cloudscheduler.googleapis.com
- logging.googleapis.com
- monitoring.googleapis.com
```

### 3.4 Firestore-DB

-   Typ: `firestore-native`
-   Location: `eur3`
-   Status: READY

### 3.5 Service Accounts & Rollen

-   `app-sa@recovery-engine.iam.gserviceaccount.com`
    -   `roles/cloudfunctions.developer`
    -   `roles/run.admin`
    -   `roles/iam.serviceAccountUser`
    -   `roles/datastore.user`
    -   `roles/secretmanager.secretAccessor`
    -   `roles/cloudscheduler.admin`

------------------------------------------------------------------------

## 4. Konfiguration INFRA-02 (Firestore Schema & Security Rules)

### 4.1 Ordnerstruktur

    RPE_MVP/
     └── infra/
         └── firestore/
             ├── firestore.rules
             ├── firestore.indexes.json
             ├── firebase.json
             └── .firebaserc

### 4.2 Tools & Abhängigkeiten

-   Node.js LTS (über `winget install OpenJS.NodeJS.LTS`)
-   Firebase CLI (`npm install -g firebase-tools`)

### 4.3 Firebase-Projektbindung

``` powershell
firebase login
firebase use --add recovery-engine
```

### 4.4 Firestore Sicherheitsregeln

Datei: `firestore.rules`\
Eigenschaften: - **Mandanten-Isolation**: Zugriff nur, wenn
`request.auth.token.tenantId` == Dokumentpfad. - **Writes**: nur über
Cloud Functions. - **Reads**: erlaubt für Snapshots & Settings;
eingeschränkt für `events`, `carts`, `orders`, `recoveries`,
`billing_ledger`, `shops`.

### 4.5 Firestore Indizes

Datei: `firestore.indexes.json`\
Optimiert für Queries: - `events` (nach `tenantId + type + ts`,
`tenantId + shopId + ts`, `tenantId + customer.email_hash + ts`) -
`carts` (nach `tenantId + status + abandonedAt`) - `orders` (nach
`tenantId + completedAt`) - `billing_ledger` (nach `tenantId + period`)

### 4.6 Smoke-Tests

-   **Rules Simulator** in Firebase Console: `snapshots_daily` Write
    erlaubt, `events` Write blockiert.\
-   **Emulator lokal**: `firebase emulators:start --only firestore`.

------------------------------------------------------------------------

## 5. Schnittstellen & Endpunkte

-   **Firestore API**: gRPC/REST über GCP SDKs, Regeln enforced via
    `firestore.rules`.\
-   **Firebase CLI Deploy**:
    `firebase deploy --only firestore:rules,firestore:indexes --project recovery-engine`.

------------------------------------------------------------------------

## 6. Beispiele

### Firestore-Regeln Deploy

``` powershell
cd .\infrairestore
firebase deploy --only firestore:rules,firestore:indexes --project recovery-engine
```

### Auth-Sim Test

``` json
{
  "token": {
    "tenantId": "demo-tenant"
  }
}
```

------------------------------------------------------------------------

## 7. Graphische Übersicht

``` mermaid
erDiagram
    TENANT ||--o{ EVENTS : enthält
    TENANT ||--o{ CARTS : enthält
    TENANT ||--o{ ORDERS : enthält
    TENANT ||--o{ RECOVERIES : enthält
    TENANT ||--o{ BILLING_LEDGER : enthält
    TENANT {
        string tenantId PK
    }
    EVENTS {
        string tenantId FK
        string type
        timestamp ts
        map data
    }
    ORDERS {
        string tenantId FK
        timestamp completedAt
        float amount
        string currency
    }
```

------------------------------------------------------------------------

## 8. Metadaten & Pflege

-   **Erstellt:** 2025-09-05\
-   **Letzte Änderung:** 2025-09-05\
-   **Verantwortlich:** Stephan Gauglitz\
-   **Pflegeprozess:** Änderungen an Rules/Indizes via Pull Request +
    Firebase Emulator Test + `firebase deploy` in Staging → Production.\
-   **CI/CD Empfehlung:** Integration in GitHub Actions / Cloud Build
    Pipeline, automatisches Validieren von Rules & Indizes.

------------------------------------------------------------------------
