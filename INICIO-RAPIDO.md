# 🚀 Guía Rápida - Conectar SQL Server 2022

## ⚡ Pasos Rápidos (5 minutos)

### 1. Crear la Base de Datos

Abre **SQL Server Management Studio** y ejecuta:

```sql
CREATE DATABASE RepairSuiteDB;
GO
```

### 2. Configurar la Conexión

Copia el archivo de ejemplo:

```powershell
Copy-Item .env.example .env
```

Edita `.env` y actualiza la línea de `DATABASE_URL` con tus datos:

```env
# Si usas el usuario SA
DATABASE_URL="sqlserver://localhost:1433;database=RepairSuiteDB;user=sa;password=TuPassword;encrypt=true;trustServerCertificate=true"

# O si usas autenticación de Windows
DATABASE_URL="sqlserver://localhost:1433;database=RepairSuiteDB;integratedSecurity=true;encrypt=true;trustServerCertificate=true"
```

### 3. Crear las Tablas

```powershell
# Generar el cliente de Prisma
npx prisma generate

# Crear todas las tablas (usar db push en lugar de migrate para SQL Server)
npx prisma db push
```

### 4. Crear los Usuarios Iniciales

```powershell
# Poblar la base de datos con usuarios y datos iniciales
npx prisma db seed
```

Esto creará:
- **Jose** (Administrador) - `jose@jlaboratories.com` / `password123`
- **Kevis** (Técnico) - `kevis@jlaboratories.com` / `password123`
- **Adriana** (Recepción) - `adriana@jlaboratories.com` / `password123`

### 5. Iniciar la Aplicación

```powershell
pnpm dev
```

¡Listo! Abre http://localhost:3000 e inicia sesión.

---

## 🔧 Si Algo Sale Mal

### Error: "Login failed"
- Verifica tu usuario y contraseña en `.env`
- Asegúrate que SQL Server esté corriendo

### Error: "Cannot connect"
- Verifica que el puerto 1433 esté abierto
- Habilita TCP/IP en SQL Server Configuration Manager

### Error: "Database does not exist"
- Ejecuta el script SQL del paso 1 primero

### Ver los Datos
```powershell
npx prisma studio
```

---

## 📁 Archivos Importantes

- **`.env`** - Tu configuración de conexión
- **`prisma/schema.prisma`** - Estructura de la base de datos
- **`prisma/seed.ts`** - Datos iniciales
- **`CONFIGURACION-BASE-DATOS.md`** - Documentación completa

---

## 💡 Comandos Útiles

```powershell
# Ver estructura de la BD
npx prisma studio

# Regenerar el cliente después de cambios en schema
npx prisma generate

# Aplicar cambios en el schema
npx prisma migrate dev

# Reiniciar la BD (borra todo)
npx prisma migrate reset

# Ver el estado de las migraciones
npx prisma migrate status
```
