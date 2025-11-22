# 🔧 RepairSuite-SGTL

**Sistema de Gestión para Talleres de Reparación de Equipos Electrónicos**

RepairSuite-SGTL  

Desarrollada específicamente para JLaboratories, esta plataforma proporciona herramientas intuitivas para administrar órdenes de servicio, clientes, inventario, personal, ventas y más.

---

## ✨ Características Principales

### 📊 Dashboard Interactivo
- **KPIs en tiempo real**: Visualización de métricas operativas y financieras
- **Gráficos dinámicos**: Análisis de órdenes por estado y tipo de servicio
- **Acciones rápidas**: Creación rápida de órdenes, pagos, clientes y ventas
- **Alertas inteligentes**: Notificaciones de órdenes retrasadas, cotizaciones pendientes y equipos listos
- **Top técnicos**: Ranking de rendimiento del personal técnico

### 🛠️ Gestión de Órdenes de Servicio
- Creación y seguimiento completo de órdenes de servicio
- Estados personalizables (diagnóstico, proceso, espera, listo, completado)
- Asignación de técnicos y sucursales
- Historial detallado de reparaciones
- Gestión de tiempos y costos

### 👥 Gestión de Clientes
- Registro completo de información de clientes
- Historial de equipos y servicios
- Gestión de garantías
- Visualización de detalles y equipos asociados

### 📦 Gestión de Inventario
- Control de stock de refacciones y componentes
- Movimientos de entrada, salida y traspaso
- Alertas de inventario crítico
- Catálogo de productos

### 💰 Gestión de Ventas
- Registro de ventas de productos
- Control de pagos y estados
- Cálculo de utilidades
- Historial de transacciones

### 👨‍🔧 Gestión de Personal
- Registro de técnicos y personal
- Seguimiento de órdenes completadas
- Métricas de rendimiento
- Calificaciones y evaluaciones

### 🏢 Gestión de Proveedores
- Directorio de proveedores
- Información fiscal y comercial
- Historial de compras

### ⚙️ Configuración
- Gestión de sucursales
- Configuración de parámetros del sistema
- Personalización de estados y categorías

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **[Next.js 16](https://nextjs.org/)** - Framework React con App Router
- **[React 18](https://react.dev/)** - Biblioteca de UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework de estilos utility-first

### UI Components
- **[Radix UI](https://www.radix-ui.com/)** - Componentes accesibles y sin estilos
- **[Lucide React](https://lucide.dev/)** - Iconos modernos
- **[Recharts](https://recharts.org/)** - Gráficos y visualizaciones
- **[Sonner](https://sonner.emilkowal.ski/)** - Notificaciones toast

### Formularios y Validación
- **[React Hook Form](https://react-hook-form.com/)** - Gestión de formularios
- **[Zod](https://zod.dev/)** - Validación de esquemas
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Integración de validadores

### Utilidades
- **[date-fns](https://date-fns.org/)** - Manipulación de fechas
- **[clsx](https://github.com/lukeed/clsx)** - Utilidad para clases CSS
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge de clases Tailwind
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Gestión de temas

---

## 📋 Requisitos Previos

- **Node.js** 18.x o superior
- **npm** o **pnpm** (recomendado)

---

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/deepdevjose/RepairSuite-SGTL.git
   cd RepairSuite-SGTL
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o con pnpm
   pnpm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   # o con pnpm
   pnpm dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

---

## 📁 Estructura del Proyecto

```
RepairSuite-SGTL/
├── app/                          # App Router de Next.js
│   ├── dashboard/                # Páginas del dashboard
│   │   ├── page.tsx             # Dashboard principal
│   │   ├── clientes/            # Gestión de clientes
│   │   ├── ordenes/             # Órdenes de servicio
│   │   ├── inventario/          # Control de inventario
│   │   ├── ventas/              # Gestión de ventas
│   │   ├── personal/            # Gestión de personal
│   │   ├── proveedores/         # Gestión de proveedores
│   │   ├── equipos/             # Catálogo de equipos
│   │   ├── garantias/           # Gestión de garantías
│   │   ├── catalogo/            # Catálogo de productos
│   │   └── configuracion/       # Configuración del sistema
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página de inicio
│   └── globals.css              # Estilos globales
├── components/                   # Componentes reutilizables
│   ├── ui/                      # Componentes base de UI
│   ├── dashboard/               # Componentes del dashboard
│   ├── clients/                 # Componentes de clientes
│   ├── ordenes/                 # Componentes de órdenes
│   └── ...                      # Otros componentes
├── lib/                         # Utilidades y configuración
│   ├── types/                   # Definiciones de TypeScript
│   ├── data/                    # Datos mock
│   └── utils.ts                 # Funciones utilitarias
├── public/                      # Archivos estáticos
├── styles/                      # Estilos adicionales
├── package.json                 # Dependencias del proyecto
├── tsconfig.json               # Configuración de TypeScript
├── tailwind.config.ts          # Configuración de Tailwind
└── next.config.mjs             # Configuración de Next.js
```

---

## 🎯 Uso

### Dashboard Principal
Accede al dashboard en `/dashboard` para ver:
- Resumen de órdenes activas y estados
- KPIs financieros (ingresos, ticket promedio, conversión)
- Gráficos de órdenes por estado
- Top técnicos del mes
- Actividad reciente
- Acciones rápidas para crear órdenes, registrar pagos, etc.

### Módulos Principales

#### Órdenes de Servicio (`/dashboard/ordenes`)
- Visualiza todas las órdenes de servicio
- Filtra por estado, técnico o sucursal
- Crea nuevas órdenes de servicio
- Ver detalles completos de cada orden

#### Clientes (`/dashboard/clientes`)
- Directorio completo de clientes
- Ver detalles y equipos de cada cliente
- Historial de servicios
- Gestión de garantías

#### Inventario (`/dashboard/inventario`)
- Control de stock de refacciones
- Registrar entradas, salidas y traspasos
- Alertas de inventario bajo

#### Ventas (`/dashboard/ventas`)
- Registro de ventas de productos
- Control de pagos
- Análisis de utilidades

#### Personal (`/dashboard/personal`)
- Gestión de técnicos y empleados
- Métricas de rendimiento
- Asignación de órdenes

---

## 🎨 Características de Diseño

- **Diseño moderno y premium**: Interfaz con gradientes, glassmorphism y animaciones suaves
- **Modo oscuro**: Tema oscuro optimizado para reducir fatiga visual
- **Responsive**: Totalmente adaptable a dispositivos móviles y tablets
- **Animaciones fluidas**: Transiciones y micro-animaciones para mejor UX
- **Accesibilidad**: Componentes accesibles con soporte para teclado y lectores de pantalla

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia servidor de producción

# Linting
npm run lint         # Ejecuta ESLint
```

---

## 📝 Notas de Desarrollo

- **Datos Mock**: Actualmente la aplicación utiliza datos de prueba (mock data) ubicados en `lib/data/`
- **Próximos pasos**: Integración con backend y base de datos
- **Componentes**: Todos los componentes de UI están construidos con Radix UI para máxima accesibilidad

---

## 🤝 Contribución

Este proyecto está en desarrollo activo. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y está desarrollado para uso exclusivo de JLaboratories.

---

## 👨‍💻 Desarrollado por

**JLaboratories** - Sistema de Gestión de Taller

---

## 📞 Soporte

Para soporte o preguntas sobre el sistema, contacta al equipo de desarrollo.

---

**¡Gracias por usar RepairSuite-SGTL!** 🚀
