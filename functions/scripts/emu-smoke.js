#!/usr/bin/env node
'use strict';

const REQUIRED_ENV_VARS = [
  'GCLOUD_PROJECT',
  'GOOGLE_CLOUD_PROJECT',
  'FIRESTORE_EMULATOR_HOST'
];

const ENDPOINT_PATH = 'recovery-engine/europe-west1/helloWorld';
const ATTEMPT_TIMEOUT_MS = 10_000;
const TOTAL_TIMEOUT_MS = 120_000;
const RETRY_DELAY_MS = 2_000;

function ensureNodeVersion() {
  const major = Number.parseInt(process.versions.node.split('.')[0], 10);
  if (Number.isNaN(major) || major < 18) {
    throw new Error(
      `Node.js >= 18 is required to run the smoke test (detected ${process.versions.node}).`
    );
  }
}

function ensureEnvironment() {
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables for emulator smoke test: ${missing.join(', ')}`
    );
  }
}

function resolveBaseUrl() {
  const host = process.env.FUNCTIONS_EMULATOR_HOST ?? '127.0.0.1:5001';
  const normalizedHost =
    host.startsWith('http://') || host.startsWith('https://') ? host : `http://${host}`;
  return normalizedHost.endsWith('/') ? normalizedHost : `${normalizedHost}/`;
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
    throw new Error(
      'The "ts" field must be a canonical ISO-8601 string (e.g. produced by Date.toISOString()).'
    );
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url) {
  return fetch(url, {
    headers: {
      Accept: 'application/json'
    },
    signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS)
  });
}

async function main() {
  ensureNodeVersion();
  ensureEnvironment();

  const baseUrl = resolveBaseUrl();
  const url = new URL(ENDPOINT_PATH, baseUrl).toString();

  console.log(`Running smoke test against ${url}`);

  const deadline = Date.now() + TOTAL_TIMEOUT_MS;
  let attempt = 0;
  let lastError = null;

  while (Date.now() <= deadline) {
    attempt += 1;
    try {
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Attempt ${attempt}: Unexpected response status ${response.status}: ${body}`);
      }

      const payload = await response.json();
      validateResponsePayload(payload);

      console.log('Smoke test passed ✅');
      return;
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`${message}`);
      if (Date.now() + RETRY_DELAY_MS > deadline) {
        break;
      }
      console.log(`Retrying in ${Math.round(RETRY_DELAY_MS / 1000)}s...`);
      await delay(RETRY_DELAY_MS);
    }
  }

  console.error('Smoke test failed ❌');
  if (lastError) {
    console.error(lastError instanceof Error ? lastError.stack : lastError);
  }
  process.exitCode = 1;
}

main().catch((error) => {
  console.error('Smoke test failed ❌');
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
