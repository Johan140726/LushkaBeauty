# Lushka Beauty

Aplicación híbrida orientada a la visualización, gestión y comercialización de productos de **Lushka Beauty**, desarrollada como proyecto académico ABP de la Fundación Universitaria Compensar.

## Descripción del proyecto

**Lushka Beauty** surge como una propuesta para facilitar la consulta y compra de productos de belleza, cuidado personal y bienestar, al mismo tiempo que se plantea una futura solución para apoyar la gestión interna de productos y pedidos.

La aplicación busca proporcionar a los clientes una interfaz intuitiva y visual desde la cual puedan explorar el catálogo, consultar información de los productos y administrar un carrito de compras.

A medida que avance el proyecto se incorporarán funcionalidades para clientes y administradores, incluyendo gestión de pedidos, usuarios, productos e inventario.

### Pregunta guía

> ¿Cómo mejorar la gestión de pedidos de Lushka Beauty y facilitar el proceso de compra de sus clientes mediante una aplicación híbrida?

---

## Objetivo general

Desarrollar una aplicación híbrida utilizando Ionic Framework y Angular que permita mejorar la experiencia de consulta y compra de productos de Lushka Beauty y que pueda evolucionar hacia una herramienta de gestión de productos, pedidos e inventario.

---

## Justificación

Actualmente, la gestión de productos y pedidos puede requerir diferentes canales de comunicación y procesos manuales que dificultan la organización de la información.

Lushka Beauty propone centralizar progresivamente estos procesos mediante una aplicación híbrida que permita presentar el catálogo de manera organizada y proporcionar herramientas digitales tanto para los clientes como para la administración.

El uso de Ionic Framework permite desarrollar una solución basada en tecnologías web con posibilidad de adaptación a dispositivos móviles mediante Capacitor.

---

## Alcance

El proyecto contempla el desarrollo progresivo de las siguientes funcionalidades:

### Cliente

- Visualización de la página de inicio.
- Consulta del catálogo de productos.
- Filtrado de productos por categorías.
- Visualización del detalle de un producto.
- Selección de cantidades.
- Carrito de compras.
- Cálculo del subtotal y valor total del pedido.
- Registro e inicio de sesión.
- Creación de pedidos.
- Consulta del estado e historial de pedidos.

### Administrador

En etapas posteriores se contempla:

- Inicio de sesión con rol administrativo.
- Gestión del catálogo.
- Registro de nuevos productos.
- Edición de productos.
- Gestión de precios.
- Gestión de inventario.
- Consulta y administración de pedidos.
- Actualización del estado de los pedidos.

---

## Estado actual del prototipo

Para la primera entrega se encuentran implementadas las siguientes vistas y funcionalidades:

- Página de inicio de Lushka Beauty.
- Navegación mediante Angular Router.
- Catálogo de productos.
- Organización y filtrado por categorías.
- Uso de imágenes reales de productos.
- Vista de detalle de producto mediante rutas dinámicas.
- Selección de cantidad.
- Carrito de compras.
- Modificación y eliminación de productos del carrito.
- Persistencia temporal del carrito mediante LocalStorage.
- Cálculo de subtotal.
- Tarifa de envío para Bogotá y Soacha.
- Cálculo del total del pedido.
- Servicio centralizado para la información de productos.
- Diseño responsive orientado a dispositivos móviles.

---

## Equipo de trabajo

| Integrante | Rol principal |
| --- | --- |
| Leidy Vanessa Zambrano| Tech Lead |
| Danna Valentina Pulido | UI/UX y Frontend |
| Johan Stivens Rojas | Full Stack, API y QA |

Los roles representan las responsabilidades principales dentro del proyecto y pueden complementarse entre los integrantes durante el desarrollo.

---

## Tecnologías utilizadas

- Ionic Framework
- Angular
- TypeScript
- HTML5
- SCSS
- Capacitor
- Node.js
- npm
- Git
- GitHub
- LocalStorage

