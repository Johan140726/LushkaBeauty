import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');

const app = 'src/app';
const archivos = [];
function recorrer(ruta) {
  for (const entry of readdirSync(ruta, { withFileTypes: true })) {
    const absolute = join(ruta, entry.name);
    if (entry.isDirectory()) recorrer(absolute);
    else if (absolute.endsWith('.ts') && !absolute.endsWith('.spec.ts')) archivos.push(absolute);
  }
}
recorrer('src');
let errores = 0;
for (const archivo of archivos) {
  const { diagnostics = [] } = ts.transpileModule(readFileSync(archivo, 'utf8'), {
    fileName: archivo, reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, experimentalDecorators: true }
  });
  for (const d of diagnostics) {
    console.error(`${archivo}: ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`);
    errores++;
  }
}
const productos = JSON.parse(readFileSync('scripts/productos-iniciales.json', 'utf8'));
for (const producto of productos) {
  if (!existsSync(join('src', producto.imagen))) {
    console.error('Falta imagen inicial:', producto.imagen); errores++;
  }
}
for (const ruta of ['firestore.rules', 'cloudflare-worker/lushka-imagenes-api.worker.js',
  'src/app/guards/admin.guard.ts', 'src/app/admin-usuarios/admin-usuarios.page.html']) {
  if (!existsSync(ruta)) { console.error('Falta archivo:', ruta); errores++; }
}
for (const nombre of ['auth','productos','pedidos','carrito']) {
  const s = readFileSync(`src/app/services/${nombre}.ts`, 'utf8');
  if (/localStorage\.(?:getItem|setItem|removeItem)/.test(s)) {
    console.error('Persistencia local no permitida en:', nombre); errores++;
  }
}
console.log(`Archivos TypeScript analizados: ${archivos.length}`);
console.log(`Productos iniciales y rutas de imagen verificados: ${productos.length}`);
console.log(`Problemas detectados: ${errores}`);
if (errores) process.exit(1);
