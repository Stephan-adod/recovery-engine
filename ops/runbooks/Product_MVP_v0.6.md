# Product MVP Canvas: Revenue Protection Engine (v0.6)

## 1. Zielbild
Binnen 24 h nach Onboarding muss der Nutzen sichtbar sein **und** das Produkt „sticky“ wirken: Klarer Verlust-Betrag, erste Recovery-Aktion, verständliche Kommunikation und ein leichter Coaching-Layer. 

---

## 2. MVP-Scope (v0.6)

### Core (Minimal funktionsfähig)
- 3-Klick-Onboarding, Self-Service.  
- Dashboard: „Abandoned Revenue“ + „Recovered Revenue“ (30 Tage).  
- Eine automatisierte Recovery-Email (Trigger 60 min).  
- Billing-Ledger mit Subscription + Performance Fee. :contentReference[oaicite:1]{index=1}

### Quick Fixes (für „Sticky“)
- **Guidance Light:** kurzer Hinweis/Narrativ unter KPI-Cards, heuristisch. :contentReference[oaicite:2]{index=2}
- **Billing Communication:** Ledger klar trennen, Value Messaging. :contentReference[oaicite:3]{index=3}
- **Onboarding Improvements:** Checklist + **Demo Mode** sichtbar. :contentReference[oaicite:4]{index=4}

### Strategic Adds (Differenzierung, nach Core)
- **Email Branding Light:** Logo, Farben, Sprache. :contentReference[oaicite:5]{index=5}
- **Recovery Benchmarks:** Vergleich ggü. Peer-Group. :contentReference[oaicite:6]{index=6}
- **Weekly Digest:** Lost/Recovered + Top-Alert als Kurzreport. :contentReference[oaicite:7]{index=7}

### Stretch
- **Shopware Connector (Beta).**  
- **Checkout Step Insights (Light).** :contentReference[oaicite:8]{index=8}

---

## 3. Spezifikation

### Funktional
- **Abandoned-Definition:** Item im Cart + Email erfasst + keine Order nach 60 min.  
- **Metrics:** Abandoned / Recovered Revenue; Trend 30 Tage.  
- **Email:** 1 Template, minimal anpassbar, Attribution via Link.  
- **Billing:** Abo + gestaffelte Performance Fee, transparentes Ledger. :contentReference[oaicite:9]{index=9}

### Nicht-Funktional
- EU-only Infra, GDPR. Onboarding < 5 min. Skalierbar auf 500+ Stores. Self-Service Support. :contentReference[oaicite:10]{index=10}

---

## 4. Risiken & Mitigation
- **Billing-Verständlichkeit:** In-App Simulation „Bei €500 recovery → €15 Fee“. :contentReference[oaicite:11]{index=11}  
- **Scope-Creep:** Nur „Light“-Varianten. :contentReference[oaicite:12]{index=12}  
- **Datenbasis für Benchmarks:** in Pilotphase anonym sammeln. :contentReference[oaicite:13]{index=13}

---

## 5. Erfolgskriterien v0.6
- Onboarding < 5 min, erstes Recovery-Mail < 24 h. :contentReference[oaicite:14]{index=14}  
- ≥ 70 % bewerten Guidance/Benchmarks als „hilfreich“. ≥ 50 % öffnen Weekly Digest. Churn < 20 % nach Monat 1. :contentReference[oaicite:15]{index=15}  
- 20+ Pilot-Stores onboarded, ROI klar quantifiziert. :contentReference[oaicite:16]{index=16}

---

## 6. Roadmap (kritischer Pfad, M0–M6)

**M0–M1 Foundations:** EU-Infra, Auth/Shop-Anbindung, Basis-Dashboard. :contentReference[oaicite:17]{index=17}  
**M1–M2 Core Dev:** 3-Klick-Onboarding, 1 Recovery-Email, Ledger-Preview. :contentReference[oaicite:18]{index=18}  
**M2–M3 Quick Fixes live:** Guidance Light, Billing-Kommunikation, Demo Mode. :contentReference[oaicite:19]{index=19}  
**M3–M4 Beta:** 20 Piloten, Feedback-Schleifen. :contentReference[oaicite:20]{index=20}  
**M4–M6 Strategic Adds:** Branding Light, Benchmarks, Weekly Digest. :contentReference[oaicite:21]{index=21}

---

## 7. Tech-Leitplanken (MVP)
Serverless Functions, Firestore/Event-Storage, React-Frontend, E-Mail via Postmark/SendGrid, Billing via Stripe, CI über GitHub Actions. :contentReference[oaicite:22]{index=22}

---

## 8. Ticket-Backlog (Atomic, v0.6-konform)
- **AT-012** Healthcheck (erledigt).  
- **AT-013** Guidance Light v1 (GET `/guidance/:tenantId`).  
- **AT-014** Onboarding Checklist (statisch).  
- **AT-015** Demo-Seed (Sample-Docs schreiben).  
- **AT-016** Billing Ledger API (Perioden-View).  
- **AT-017** Branding Light (Logo/Farbe/Locale Read API).  
- **AT-018** Weekly Digest v1 (Compute + JSON Out).  
- **AT-019** Recovery Benchmarks v1 (heuristisch).  
- **AT-020** CI Hardening (Stabilität/Warte-Probe).

---

## 9. Änderungsprozess
Dieses Artefakt ist kanonisch. Anpassungen nur per PR, mit Verweis auf Tickets und Mess-Impact.
