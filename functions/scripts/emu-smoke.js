#!/usr/bin/env node
'use strict';

const REQUIRED_ENV_VARS = [
  'GCLOUD_PROJECT',
  'GOOGLE_CLOUD_PROJECT',
  'FIRESTORE_EMULATOR_HOST'
];

function ensureNodeVersion() {
  const major = Number.parseInt(process.versions.node.split('.')[0], 10);
  if (Number.isNaN(major) || major < 18) {
    throw new Error(`Node.js >= 18 is required to run the smoke test (detected ${process.versions.node}).`);
  }
}

function ensureEnvironment() {
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables for emulator smoke test: ${missing.join(', ')}`);
  }
}

function resolveBaseUrl() {
  const host = process.env.FUNCTIONS_EMULATOR_HOST ?? '127.0.0.1:5001';
  const normalizedHost = host.startsWith('http://') || host.startsWith('https://') ? host : `http://${host}`;
  const trimmed = normalizedHost.endsWith('/') ? normalizedHost : `${normalizedHost}/`;
  return trimmed;
}

function validateResponsePayload(payload) {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new Error('Expected response payload to be a JSON object.');
  }

  if (typeof payload.message !== 'string' || payload.message.length === 0) {
    throw new Error('Expected "message" to be a non-empty string.');
  }

  if (typeof payload.ts !== 'string') {
    throw new Error('Expected "ts" to be a string.');
  }

  const parsed = new Date(payload.ts);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('The "ts" field is not a valid ISO-8601 timestamp.');
  }

  if (parsed.toISOString() !== payload.ts) {
    throw new Error('The "ts" field must be a canonical ISO-8601 string (e.g. produced by Date.toISOString()).');
  }
}

async function main() {
  ensureNodeVersion();
  ensureEnvironment();

  const baseUrl = resolveBaseUrl();
  const endpointPath = 'recovery-engine/europe-west1/helloWorld';
  const url = new URL(endpointPath, baseUrl).toString();

  console.log(`Running smoke test against ${url}`);

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json'
    },
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Unexpected response status ${response.status}: ${body}`);
  }

  const payload = await response.json();
  validateResponsePayload(payload);

  console.log('Smoke test passed ✅');
}

main().catch((error) => {
  console.error('Smoke test failed ❌');
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
