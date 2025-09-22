# Governance v0.1

## 1. Zweck
Dieses Dokument stellt sicher, dass ChatGPT, Codex und Git konsistent zusammenarbeiten. Es definiert, welche Artefakte als **kanonisch** gelten, wie Änderungen erfolgen und wie Tickets sauber durchlaufen.

---

## 2. Single Source of Truth
- **Git (main Branch)** ist die einzige Wahrheit über:
  - Ticket-Status (`tickets/AT-xxx.md`)
  - Artefakt-Versionen (`docs/*.md`)
  - Infrastruktur-Konfiguration (`infra/`)
- Weder ChatGPT noch Codex dürfen eine eigene Nummerierung oder alternative Artefakt-Versionen führen.

---

## 3. Artefakte (kanonisch)
Folgende Dokumente gelten als maßgeblich:

- **workflow.md** → Master-Prozess  
- **codex_prinzipien_v0.x.md** → Prinzipien für Entwicklung  
- **Product_MVP_v0.x.md** → Produkt-Scope & Roadmap  
- **Infrastructure_v0.x.md** → Technische Basis & Regeln  
- **Infra_Decision_v0.x.md** → getroffene Architekturentscheidungen  
- **Pilot_Test_Plan_v0.x.md** → Validierung & Feedback-Prozess  

Alle Änderungen daran erfolgen ausschließlich über Pull Requests.

---

## 4. Tickets
- Jedes Atomic Ticket = `tickets/AT-xxx.md`  
- Status: offen → in Arbeit → abgeschlossen  
- Jede PR muss genau ein Ticket referenzieren.  
- Nummerierung ist linear und wird im Repo fortgeschrieben.  

---

## 5. Handover
- Für jedes Ticket gibt es ein **handover/AT-xxx.md**  
- Enthält: Codex-Prompt, relevante Artefakt-Links, Smoke-Test-Definition.  
- ChatGPT erzeugt Handover-Drafts, Codex arbeitet damit, Merge erfolgt über Git.  

---

## 6. Konsistenzregeln
- ChatGPT darf keine Ticketnummer erfinden → immer im Repo nachsehen.  
- Codex arbeitet ausschließlich mit Artefakten aus `main`.  
- Änderungen an **workflow.md** benötigen explizite Freigabe (PR + Review).  
- Drift zwischen Chat und Repo ist ungültig. Gültig ist nur das Repo.

---

## 7. CI & Branch Protection
- Merge in `main` nur bei:
  - grünen CI-Checks (Smoke, Tests)  
  - aktualisiertem Ticket (DoD erfüllt)  
  - Verweis auf kanonische Artefakte  

---

## 8. Pflege
- Owner: Stephan Gauglitz  
- Versionierung: `governance_v0.x.md`  
- Änderungen nur via Pull Request + Review  
- Reviewzyklus: alle 4 Wochen oder bei Major-Änderungen in Workflow/Artefakten
