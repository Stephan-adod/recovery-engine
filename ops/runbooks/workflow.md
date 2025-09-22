# Codex-First Workflow v1.2

## Rollen
- ChatGPT (Coach): Tickets, Prompts, Prozess. Kein Code.
- Nutzer: Handover an Codex, Output übernehmen, Tests, PR/Merge.
- Codex: Code strikt nach Ticket, inkl. Testanleitung.
- CI: Smoke auf jedem PR.

## Ablauf
1) Ticket (`tickets/AT-xxx.md`) mit: Ziel · Scope · Inputs · Output · Tests · DoD · **Smoke-Curl**.
2) Handover an Codex (Template), 1:1 ohne Änderungen.
3) Output exakt übernehmen, Feature-Branch committen.
4) **Tests lokal**: Emulator starten, Smoke-Curl aus Ticket, Ergebnis prüfen.
5) PR → CI muss grün → `.gh/pr_checklist.md` abhaken → Merge.
6) Nächstes Ticket.

## Testing-Regeln
- Emulator: `npm run emu --prefix functions`.
- Windows-PowerShell: JSON korrekt escapen:
  ```powershell
  curl.exe -s -X POST URL `
    -H "Content-Type: application/json" `
    -d '{\"k\":\"v\"}'
UI: http://127.0.0.1:4000 (Functions/Firestore) zur Sichtprüfung.

CI: wartet auf Ports, ruft Smoke-Script, schlägt rot bei 4xx/5xx oder ungültigem JSON.

Ticket-Checkliste
 Ticket im Repo, Smoke-Curl enthalten

 Handover an Codex gesendet

 Output übernommen, nur Scope-Dateien geändert

 Lokal: Smoke grün

 PR offen, CI grün

 Merge nach DoD

Branch/PR
Branch: feature/AT-xxx-slug

Rebase auf main vor PR

Kein Direct-Push auf main

Version: v1.2 · Status: Stabil · Owner: Stephan Gauglitz
