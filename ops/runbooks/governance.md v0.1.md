# Governance v0.2

## 1. Zweck
Dieses Dokument stellt sicher, dass ChatGPT, Codex und Git konsistent zusammenarbeiten.  
Version 0.2 vereinfacht den Ticket-Prozess: **ein Ticket-File enthält alles** (Ziel, Scope, Handover, Smoke, DoD).

---

## 2. Single Source of Truth
- **Git (main Branch)** ist die einzige Wahrheit über:
  - Ticket-Status (`tickets/AT-xxx.md`)
  - Artefakt-Versionen (`ops/runbooks/*.md`)
  - Infrastruktur-Konfiguration (`infra/`)
- Weder ChatGPT noch Codex dürfen Nummern oder Artefakte außerhalb des Repos erfinden.

---

## 3. Artefakte (kanonisch)
- **workflow.md** → Master-Prozess  
- **codex_prinzipien_v0.x.md** → Entwicklungsprinzipien  
- **Product_MVP_v0.x.md** → Produkt-Scope & Roadmap  
- **Infrastructure_v0.x.md** → Technische Basis & Regeln  
- **Infra_Decision_v0.x.md** → Architekturentscheidungen  
- **Pilot_Test_Plan_v0.x.md** → Validierung & Feedback-Prozess  
- **governance_v0.x.md** → Governance-Regeln  

Alle Änderungen daran erfolgen ausschließlich via Pull Request.

---

## 4. Tickets
- Jedes Atomic Ticket = `tickets/AT-xxx.md`  
- Inhalt des Tickets:  
  - Ziel  
  - Scope-Dateien  
  - Handover-Block (für Codex)  
  - Smoke-Block (für Curl-Test)  
  - DoD-Checkliste  
- Status: offen → in Arbeit → abgeschlossen  
- Jede PR muss genau ein Ticket referenzieren.  
- Nummerierung bleibt linear und fortlaufend.

---

## 5. Handover
- **Handover ist Teil des Tickets** (Kapitel „## Handover (für Codex)“).  
- ChatGPT liefert den Handover-Block, Codex arbeitet ausschließlich damit.  
- Kein separater Ordner `handover/` mehr.

---

## 6. Smoke
- **Smoke ist Teil des Tickets** (Kapitel „## Smoke“).  
- Curl-Beispiel kann manuell ausgeführt werden oder in CI integriert werden.  
- Kein separater Ordner `smoke/` mehr.

---

## 7. Konsistenzregeln
- ChatGPT darf keine Ticketnummer erfinden → Nummer immer aus Repo bestimmen.  
- Codex arbeitet ausschließlich nach Handover-Block im Ticket.  
- Änderungen an `ops/runbooks/*.md` nur per separatem Artefakt-PR.  
- Drift zwischen Chat und Repo ist ungültig.  

---

## 8. CI & Branch Protection
- Merge in `main` nur bei:
  - Ticket vorhanden und DoD erfüllt  
  - Branch-Name entspricht `feature/AT-xxx-<slug>`  
  - Optional: automatischer Curl-Test in CI grün  

---

## 9. Pflege
- Owner: Stephan Gauglitz  
- Versionierung: `governance_v0.x.md`  
- Änderungen nur via Pull Request  
- Reviewzyklus: alle 4 Wochen oder bei Major-Änderungen

---
