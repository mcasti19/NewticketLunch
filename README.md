# 🚀 Nombre del Proyecto

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

 Pensado en facilitar la gestión y distribución de los tickets para acceder al comedor, ayudando con la logística y evitando el uso innecesario de nuevos materiales de oficina para tal fin. También se tiene pensado que funcione tanto para el personal regular como para invitados, en jornadas regulares diarias y eventos especiales tipo marchas políticas.
          

## 📌 Tabla de Contenidos
- [Características](#🌟-características)
- [Demo](#🎮-demo)
- [Tecnologías](#💻-tecnologías)
- [Instalación](#🔧-instalación)
- [Configuración](#⚙️-configuración)
- [Uso](#🏃‍♂️-uso)
- [Estructura](#📂-estructura-del-proyecto)


## 🌟 Características
- **Funcionalidad 1**: Gestionar tickets para acceder al comedor para empleados regulares
- **Funcionalidad 2**: Gestionar tickets para invitdos (PENDIENTE POR DESARROLLAR)
- **Funcionalidad 3**: Gestionar tickets para jornadas especiales PENDIENTE POR DESARROLLAR)

## 🖼️ Imágenes
### Pantalla del Menù
![Pantalla_Menu](/frontend/public/TicketLunchMenu.jpg)

### Módulo de Selección de Empleados
![Seleccion_empleados](/frontend/public/TicketLunchSeleccion.jpg)

### Módulo de Resumen y Registro del Pago
![Diagrama de Arquitectura](/frontend/public/TicketLunchResumenPago.jpg)

## 💻 Tecnologías
**Frontend:**
- React.js : Componentes / UI
- Zustand: Estado global
- TailwindCSS: Diseño y estilos

**Backend:**
- Node.js
- Express.js

**Nota**: El backend actualmente solo hace un scrapping a la pagina del BCV para mostrar el valor actual del cambio Bs/USD, luego será reemplazado por el de Laravel

**Herramientas:**
- Git: Como controlador de versiones
- Postman (Opcional para probar los endpoints)


## 🔧 Instalación
1. Clonar repositorio:
```bash
git clone http://10.22.8.58/developers/ticketlunch.git
cd nombre-proyecto
```

2. Instalar dependencias tanto para backend como frontend:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## ⚙️ Configuración
Por el momento el backend no requiere mayor configuracion mas alla de la instalacion de las dependencias hechas en el paso 2 anterior.

## 🏃‍♂️ Uso

```
# Backend
cd backend
npm start

# Frontend
cd ../frontend
npm run dev
```

La aplicación estará disponible en http://localhost:5173 (Vite por defecto lanza las app en este puerto)

## 📂 Estructura del Proyecto
```
/
├── backend/
│   ├── node_modules/           # módulos de Node
│   ├── package-lock.json       # Rutas de la API
│   ├── package.json            # dependencias
│   ├── scrape.js               # Script que se encarga de hacer el Scrapping al BVC
│   └── server.js               # Punto de entrada
│
├── frontend/
│   ├── node_modules/           # módulos de Node
│   ├── public/                 # recursos estáticos
│   └── src/
│   │   ├── api/                # Config de Axios para llamadas de API
│   │   ├── assets/             # Imágenes, fuentes
│   │   ├── auth/               # Módulo para autenticación
│   │   ├── components/         # Componentes UI
│   │   ├── data/               # data interna (opcional)
│   │   ├── hooks/              # Hooks de React
│   │   ├── router/             # rutas interna de la aplicacion
│   │   ├── services/           # funciones de llamada a la API
│   │   ├── store/              # Manejo del store de la aplicacion (estado global)
│   │   └──ticketlunch/         # carpeta de la app
│   │      ├── pages/
│   │      ├── router/
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore/
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
└── README.md
```