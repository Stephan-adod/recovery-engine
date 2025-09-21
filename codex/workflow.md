# Codex-First Workflow v1.0

## Rollen
- **ChatGPT (Coach):** erstellt Atomic Tickets, Prompts, Prozessdoku. Kein Code.
- **Nutzer:** Ticket 1:1 an Codex geben, Output einspielen, Tests starten, PR/Merge.
- **Codex:** liefert Code/Diffs strikt nach Ticket, inkl. Testanleitung.
- **Testing (CI-first):** primär CI-Smoketests, Emulator nur ergänzend.

## Workflow-Schritte
1) **Ticket-Erstellung** (	ickets/AT-xxx.md):
   Ziel · Scope · Inputs · Output · Tests · DoD. Max 2h Codex-Aufwand.
2) **Handover an Codex** (Template codex/prompts/atomic_ticket.txt):
   Repo-Tree + Ticket + Constraints. Prompt 1:1 übergeben.
3) **Codex-Output übernehmen:**
   Dateien/Diffs ins Repo, Feature-Branch committen.
4) **Testing:**
   Tests exakt wie von Codex beschrieben. Bei Fehlern: Minimal-Fix-Prompt → Retest.
5) **PR & Merge:**
   Branch eature/AT-xxx-slug, PR, .gh/pr_checklist.md abhaken, CI grün → Merge.

## Prinzipien (aus Codex Prinzipien v0.1)
- Atomic Tickets, messbare Artefakte, enger Loop (Prompt→Code→Test→Commit).
- Automation-by-Default (CI), Human-in-the-Loop für High-Risk.
- Iteration: Define → Generate → Auto-Test → PR → Merge → Next.

## Runbook-Checks pro Ticket
- [ ] Ticket im Repo (	ickets/AT-xxx.md)
- [ ] Prompt an Codex übergeben
- [ ] Output eingespielt
- [ ] Tests bestanden (laut Codex)
- [ ] PR erstellt, CI grün
- [ ] Merge nach DoD

**Version:** v1.0 · **Owner:** Stephan Gauglitz
