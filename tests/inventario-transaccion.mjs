/** Pruebas simuladas. No toca datos reales de Firebase. */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import { strict as assert } from 'node:assert';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const compile = (file) => ts.transpileModule(readFileSync(new URL(file,import.meta.url),'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,experimentalDecorators:true}}).outputText;
const inventoryModule={exports:{}};
vm.runInNewContext(compile('../src/app/services/inventario.ts'),{module:inventoryModule,exports:inventoryModule.exports, Error, Set},{timeout:1000});
const store = new Map();
const fixture = (state='Pendiente', stock=20, inventor) => {
 store.clear();
 store.set('pedidos/100', { id:100, estado:state, stockDevuelto:false, ...(inventor!==undefined?{inventarioDescontado:inventor}:{}), productos:[{id:1,cantidad:5,nombre:'Espuma Facial'}] });
 store.set('productos/1',{id:1,nombre:'Espuma Facial',stock});
};
const clone=(obj)=>JSON.parse(JSON.stringify(obj));
const snapshot = (key) => ({exists:()=>store.has(key),data:()=>clone(store.get(key))});
const auth={currentUser:{getIdTokenResult:async()=>({claims:{admin:true}})}};
const firebase = {
 doc:(_,collection,id)=>({key:`${collection}/${id}`}),
 runTransaction:async (_,handler)=>{
   const writes=[];
   const transaction={get:async(ref)=>snapshot(ref.key),update:(ref, patch)=>writes.push([ref.key,patch])};
   const result=await handler(transaction);
   for(const [key,patch] of writes) store.set(key,{...store.get(key),...clone(patch)});
   return result;
 }
};
const pedidosModule={exports:{}};
const importStub = (name)=>{
 if(name==='firebase/firestore')return firebase;
 if(name==='@angular/core')return {Injectable:()=>clazz=>clazz};
 if(name==='./firebase')return {auth,db:{}};
 if(name==='./inventario')return inventoryModule.exports;
 throw new Error('Unexpected import '+name);
};
vm.runInNewContext(compile('../src/app/services/pedidos.ts'),{require:importStub,module:pedidosModule,exports:pedidosModule.exports,Number,Set,Promise,Error,Date},{timeout:1500});
const service = new pedidosModule.exports.PedidosService();
fixture();
await service.actualizarEstado(100,'Confirmado');
assert.equal(store.get('productos/1').stock,15);
assert.equal(store.get('pedidos/100').inventarioDescontado,true);
await assert.rejects(service.actualizarEstado(100,'Confirmado'));
assert.equal(store.get('productos/1').stock,15);
await service.actualizarEstado(100,'Cancelado');
assert.equal(store.get('productos/1').stock,20);
assert.equal(store.get('pedidos/100').stockDevuelto,true);
await assert.rejects(service.actualizarEstado(100,'Confirmado'));
fixture('Pendiente',3);
await assert.rejects(service.actualizarEstado(100,'Confirmado'),/Stock insuficiente/);
assert.equal(store.get('productos/1').stock,3);
assert.equal(store.get('pedidos/100').estado,'Pendiente');
fixture('Confirmado',20);
await service.regularizarInventario(100);
assert.equal(store.get('productos/1').stock,15);
await assert.rejects(service.regularizarInventario(100));
assert.equal(store.get('productos/1').stock,15);
console.log('Transacciones simuladas: confirmación, anti-duplicado, cancelación, stock insuficiente y regularización OK.');
