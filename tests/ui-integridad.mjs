import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const root = 'src/app';
const used = new Set();
function walk(folder) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.html')) {
      const content = readFileSync(path, 'utf8');
      for (const m of content.matchAll(/<ion-icon\b[^>]*\bname="([a-z0-9-]+)"/g)) used.add(m[1]);
    }
  }
}
walk(root);
const component = readFileSync('src/app/app.component.ts', 'utf8');
const toCamel = name => name.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
for (const name of used) {
  assert.ok(component.includes(toCamel(name)), `Ícono no registrado: ${name}`);
}
const css = readFileSync('src/global.scss', 'utf8');
assert.ok(!css.includes('@import "@ionic/angular/css/palettes/dark.system.css"'));
assert.ok(css.includes('color-scheme: light'));
const html = readFileSync('src/app/admin-usuarios/admin-usuarios.page.html', 'utf8');
const scss = readFileSync('src/app/admin-usuarios/admin-usuarios.page.scss', 'utf8');
assert.ok(html.includes('Usuarios registrados') && html.includes('ion-searchbar'));
assert.ok(scss.includes('#faf7f5') && scss.includes('#8e183a'));
const capturas = ['catalogo-publico.png', 'producto-inventario.png', 'carrito-firebase.png', 'formulario-crear.png', 'pedidos-historial.png', 'usuarios-perfiles.png'];
for (const captura of capturas) assert.ok(existsSync(`docs/evidencias/${captura}`));
console.log(`OK: ${used.size} iconos registrados, tema claro, pantalla de usuarios y ${capturas.length} evidencias.`);