---

## Arquitectura inicial

La aplicación utiliza una arquitectura modular basada en páginas de Ionic y Angular.

Actualmente se encuentran organizadas las principales vistas en módulos independientes:

```text
src/
|
+-- app/
|   +-- home/
|   +-- catalogo/
|   +-- producto/
|   +-- carrito/
|   +-- services/
|   |   +-- productos.ts
|   |   +-- carrito.ts
|   |
|   +-- app-routing.module.ts
|   +-- app.component.html
|   +-- app.component.ts
|   +-- app.module.ts
|
+-- assets/
|   +-- logo/
|   +-- productos/
|
+-- theme/
```

La estructura principal de Ionic se encuentra definida mediante:

```html
<ion-app>
  <ion-router-outlet></ion-router-outlet>
</ion-app>
```

Las diferentes vistas utilizan componentes de Ionic como:

- `ion-app`
- `ion-router-outlet`
- `ion-header`
- `ion-toolbar`
- `ion-content`
- `ion-button`
- `ion-buttons`
- `ion-back-button`

---

## Navegación actual

El flujo principal implementado es:

```text
Inicio
   |
   v
Catálogo
   |
   v
Detalle del producto
   |
   v
Carrito
```

El detalle de cada producto utiliza rutas dinámicas:

```text
/producto/:id
```

Por ejemplo:

```text
/producto/1
```

---

## Gestión actual de datos

Durante esta primera etapa los productos se encuentran centralizados mediante un servicio de Angular.

El servicio de productos permite que el catálogo y la vista de detalle consulten una misma fuente de información, evitando duplicar los datos.

El carrito utiliza un servicio independiente y LocalStorage para conservar temporalmente la selección realizada por el usuario.

Esta implementación corresponde al prototipo inicial. En fases posteriores se contempla integrar persistencia mediante una API y una base de datos.

---

## Capacitor

El proyecto cuenta con Capacitor para permitir posteriormente su ejecución y empaquetado como aplicación móvil.

Archivo de configuración:

```text
capacitor.config.ts
```

Configuración inicial:

```text
App ID: io.ionic.starter
Nombre: lushka-beauty
Web directory: www
```

Para verificar la configuración:

```bash
npx cap doctor
```

---

## Instalación y ejecución

### Requisitos

Para ejecutar el proyecto se requiere:

- Node.js
- npm
- Ionic CLI
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/Johan140726/LushkaBeauty.git
```

### 2. Ingresar al proyecto

```bash
cd LushkaBeauty
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Ejecutar la aplicación

```bash
ionic serve
```

La aplicación estará disponible normalmente en:

```text
http://localhost:8100
```

---

## Prototipado UX/UI

El diseño de Lushka Beauty está orientado a una experiencia móvil y utiliza una identidad visual basada en la marca.

### Color principal

```text
#8E183A
```

La interfaz utiliza componentes de Ionic adaptados visualmente mediante SCSS.

El proyecto contempla la elaboración de:

- Sketches.
- Wireframes.
- Mockups.
- Prototipo interactivo.
- Sistema visual basado en componentes Ionic UI.

**Enlace al prototipo:** pendiente de agregar.

---

## Evolución del proyecto

Las siguientes etapas contemplan continuar con:

1. Registro e inicio de sesión.
2. Diferenciación entre cliente y administrador.
3. Área de usuario.
4. Panel administrativo.
5. Gestión de productos.
6. Gestión de inventario.
7. Gestión de pedidos.
8. Persistencia mediante API y base de datos.
9. Pruebas.
10. Preparación de la aplicación para dispositivos móviles.

También se contempla como mejora futura permitir variantes de productos, como colores, extractos, aromas o presentaciones.

---

## Proyecto académico

**Proyecto ABP - Fundación Universitaria Compensar**

**Aplicación:** Lushka Beauty

**Estado:** En desarrollo