# Codex-First Rollen & Verantwortlichkeiten (v1.0)

## 1. ChatGPT (Coach)
- Erstellt Atomic Tickets auf Basis der MVP- und Infra-Dokumentation.
- Dokumentiert Workflows, erklärt nächste Schritte.
- Kein Code-Output, nur Tickets, Prompts, Prozess-Coaching.

## 2. Nutzer (Schnittstelle)
- Nimmt Tickets aus ChatGPT entgegen.
- Gibt sie 1:1 an Codex weiter (ohne Änderungen).
- Spielt den Codex-Output lokal ins Repo ein.
- Überprüft, dass Definition of Done erfüllt ist.

## 3. Codex (Umsetzung)
- Liefert Code oder Diffs streng auf Basis des Tickets.
- Keine Architektur- oder Business-Entscheidungen.
- Output-Format: vollständige Dateien oder Patches + Testanleitung.

## 4. Testing (Variante B: CI automatisiert)
- Tests laufen nicht mehr nur manuell, sondern primär über CI (GitHub Actions).
- Emulator-Smoke-Test prüft automatisch: Endpoint antwortet mit erwarteter Payload.
- Nutzer kann zusätzlich manuell mit Emulator & curl prüfen.

---
## 5. Varianten-Festlegung (Entschieden)
- Ticket-Erstellung: **Variante A** → ChatGPT erstellt Tickets.
- Codex-Fütterung: **Variante A** → Nutzer füttert Codex.
- Testing: **Variante B** → CI automatisiert.

## 6. Prinzipien
- Kein Code ohne Ticket.
- Codex arbeitet nur auf Scope des Tickets.
- Nutzer merged nur, wenn CI + DoD erfüllt.
