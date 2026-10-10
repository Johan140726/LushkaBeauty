/*
 * Lushka Beauty - Cloudflare Worker para imágenes de productos.
 * Configurar en Settings > Variables and Secrets:
 * CLOUDINARY_CLOUD_NAME (Variable), CLOUDINARY_API_KEY (Variable),
 * CLOUDINARY_API_SECRET (Secret), FIREBASE_PROJECT_ID (Variable).
 * Rutas: GET /health y POST /upload (Bearer ID token Firebase con admin:true).
 * No incluir claves privadas ni archivos JSON de Firebase en este código.
 */

const GOOGLE_JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const UPLOAD_PRESET = 'lushka_productos';
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

// Unicamente orígenes locales conocidos durante las pruebas Ionic.
// Al publicar la tienda, agregar su dominio a ALLOWED_ORIGINS en Cloudflare.
const DEFAULT_ORIGINS = [
  'http://localhost:8100',
  'http://127.0.0.1:8100',
  'http://localhost:4200',
  'http://127.0.0.1:4200',
  'http://localhost',
  'capacitor://localhost',
  'ionic://localhost'
];

let cachedJwks = null;
let jwksExpiresAt = 0;

function getAllowedOrigins(env) {
  const additions = String(env.ALLOWED_ORIGINS || '')
    .split(',').map(value => value.trim()).filter(Boolean);
  return new Set([...DEFAULT_ORIGINS, ...additions]);
}

function corsHeaders(origin, env) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Vary': 'Origin'
  };
  if (origin && getAllowedOrigins(env).has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
    headers['Access-Control-Max-Age'] = '600';
  }
  return headers;
}

function responseJson(data, status, origin, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin, env)
  });
}

function base64UrlBytes(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new Error('Token inválido');
  }
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
  return Uint8Array.from(decoded, char => char.charCodeAt(0));
}

function parseJwtSegment(value) {
  return JSON.parse(new TextDecoder().decode(base64UrlBytes(value)));
}

async function firebasePublicKeys() {
  if (cachedJwks && Date.now() < jwksExpiresAt) return cachedJwks;
  const response = await fetch(GOOGLE_JWKS_URL);
  if (!response.ok) throw new Error('No fue posible verificar las claves públicas de Firebase');
  const result = await response.json();
  if (!Array.isArray(result.keys)) throw new Error('Respuesta de claves inválida');
  // Las claves rotan: caché de solo diez minutos por instancia del Worker.
  cachedJwks = result.keys;
  jwksExpiresAt = Date.now() + 10 * 60 * 1000;
  return cachedJwks;
}

async function verifyFirebaseIdToken(token, projectId) {
  const chunks = token.split('.');
  if (chunks.length !== 3) throw new Error('Token inválido');

  const header = parseJwtSegment(chunks[0]);
  const payload = parseJwtSegment(chunks[1]);
  const now = Math.floor(Date.now() / 1000);

  if (header.alg !== 'RS256' || typeof header.kid !== 'string' || !header.kid) {
    throw new Error('Encabezado de token inválido');
  }
  if (payload.aud !== projectId ||
      payload.iss !== `https://securetoken.google.com/${projectId}` ||
      typeof payload.sub !== 'string' || payload.sub.length === 0 || payload.sub.length > 128 ||
      typeof payload.exp !== 'number' || payload.exp <= now ||
      typeof payload.iat !== 'number' || payload.iat > now ||
      typeof payload.auth_time !== 'number' || payload.auth_time > now) {
    throw new Error('Token vencido o emitido para otro proyecto');
  }

  const keys = await firebasePublicKeys();
  const jwk = keys.find(k => k.kid === header.kid && k.kty === 'RSA');
  if (!jwk) throw new Error('Firma de token desconocida');

  const publicKey = await crypto.subtle.importKey(
    'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
  );
  const verified = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5', publicKey,
    base64UrlBytes(chunks[2]), new TextEncoder().encode(`${chunks[0]}.${chunks[1]}`)
  );
  if (!verified) throw new Error('Firma de token inválida');
  return payload;
}

