# Lushka Beauty

Aplicación híbrida para la gestión y comercialización de productos de **Lushka Beauty**, desarrollada como proyecto ABP de la Fundación Universitaria Compensar.

## 📱 Descripción del proyecto

**Lushka Beauty** busca facilitar el proceso de compra de productos y mejorar la gestión interna de los pedidos mediante una aplicación móvil.

La propuesta contempla una solución que permita a los clientes consultar productos, organizar sus compras y realizar pedidos, mientras que el administrador podrá gestionar el catálogo y realizar seguimiento de los pedidos.

### Pregunta guía

> ¿Cómo mejorar la gestión de pedidos de Lushka Beauty y facilitar el proceso de compra de sus clientes?

---

## 🎯 Objetivo

Desarrollar una aplicación híbrida que permita centralizar la gestión de productos y pedidos de Lushka Beauty, ofreciendo una experiencia sencilla para los clientes y herramientas de administración para la gestión interna.

## 📌 Alcance inicial

Durante esta etapa del proyecto se contempla:

* Diseño y construcción de la interfaz móvil.
* Estructuración de las vistas principales.
* Diseño del catálogo de productos.
* Organización de productos por categorías.
* Gestión de usuarios y roles.
* Carrito de compras.
* Creación y consulta de pedidos.
* Consulta del estado de los pedidos.
* Gestión administrativa.
* Posterior integración con API y base de datos.
* Pruebas y preparación de la aplicación para dispositivos móviles.

---

## 👥 Equipo de trabajo

| Rol            | Integrante             |
| -------------- | ---------------------- |
| Tech Lead      | Danna Valentina Pulido |
| UI/UX Frontend | Leidy Vanessa Zambrano |
| Fullstack API  | Johan Stivens Rojas    |
| QA & Release   | Johan Stivens Rojas    |

---

## 👤 Roles del sistema

### Cliente

El cliente podrá:

* Consultar el catálogo de productos.
* Visualizar productos por categorías.
* Consultar el detalle de los productos.
* Administrar su carrito.
* Realizar pedidos.
* Consultar el estado de sus pedidos.
* Consultar su historial de compras.

### Administrador

El administrador podrá:

* Gestionar el catálogo.
* Crear, editar y eliminar productos.
* Gestionar categorías.
* Consultar pedidos.
* Actualizar el estado de los pedidos.
* Gestionar usuarios y roles.
* Administrar la información del sistema.

---

## 🛠️ Tecnologías utilizadas

* **Ionic Framework**
* **Angular**
* **TypeScript**
* **Capacitor**
* **HTML5**
* **SCSS**
* **Node.js / npm**
* **Git y GitHub**

### Configuración de Capacitor

La aplicación utiliza Capacitor para preparar el proyecto para su ejecución como aplicación móvil.

Configuración actual:

* **App ID:** `io.ionic.starter`
* **Nombre:** `lushka-beauty`
* **Web directory:** `www`

---

## 📂 Estructura del proyecto

```text
LushkaBeauty/
│
├── src/
│   ├── app/
│   │   ├── home/
│   │   ├── app.component.html
│   │   ├── app.component.ts
│   │   ├── app-routing.module.ts
│   │   └── app.module.ts
│   │
│   ├── assets/
│   ├── environments/
│   └── theme/
│
├── capacitor.config.ts
├── angular.json
├── package.json
├── package-lock.json
└── README.md
```

---

## ▶️ Instalación y ejecución

### Requisitos

Se recomienda tener instalado:

* Node.js
* npm
* Ionic CLI
* Git

### Clonar el repositorio

```bash
git clone https://github.com/Johan140726/LushkaBeauty.git
```

Ingresar al proyecto:

```bash
cd LushkaBeauty
```

### Instalar dependencias

```bash
npm install
```

### Ejecutar la aplicación

```bash
ionic serve
```

La aplicación estará disponible normalmente en:

```text
http://localhost:8100
```

---

## 📱 Capacitor

El proyecto cuenta con Capacitor para permitir posteriormente la generación de aplicaciones móviles.

Para verificar la configuración:

```bash
npx cap doctor
```

Para agregar Android en una etapa posterior:

```bash
npm install @capacitor/android
npx cap add android
```

---

## 🚀 Proyección del proyecto

Como evolución del proyecto se contempla:

1. Finalizar las interfaces principales.
2. Implementar el catálogo.
3. Implementar usuarios y roles.
4. Integrar una API.
5. Integrar una base de datos.
6. Implementar carrito y pedidos.
7. Implementar funcionalidades administrativas.
8. Realizar pruebas.
9. Generar la aplicación Android mediante Capacitor.
10. Preparar el proyecto para una posible publicación en Google Play Store.

---

## 📚 Proyecto académico

**Proyecto ABP — Fundación Universitaria Compensar**

**Aplicación:** Lushka Beauty

**Repositorio:** GitHub

**Estado:** En desarrollo
