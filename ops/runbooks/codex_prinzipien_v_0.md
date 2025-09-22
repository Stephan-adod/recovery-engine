# Codex Prinzipien v0.1

Dieses Dokument beschreibt die Leitlinien für die effiziente Entwicklung eines MVP mit Hilfe von Codex (GPT-Codegenerierung).

---

## 1. Atomic Tickets
- Aufgaben werden in kleinste, abgeschlossene Einheiten zerlegt.
- Kein Ticket darf >2h Arbeitszeit für Codex erfordern.
- Ziel jedes Tickets: lauffähiges, testbares Artefakt.

---

## 2. Prompt-Design als Briefing
- Prompts sind präzise technische Spezifikationen.
- Struktur: *Aufgabe, Stack, Endpunkte, Beispiel-Payloads, Tests*.
- Ergebnis: ausführbarer Code + Tests.

---

## 3. Tight Feedback Loop
1. Prompt → Codex-Code
2. Lokal testen (Unit, Integration)
3. Änderungswünsche minimal formulieren
4. Commit → CI/CD

---

## 4. Rollen für Codex
- **Coder:** Generiert Boilerplate, Handler, Clients.
- **Reviewer:** Erklärt Schwachstellen, prüft Codequalität.
- **Optimizer:** Schlägt Verbesserungen auf Basis realer Probleme vor.

---

## 5. Messbare Artefakte
- Jeder Zyklus liefert einen lauffähigen Endpunkt oder eine UI-Seite.
- Kein Overhead ohne Testlauf.
- Fortschritt wird an funktionierenden Features gemessen.

---

## 6. Automation-by-Default für Low-Risk Ops
- Jede wiederholte Aktion wird automatisiert.
- Beispiele: CI/CD, Webhook-Ingestion, Retries, Idempotenz, Logging, Deploy.
- Guardrails: Rate Limits, Quotas, Timeouts, Circuit Breaker.

---

## 7. Human-in-the-Loop für High-Risk Ops
- Datenschutz, Kundentemplates, Bulk-Send und Schema-Migration bleiben manuell kontrolliert.
- Entscheidung: Automatisieren nur bei hoher Frequenz und geringem Risiko.

---

## 8. Minimaler Automations-Stack
- **CI/CD:** Lint, Test, Build, Preview-Deploy, Canary, Prod.
- **Jobs:** Queue + Retry + DLQ.
- **Observability:** Logs, Metriken (success, latency, retry_rate), Alerts.
- **Secrets:** sicher verwalten, rotieren.
- **Compliance Hooks:** DPIA-Checkliste als PR-Gate.

---

## 9. Iterationsfluss
Define → Generate → **Auto-Test** → **Auto-Preview-Deploy** → Measure → **Auto-Report** → Next.

Fehlerpfad: Alert → Auto-Retry → DLQ-Ticket → Fix-Prompt.

---

## 10. Priorisierung von Automationen
Formel: **(Frequenz × Zeitersparnis × Fehleranfälligkeit) / Setup-Kosten**

Priorität 1: CI + Tests  
Priorität 2: Webhook Idempotenz + Retries  
Priorität 3: Release/Changelog  
Priorität 4: Telemetry + Auto-Reports  
Priorität 5: Canary Deployments

---

## 11. KPIs zur Nutzenmessung
- Deploy-Lead-Time ↓
- Change-Failure-Rate ↓
- MTTR ↓
- Recovered GMV pro Dev-Stunde ↑

---

## 12. Beispiel Automations-Tickets
- **AUTO-01:** CI Pipeline (Lint/Test/Typecheck, Status-Gates)
- **AUTO-02:** Preview Deploy (Vercel/Cloud Run)
- **AUTO-03:** Webhook Retry (BullMQ Backoff, DLQ)
- **AUTO-04:** Idempotency Middleware (Event-ID Lock)
- **AUTO-05:** Release Bot (semver, changelog)
- **AUTO-06:** Telemetry Cron (Report recovered GMV)
- **AUTO-07:** Canary Deployment mit Auto-Rollback

---

**Version:** v0.1  
**Status:** Draft

