# 🗄️ Configuración de Base de Datos SQL Server

## Pasos para configurar la base de datos

### 1️⃣ Instalar dependencias

```bash
pnpm install
# o
npm install
```

### 2️⃣ Configurar SQL Server

#### En SSMS (SQL Server Management Studio):

1. Abre SSMS y conéctate a tu servidor
2. Crea una nueva base de datos:

```sql
CREATE DATABASE RepairSuite;
GO

USE RepairSuite;
GO
```

3. Crea un usuario para la aplicación (recomendado):

```sql
-- Crear login
CREATE LOGIN repairsuit_user WITH PASSWORD = 'TuPasswordSegura123!';
GO

-- Crear usuario en la BD
USE RepairSuite;
CREATE USER repairsuit_user FOR LOGIN repairsuit_user;
GO

-- Dar permisos
ALTER ROLE db_owner ADD MEMBER repairsuit_user;
GO
```

### 3️⃣ Configurar archivo .env

Copia `.env.example` a `.env` y configura tu conexión:

```bash
copy .env.example .env
```

Edita el archivo `.env` con tus datos:

```env
DATABASE_URL="sqlserver://localhost:1433;database=RepairSuite;user=repairsuit_user;password=TuPasswordSegura123!;encrypt=true;trustServerCertificate=true"
```

**Formato de conexión:**
```
sqlserver://SERVIDOR:PUERTO;database=NOMBRE_BD;user=USUARIO;password=PASSWORD;encrypt=true;trustServerCertificate=true
```

### 4️⃣ Generar cliente de Prisma y crear tablas

```bash
# Generar el cliente de Prisma
pnpm db:generate

# Aplicar el schema a la base de datos
pnpm db:push
```

### 5️⃣ Poblar la base de datos (opcional pero recomendado)

```bash
pnpm db:seed
```

Esto creará:
- ✅ 3 usuarios de prueba (Admin, Técnico, Recepción)
- ✅ 3 clientes de ejemplo
- ✅ Equipos de prueba
- ✅ Productos e inventario inicial
- ✅ Configuración inicial del sistema

**Credenciales de prueba:**
- **Admin**: `jose@jlaboratories.com` / `password123`
- **Técnico**: `kevis@jlaboratories.com` / `password123`
- **Recepción**: `adriana@jlaboratories.com` / `password123`

### 6️⃣ Iniciar la aplicación

```bash
pnpm dev
```

## 🔄 Configurar Replicación (Opcional pero recomendado)

### Para configurar una réplica de solo lectura:

#### 1. En SQL Server Management Studio:

1. Configura SQL Server Replication (Transactional o Always On)
2. Configura el servidor secundario como réplica de lectura

#### 2. En tu `.env`:

```env
# Servidor principal (lectura/escritura)
DATABASE_URL="sqlserver://SERVER1:1433;database=RepairSuite;user=repairsuit_user;password=PASSWORD;encrypt=true;trustServerCertificate=true"

# Servidor réplica (solo lectura - para reportes y dashboards)
DATABASE_REPLICA_URL="sqlserver://SERVER2:1433;database=RepairSuite;user=repairsuit_reader;password=PASSWORD;encrypt=true;trustServerCertificate=true"
```

#### 3. Uso en el código:

```typescript
import { prisma, prismaRead } from '@/lib/prisma'

// Para escritura (usa servidor principal)
await prisma.ordenServicio.create({ ... })

// Para lectura (usa réplica si está configurada, sino usa principal)
const ordenes = await prismaRead.ordenServicio.findMany({ ... })
```

## 📊 Comandos útiles de Prisma

```bash
# Ver la base de datos en Prisma Studio (interfaz web)
pnpm db:studio

# Generar cliente después de cambios en schema.prisma
pnpm db:generate

# Aplicar cambios del schema a la BD
pnpm db:push

# Crear migración (producción)
pnpm db:migrate

# Ver logs de SQL
# Está configurado automáticamente en desarrollo
```

## 🔐 Seguridad en Producción

Para producción, asegúrate de:

1. ✅ Usar certificados SSL válidos (`encrypt=true; trustServerCertificate=false`)
2. ✅ Crear usuarios con permisos mínimos necesarios
3. ✅ Usar contraseñas fuertes
4. ✅ Habilitar firewall en SQL Server
5. ✅ Configurar backup automático
6. ✅ Usar variables de entorno seguras (nunca commits `.env`)

## ⚡ Optimizaciones incluidas

- ✅ **Connection pooling** automático
- ✅ **Índices** en todas las columnas de búsqueda frecuente
- ✅ **Soporte para réplica** de lectura
- ✅ **Tipos TypeScript** generados automáticamente
- ✅ **Soft deletes** en relaciones importantes
- ✅ **Timestamps** automáticos (createdAt, updatedAt)

## 🐛 Troubleshooting

### Error: "Login failed for user"
- Verifica usuario y contraseña en el `.env`
- Asegúrate que el usuario tenga permisos en la base de datos

### Error: "Cannot connect to server"
- Verifica que SQL Server esté corriendo
- Verifica que el puerto 1433 esté abierto
- Verifica el nombre del servidor (puede ser `localhost` o `.\SQLEXPRESS`)

### Error: "SSL/Certificate"
- En desarrollo, usa `trustServerCertificate=true`
- En producción, configura certificados válidos

### Error al hacer push/migrate
- Asegúrate de tener permisos db_owner
- Verifica que la base de datos exista
- Revisa los logs de SQL Server

## 📚 Recursos adicionales

- [Documentación de Prisma](https://www.prisma.io/docs)
- [SQL Server con Prisma](https://www.prisma.io/docs/concepts/database-connectors/sql-server)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
