Ziel: Smoke-Test in CI grün.

Ursache: 404, Function noch nicht registriert.

DoD: CI grün; Script wartet bis 200 OK; prüft {message, ts}.

Fehlermeldung:
Run npm run test:emu --prefix functions

> test:emu
> node scripts/emu-smoke.js

Running smoke test against http://127.0.0.1:5001/recovery-engine/europe-west1/helloWorld
Smoke test failed ❌
Error: Unexpected response status 404: Function europe-west1-helloWorld does not exist, valid functions are: 
    at main (/home/runner/work/recovery-engine/recovery-engine/functions/scripts/emu-smoke.js:73:11)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
Error: Process completed with exit code 1.
