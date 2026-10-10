// Pruebas unitarias aisladas del Worker con Firebase y Cloudinary simulados.
// No usa API Secret ni realiza peticiones reales.
import assert from 'node:assert/strict';
import { generateKeyPairSync, createSign, createHash } from 'node:crypto';
import worker from '../cloudflare-worker/lushka-imagenes-api.worker.js';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const publicJwk = { ...publicKey.export({ format: 'jwk' }), kid: 'test-key', alg: 'RS256', use: 'sig' };
const b64url = value => Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url');
function token(admin) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url({ alg: 'RS256', kid: 'test-key' });
  const body = b64url({ aud: 'lushka-d4238', iss: 'https://securetoken.google.com/lushka-d4238',
    sub: 'usuario123', iat: now - 1, exp: now + 3600, auth_time: now - 60, admin });
  const signature = createSign('RSA-SHA256').update(`${header}.${body}`).sign(privateKey).toString('base64url');
  return `${header}.${body}.${signature}`;
}

const env = { CLOUDINARY_CLOUD_NAME: 'example', CLOUDINARY_API_KEY: 'public-test-key',
  CLOUDINARY_API_SECRET: 'test-secret-not-real', FIREBASE_PROJECT_ID: 'lushka-d4238' };
let uploads = 0;
const oldFetch = globalThis.fetch;
globalThis.fetch = async (input, options) => {
  const url = String(input);
  if (url.includes('googleapis.com/service_accounts')) {
    return Response.json({ keys: [publicJwk] });
  }
  if (url.includes('api.cloudinary.com')) {
    uploads += 1;
    const form = options.body;
    const timestamp = form.get('timestamp');
    const expected = createHash('sha1').update(`timestamp=${timestamp}&upload_preset=lushka_productos${env.CLOUDINARY_API_SECRET}`).digest('hex');
    assert.equal(form.get('signature'), expected);
    assert.equal(form.get('upload_preset'), 'lushka_productos');
    return Response.json({ secure_url: 'https://res.cloudinary.com/example/image/upload/test.png', public_id: 'test' });
  }
  throw new Error('Red inesperada: ' + url);
};
try {
  const origin = 'http://localhost:8100';
  const health = await worker.fetch(new Request('https://worker.test/health', { headers: { Origin: origin } }), env);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).ok, true);
  const form = new FormData();
  form.append('file', new File([new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,0])], 'prueba.png', { type: 'image/png' }));
  const call = bearer => worker.fetch(new Request('https://worker.test/upload', {
    method: 'POST', headers: { Origin: origin, ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}) }, body: form
  }), env);
  assert.equal((await call(null)).status, 401, 'sin login');
  assert.equal((await call(token(false))).status, 403, 'cliente sin rol');
  const success = await call(token(true));
  assert.equal(success.status, 200, 'admin autorizado');
  assert.equal((await success.json()).ok, true);
  assert.equal(uploads, 1);
  console.log('Worker OK: /health, 401 sin token, 403 cliente, 200 admin, firma Cloudinary verificada.');
} finally { globalThis.fetch = oldFetch; }
