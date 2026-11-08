# LUSHKA BEAUTY 💄
### Aplicación híbrida para la comercialización y gestión de productos de belleza

<p align="center">
  <img src="src/assets/logo/logo_lushka.png" alt="Logo Lushka Beauty" width="180">
</p>

<p align="center">
  **Proyecto Integrador · Desarrollo de Aplicaciones Móviles Híbridas**
  
  Fundación Universitaria Compensar
</p>

<p align="center">
  **🎥 VIDEO DEMOSTRATIVO:** [Ver presentación y funcionamiento de Lushka Beauty](PEGAR_AQUI_EL_ENLACE_DEL_VIDEO)
  
  **💻 REPOSITORIO:** [GitHub – LushkaBeauty](https://github.com/Johan140726/LushkaBeauty)
</p>

---

## 1. Descripción del proyecto

Lushka Beauty es una aplicación híbrida de comercio electrónico diseñada para facilitar la comercialización de productos de belleza y mejorar la gestión de pedidos de la marca.

La aplicación permite a los clientes explorar un catálogo organizado por categorías, consultar información de los productos, registrarse, iniciar sesión, administrar su carrito de compras y realizar pedidos.

Adicionalmente, cuenta con un módulo administrativo que permite gestionar productos, imágenes, inventario, usuarios y pedidos desde una interfaz intuitiva.

El proyecto está desarrollado utilizando Ionic Framework, Angular, TypeScript, Firebase y Capacitor, permitiendo su ejecución en entornos web y su preparación para dispositivos móviles Android.

## 2. Objetivos del proyecto

### Objetivo general

Desarrollar una aplicación híbrida que facilite el proceso de compra de los clientes de Lushka Beauty y optimice la administración de productos, inventario y pedidos mediante herramientas tecnológicas multiplataforma.

### Objetivos específicos

- Diseñar una interfaz intuitiva y adaptable a dispositivos móviles.
- Implementar autenticación de usuarios mediante Firebase.
- Desarrollar un catálogo de productos organizado por categorías.
- Implementar un carrito de compras y gestión de pedidos.
- Construir un módulo administrativo para operaciones CRUD.
- Integrar servicios de almacenamiento de imágenes.
- Gestionar el inventario mediante operaciones seguras en Firestore.
- Preparar la aplicación para su ejecución en Android mediante Capacitor.

## 3. Tecnologías utilizadas

| Tecnología | Aplicación dentro del proyecto |
|---|---|
| Ionic Framework 8 | Componentes e interfaz híbrida |
| Angular 20 | Arquitectura y desarrollo frontend |
| TypeScript | Lógica de programación |
| HTML5 | Estructura de las vistas |
| SCSS | Diseño y estilos |
| Capacitor 8 | Integración con dispositivos móviles |
| Firebase Authentication | Registro e inicio de sesión |
| Cloud Firestore | Almacenamiento y persistencia de datos |
| Cloudinary | Almacenamiento de imágenes |
| Cloudflare Workers | Servicio de carga segura de imágenes |
| Git y GitHub | Control de versiones y colaboración |
| Android Studio | Compilación y pruebas de Android |

## 4. Funcionalidades principales

### Módulo de clientes

- Registro de nuevos usuarios.
- Inicio de sesión con correo electrónico y contraseña.
- Inicio de sesión con Google en la versión web.
- Visualización del catálogo de productos.
- Consulta de categorías y productos destacados.
- Visualización del detalle de cada producto.
- Administración del carrito de compras.
- Realización de pedidos.
- Consulta del historial y estado de los pedidos.
- Consulta y actualización de información de la cuenta.

### Módulo administrativo

- Acceso restringido mediante roles y permisos.
- Consulta general de productos.
- Creación de productos.
- Edición de información, precios y existencias.
- Eliminación de productos.
- Carga de fotografías mediante Cloudinary.
- Administración de categorías y productos destacados.
- Consulta y gestión de pedidos.
- Actualización de estados de pedidos.
- Administración de usuarios.
- Consulta y control del inventario.

## 5. Capturas de pantalla de la aplicación

Las siguientes imágenes corresponden a las interfaces implementadas en la versión web de Lushka Beauty.

### 5.1. Inicio de sesión

Permite a los usuarios acceder mediante correo electrónico y contraseña o utilizar su cuenta de Google.

<p align="center">
  <img src="docs/evidencias/pantallaLoginContraseña.png" alt="Inicio de sesión con contraseña" width="420">
</p>

<p align="center">
  <img src="docs/evidencias/PantallaGoogle.png" alt="Inicio de sesión con Google" width="420">
</p>

### 5.2. Catálogo de productos

Permite consultar los productos disponibles y explorar las diferentes categorías de la tienda.

<p align="center">
  <img src="docs/evidencias/pantallaCatalogo.png" alt="Catálogo de Lushka Beauty" width="650">
</p>

### 5.3. Panel administrativo

Interfaz destinada a la administración general de la aplicación.

<p align="center">
  <img src="docs/evidencias/pantallaAdmin.png" alt="Panel administrativo de Lushka Beauty" width="650">
</p>

### 5.4. Gestión de productos

Formulario para registrar productos, asignar categorías, establecer precios, controlar existencias y cargar imágenes.

<p align="center">
  <img src="docs/evidencias/formulario-crear.png" alt="Formulario de creación de productos" width="650">
</p>

## 6. Arquitectura del sistema

La aplicación utiliza una arquitectura basada en módulos y servicios, separando las responsabilidades de presentación, autenticación, persistencia y gestión de información.

### Arquitectura general

```text
                  LUSHKA BEAUTY
                        |
                 Ionic + Angular
                        |
              ---------------------
              |                   |
         Módulo Cliente      Módulo Admin
              |                   |
              --------- ----------
                       |
                 Servicios Angular
                       |
          -----------------------------
          |             |             |
       Firebase      Firestore     Cloudflare
       Auth                         Worker
                       |             |
                   Productos     Cloudinary
                   Usuarios
                   Carritos
                   Pedidos
                   Inventario
```

### Persistencia de información

Se utiliza Cloud Firestore como base de datos NoSQL para almacenar y consultar la información de la aplicación.

Las principales colecciones son:

| Colección | Información almacenada |
|---|---|
| usuarios | Datos y roles de los usuarios |
| productos | Catálogo, precios, categorías e inventario |
| carritos | Productos seleccionados por cada cliente |
| pedidos | Información de las compras y sus estados |

### Seguridad

- Firebase Authentication administra las credenciales de acceso.
- Los usuarios cuentan con roles diferenciados.
- Las rutas administrativas utilizan mecanismos de protección.
- Las reglas de Firestore controlan los permisos de lectura y escritura.
- El servicio de imágenes verifica el token de Firebase y los permisos administrativos antes de permitir una carga.

## 7. Servicios externos e integración

### Firebase

Se utiliza para la autenticación de usuarios y la persistencia de información mediante Cloud Firestore.

Proyecto configurado: `lushka-d4238`.

### Cloudinary

Se utiliza para almacenar las fotografías de los productos y obtener sus URL públicas.

### Cloudflare Workers

Se implementó un servicio HTTP para gestionar la carga de imágenes, verificando la autenticación y los permisos del usuario administrador.

Servicio:

`https://lushka-imagenes-api.josrojaslouni.workers.dev`

La API dispone de las siguientes operaciones:

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Verificación del servicio |
| POST | `/upload` | Carga de imágenes autorizada |

Las imágenes admitidas son JPG, PNG y WEBP, con un tamaño máximo de 5 MB.

**Seguridad:** las claves privadas y los secretos de Cloudinary se almacenan en los servicios correspondientes y no deben publicarse en el repositorio.

## 8. Gestión de inventario y pedidos

El sistema implementa operaciones transaccionales en Firestore para mantener la consistencia del inventario.

El funcionamiento contempla:

1. El cliente genera un pedido.
2. El pedido queda registrado con estado pendiente.
3. El administrador revisa y confirma el pedido.
4. El sistema valida las existencias disponibles.
5. Al confirmar, se descuentan las unidades correspondientes.
6. Si el pedido se cancela después de descontar el inventario, las unidades se reintegran una sola vez.

Los pedidos pendientes no reservan unidades automáticamente.

**Nota:** el proyecto gestiona solicitudes de compra y pedidos, pero no incluye procesamiento de pagos electrónicos reales.

## 9. Instalación y ejecución del proyecto

### Requisitos previos

- Node.js.
- npm.
- Visual Studio Code.
- Git.
- Android Studio y Android SDK para pruebas móviles.
- Acceso a los servicios de Firebase y Cloudinary configurados para el proyecto.

### Clonar el repositorio

```bash
git clone https://github.com/Johan140726/LushkaBeauty.git
```

Ingresar a la carpeta:

```bash
cd LushkaBeauty
```

### Instalar dependencias

```bash
npm install
```

### Ejecutar en entorno web

```bash
npm run ionic:serve
```

También se puede utilizar:

```bash
npm start
```

La dirección local se mostrará en la terminal.

### Compilar el proyecto

```bash
npm run build
```

### Sincronizar con Android

```bash
npx cap sync android
```

### Abrir Android Studio

```bash
npx cap open android
```

Desde Android Studio se puede seleccionar un emulador o dispositivo físico para ejecutar la aplicación.

## 10. Pruebas y validación

Durante el desarrollo se realizaron pruebas funcionales sobre los principales módulos.

| Funcionalidad | Validación realizada |
|---|---|
| Registro de usuarios | Verificada en web |
| Inicio de sesión con correo | Verificada en web |
| Inicio de sesión con Google | Verificada en web |
| Creación de productos | Verificada |
| Actualización de productos | Verificada |
| Eliminación de productos | Verificada |
| Carga de imágenes | Verificada |
| Consulta del catálogo | Verificada |
| Gestión del carrito | Verificada |
| Gestión de pedidos | Verificada |
| Actualización del inventario | Verificada |
| Ejecución Android | Verificada |
| Autenticación Google en Android | Verificada |

### Scripts de pruebas disponibles

```bash
npm run test:static
```

```bash
npm run test:worker
```

```bash
npm run test:inventory
```

```bash
npm run test:ui
```

```bash
npm run lint:ts
```

Los resultados de cada prueba deben verificarse en el entorno de ejecución antes de presentar la aplicación como completamente validada.

## 11. Estructura del repositorio

```text
LushkaBeauty/
│
├── android/
│
├── cloudflare-worker/
│
├── docs/
│   └── evidencias/
│
├── scripts/
│
├── tests/
│
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── admin-pedidos/
│   │   ├── admin-producto-form/
│   │   ├── admin-productos/
│   │   ├── admin-usuarios/
│   │   ├── carrito/
│   │   ├── catalogo/
│   │   ├── checkout/
│   │   ├── guards/
│   │   ├── home/
│   │   ├── login/
│   │   ├── mi-cuenta/
│   │   ├── mis-pedidos/
│   │   ├── producto/
│   │   ├── registro/
│   │   └── services/
│   │
│   ├── assets
