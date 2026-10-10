# Guía de presentación — Corte 2

**Asignatura:** Desarrollo de Aplicaciones Móviles Híbridas. **Proyecto:** Lushka Beauty.

## Identificación y responsabilidades

- **Equipo (máximo 3 integrantes):** completar con nombres de los miembros.
- **Roles y aportes:** completar según los commits reales de GitHub.
- **Repositorio GitHub:** completar con URL de la entrega.
- **Problema:** gestionar un catálogo de productos de belleza, autenticación de clientes, solicitudes de pedido e inventario en una app híbrida.
- **Solución:** Ionic + Angular + Firebase Authentication/Firestore + Cloudinary/Cloudflare Worker para imágenes.

## Matriz de cobertura de la actividad

| Criterio del enunciado | Evidencia concreta |
|---|---|
| Servicios de datos JS asíncronos | `src/app/services/*.ts`, `async/await`, Firebase SDK y `fetch` a Worker |
| CRUD persistente | `productos.ts`, vistas de productos y Firestore `productos` |
| DOM reactivo y estados condicionales | Plantillas con `*ngIf`, `[class.no-stock]`, rol admin, loading y resultados vacíos |
| Feedback asíncrono | `ToastController`, validación de imagen, spinner de usuarios, estados de envío |
| Git y colaboración | Documentar aportes de cada integrante con capturas de commits, no inventarlos |
| Capturas CRUD | `docs/evidencias`; incluir después GIF/capturas adicionales de editar y eliminar si los solicitan |
| Instalación | README sección 2: `npm install`, `npx ionic serve` |
| API/Firebase | README secciones 5 y 6: colecciones, acceso y HTTP Worker |
| Árbol de carpetas / modularidad | README sección 11 |
| Avances y pendientes | README secciones 9 y 13 |

## Evidencias sugeridas durante sustentación

1. Abrir `ionic serve` y catálogo como visitante.
2. Entrar como cliente (sin mostrar contraseña) y mostrar carrito persistente tras actualizar.
3. Mostrar solicitud de pedido y su aparición en Firestore.
4. Entrar al administrador y mostrar productos/usuarios.
5. Crear un producto TEMPORAL, subir imagen a Cloudinary y editar su stock.
6. Eliminar solo el producto temporal.
7. Confirmar pedido de prueba y verificar descuento; cancelar y verificar devolución sin duplicación.
8. Mostrar logs de pruebas `npm run test:inventory`, `npm run test:ui`.

**Protección de datos:** ocultar direcciones, números de teléfono, correos particulares, contraseñas, tokens y API Secrets en las capturas utilizadas públicamente.

## Corte 3 (opcional / por completar)

Evaluar pagos reales y backend confiable, pruebas de concurrencia de clientes, auditoría de inventario, accesibilidad móvil y despliegue público seguro. Son oportunidades de mejora, no funcionalidades ya entregadas.
