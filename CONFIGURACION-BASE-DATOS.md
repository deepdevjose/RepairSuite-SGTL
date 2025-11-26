# 🗄️ Configuración de Base de Datos - RepairSuite

## 📋 Requisitos Previos

- **SQL Server 2022** instalado y en ejecución
- **Node.js** 18+ instalado
- **npm** como gestor de paquetes

## 🚀 Pasos de Configuración

### 1️⃣ Crear la Base de Datos

Abre **SQL Server Management Studio (SSMS)** o **Azure Data Studio** y ejecuta:

```sql
-- Opción A: Ejecutar el script completo
-- Ubicación: prisma/migrations/create-database.sql
```

O manualmente:

```sql
USE master;
GO

CREATE DATABASE RepairSuiteDB
COLLATE Latin1_General_CI_AS;
GO

ALTER DATABASE RepairSuiteDB SET RECOVERY SIMPLE;
ALTER DATABASE RepairSuiteDB SET READ_COMMITTED_SNAPSHOT ON;
GO
```

### 2️⃣ Configurar la Conexión

#### Opción A: Con Autenticación SQL Server (Recomendado para desarrollo)

1. Crea un usuario en SQL Server:

```sql
USE master;
GO

CREATE LOGIN repairuser WITH PASSWORD = 'RepairPass123!';
GO

USE RepairSuiteDB;
GO

CREATE USER repairuser FOR LOGIN repairuser;
GO

ALTER ROLE db_owner ADD MEMBER repairuser;
GO
```

2. Copia `.env.example` a `.env`:

```powershell
Copy-Item .env.example .env
```

3. Edita `.env` y configura la conexión:

```env
DATABASE_URL="sqlserver://localhost:1433;database=RepairSuiteDB;user=repairuser;password=RepairPass123!;encrypt=true;trustServerCertificate=true"
```

#### Opción B: Con Autenticación de Windows

En `.env`:

```env
DATABASE_URL="sqlserver://localhost:1433;database=RepairSuiteDB;integratedSecurity=true;encrypt=true;trustServerCertificate=true"
```

#### Opción C: Con usuario SA (Solo para desarrollo local)

En `.env`:

```env
DATABASE_URL="sqlserver://localhost:1433;database=RepairSuiteDB;user=sa;password=TuPasswordSA;encrypt=true;trustServerCertificate=true"
```

### 3️⃣ Generar y Aplicar las Tablas con Prisma

```powershell
# Instalar dependencias si no lo has hecho
pnpm install

# Generar el cliente de Prisma
npx prisma generate

# Crear las tablas en la base de datos
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio para ver tus datos
npx prisma studio
```

### 4️⃣ Crear Usuarios Iniciales

Ejecuta el siguiente script en SSMS para crear los usuarios del sistema:

```sql
USE RepairSuiteDB;
GO

-- Insertar usuario Administrador: Jose
INSERT INTO Usuario (nombre, email, password, rol, activo, fechaCreacion, ultimaActualizacion)
VALUES 
('Jose', 'jose@jlaboratories.com', '$2a$10$XYZ...', 'Administrador', 1, GETDATE(), GETDATE());

-- Insertar usuario Técnico: Kevis
INSERT INTO Usuario (nombre, email, password, rol, activo, fechaCreacion, ultimaActualizacion)
VALUES 
('Kevis', 'kevis@jlaboratories.com', '$2a$10$XYZ...', 'Técnico', 1, GETDATE(), GETDATE());

-- Insertar usuario Recepción: Adriana
INSERT INTO Usuario (nombre, email, password, rol, activo, fechaCreacion, ultimaActualizacion)
VALUES 
('Adriana', 'adriana@jlaboratories.com', '$2a$10$XYZ...', 'Recepción', 1, GETDATE(), GETDATE());
GO
```

**Nota:** Las contraseñas necesitan ser hasheadas con bcrypt. Usa el siguiente código Node.js:

```javascript
const bcrypt = require('bcryptjs');
const password = 'tu_contraseña_aqui';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

### 5️⃣ Verificar la Conexión

```powershell
# Probar la conexión con Prisma
npx prisma db push
```

Si todo está correcto, deberías ver: ✅ **"The database is now in sync with your schema"**

## 🔍 Troubleshooting

### Error: "Login failed for user"

- Verifica que el usuario exista en SQL Server
- Verifica la contraseña en `.env`
- Asegúrate que el usuario tenga permisos en la base de datos

### Error: "Cannot connect to server"

- Verifica que SQL Server esté corriendo
- Verifica el puerto (por defecto 1433)
- Asegúrate que TCP/IP esté habilitado en SQL Server Configuration Manager

### Error: "Database does not exist"

- Ejecuta el script `create-database.sql` primero
- Verifica el nombre de la base de datos en `.env`

## 📊 Estructura de Tablas Creadas

Prisma creará automáticamente las siguientes tablas:

- ✅ Usuario
- ✅ Cliente  
- ✅ Equipo
- ✅ OrdenServicio
- ✅ Diagnostico
- ✅ Reparacion
- ✅ Pago
- ✅ Producto
- ✅ Inventario
- ✅ MovimientoInventario
- ✅ Proveedor
- ✅ OrdenCompra
- ✅ Venta
- ✅ DetalleVenta
- ✅ Garantia
- ✅ EstadoOrden
- ✅ HistorialOrden

## 🎯 Siguiente Paso

Una vez configurada la base de datos, ejecuta:

```powershell
pnpm dev
```

Y accede a: http://localhost:3000

## 📞 Soporte

Si tienes problemas con la configuración, revisa:

- El archivo `prisma/schema.prisma` para la estructura completa
- Los logs de SQL Server en el Event Viewer
- La consola de PowerShell para errores de Prisma
