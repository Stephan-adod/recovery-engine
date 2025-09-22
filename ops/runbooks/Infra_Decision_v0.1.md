
# Infrastructure Decision: Revenue Protection Engine (v0.1)

## 1. Entscheidungen

### Cloud Plattform
- **Gewählt:** GCP (Cloud Functions + Firestore)
- **Begründung:** 
  - Developer-freundlich, besonders für schnelles MVP. 
  - Firestore bietet NoSQL mit einfacher Skalierung und Realtime-Option. 
  - EU-Rechenzentren verfügbar (GDPR-konform).
- **Alternative (nicht gewählt):** AWS (Lambda + DynamoDB) – komplexeres Preismodell, mehr Enterprise-Fokus.

### Email Service
- **Gewählt:** Postmark
- **Begründung:** 
  - Hohe Zustellraten (Deliverability). 
  - Klarer Fokus auf transaktionale Emails. 
  - DSGVO-konform, stabile API. 
- **Alternative (nicht gewählt):** SendGrid – breiter, aber geringere Deliverability und komplexere API.

### Analytics Tool
- **Gewählt:** Mixpanel
- **Begründung:** 
  - Großzügiges Free-Tier (20M Events/Jahr). 
  - Einfache Funnels, gute In-App-Analysen. 
  - Schnelle Integration ins MVP.
- **Alternative (nicht gewählt):** Amplitude – stärker für Enterprise/Retention, aber teurer und komplexer.

---

## 2. Erwartete Kosten (MVP-Phase, 20 Pilotkunden, 50k Events, 10k Emails/Monat)

- **GCP Cloud Functions:** $0.40 pro 1 Mio Invocations → bei 1M ≈ $0.40.  
- **Firestore:** $0.18 pro 100k Reads + $0.026/GB Storage → bei 500k Reads ≈ $0.90.  
- **Postmark:** $15 fix für 10k Emails, $1.80 je weitere 1k.  
- **Mixpanel:** Free (bis 20M Events/Jahr).  

### Summe
- **Fixkosten:** ~ $15–20/Monat.  
- **Variable Kosten:** linear wachsend mit Events (ca. $0.002 pro 100 Events) und Emails ($1.80 pro 1k).  

---

## 3. Architektur-Implikationen

- **Event Schema:** Firestore-optimiert (Collections/Subcollections, flache Strukturen, Indexing).  
- **Scaling:** Firestore ausreichend für Pilot; später optional BigQuery-Export für tiefergehende Analysen.  
- **Monitoring:** Nutzung von GCP Stackdriver (statt Datadog/CloudWatch).  
- **GDPR:** Datenhaltung in EU-Rechenzentren (z. B. `europe-west1`).  

---

## 4. Risiken & Mitigation

- **Vendor Lock-in (GCP Firestore):** Risiko → Mitigation: Event Schema abstrahieren, später BigQuery Export.  
- **Email-Abhängigkeit (Postmark):** Risiko → Mitigation: Fallback-Integration SendGrid vorbereiten.  
- **Analytics-Skalierung:** Risiko → Mitigation: Mixpanel Free Tier reicht, später Enterprise Plan oder Export in BigQuery.  

---

## 5. Nächste Schritte

- Projekt-Setup auf **GCP (Cloud Functions + Firestore, EU-Region)**.  
- Postmark Sandbox-Account einrichten und API-Keys sichern.  
- Mixpanel Free Plan starten und Event-Schema entwerfen.  
- Decision Log aktualisieren → Status: *Infra stack entschieden*.  