async function validateImage(file) {
  if (!file || typeof file.size !== 'number' || typeof file.arrayBuffer !== 'function') {
    return false;
  }
  if (file.size === 0 || file.size > MAX_FILE_BYTES || !ALLOWED_MIME.has(file.type)) {
    return false;
  }
  // También valida la firma (magic bytes), no solo el MIME enviado por el navegador.
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isJpeg = file.type === 'image/jpeg' &&
    bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = file.type === 'image/png' &&
    [137, 80, 78, 71, 13, 10, 26, 10].every((n, i) => bytes[i] === n);
  const isWebp = file.type === 'image/webp' &&
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  return isJpeg || isPng || isWebp;
}

async function signCloudinary(params, apiSecret) {
  const sorted = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const digest = await crypto.subtle.digest(
    'SHA-1', new TextEncoder().encode(sorted + apiSecret)
  );
  return Array.from(new Uint8Array(digest), byte =>
    byte.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    if (origin && !getAllowedOrigins(env).has(origin)) {
      return responseJson({ error: 'Origen no autorizado' }, 403, origin, env);
    }

    const pathname = new URL(request.url).pathname;
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin, env)
      });
    }
    if (pathname === '/health' && request.method === 'GET') {
      return responseJson({ ok: true, servicio: 'Lushka Imágenes' }, 200, origin, env);
    }
    if (pathname !== '/upload' || request.method !== 'POST') {
      return responseJson({ error: 'Ruta no encontrada' }, 404, origin, env);
    }

    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY ||
        !env.CLOUDINARY_API_SECRET || !env.FIREBASE_PROJECT_ID) {
      return responseJson({ error: 'Variables del Worker incompletas' }, 500, origin, env);
    }

    const authorization = request.headers.get('Authorization') || '';
    if (!authorization.startsWith('Bearer ')) {
      return responseJson({ error: 'Debes iniciar sesión' }, 401, origin, env);
    }

    let claims;
    try {
      claims = await verifyFirebaseIdToken(
        authorization.slice('Bearer '.length), env.FIREBASE_PROJECT_ID
      );
    } catch {
      return responseJson({ error: 'Sesión inválida o vencida' }, 401, origin, env);
    }
    if (claims.admin !== true) {
      return responseJson({ error: 'Solo el administrador puede subir imágenes' }, 403, origin, env);
    }

    const contentLength = Number(request.headers.get('Content-Length') || 0);
    // El formulario contiene algo de sobrecarga adicional además del archivo.
    if (contentLength > MAX_FILE_BYTES + 64 * 1024) {
      return responseJson({ error: 'Archivo demasiado grande (máximo 5 MB)' }, 413, origin, env);
    }

    let file;
    try {
      const form = await request.formData();
      file = form.get('file');
    } catch {
      return responseJson({ error: 'Debes enviar una imagen en el campo file' }, 400, origin, env);
    }
    if (!(await validateImage(file))) {
      return responseJson({ error: 'Solo JPG, PNG o WEBP de hasta 5 MB' }, 400, origin, env);
    }

    const timestamp = String(Math.floor(Date.now() / 1000));
    const params = { timestamp, upload_preset: UPLOAD_PRESET };
    const signature = await signCloudinary(params, env.CLOUDINARY_API_SECRET);
    const outgoing = new FormData();
    outgoing.set('file', file, file.name || 'producto');
    outgoing.set('api_key', env.CLOUDINARY_API_KEY);
    outgoing.set('timestamp', timestamp);
    outgoing.set('upload_preset', UPLOAD_PRESET);
    outgoing.set('signature', signature);

    try {
      const upload = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(env.CLOUDINARY_CLOUD_NAME)}/image/upload`,
        { method: 'POST', body: outgoing }
      );
      const result = await upload.json();
      if (!upload.ok || !result.secure_url) {
        return responseJson({ error: 'Cloudinary rechazó la imagen. Revisa el preset y credenciales.' },
          502, origin, env);
      }
      return responseJson({ ok: true, url: result.secure_url, publicId: result.public_id },
        200, origin, env);
    } catch {
      return responseJson({ error: 'No se pudo conectar con Cloudinary' }, 502, origin, env);
    }
  }
};
