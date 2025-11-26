# 🎯 GUÍA RÁPIDA - Configuración SQL Server

## ⚡ Pasos Super Sencillos

### 1️⃣ En SQL Server Management Studio (SSMS)

Abre SSMS y ejecuta el archivo `setup-sqlserver.sql`:

```
Archivo → Abrir → setup-sqlserver.sql → F5 (Ejecutar)
```

Esto creará:
- ✅ Base de datos `RepairSuite`
- ✅ Usuario `repairsuit_user` (lectura/escritura)
- ✅ Usuario `repairsuit_reader` (solo lectura para réplica)
- ✅ Permisos configurados

### 2️⃣ En PowerShell (como Administrador)

```powershell
cd C:\Users\Josee\Downloads\ghrepos\RepairSuite-SGTL
.\setup-database.ps1
```

El script te guiará paso a paso para:
- ✅ Instalar dependencias npm
- ✅ Configurar .env
- ✅ Crear tablas automáticamente
- ✅ Poblar datos de prueba

### 3️⃣ Iniciar la aplicación

```powershell
pnpm dev
```

Abre: http://localhost:3000

---

## 🔐 Credenciales Creadas

**Base de datos:**
- Usuario: `repairsuit_user`
- Password: `RepairSuite2024!`

**Aplicación (después del seed):**
- Admin: `jose@jlaboratories.com` / `password123`
- Técnico: `kevis@jlaboratories.com` / `password123`
- Recepción: `adriana@jlaboratories.com` / `password123`

---

## 📁 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `setup-sqlserver.sql` | Script SQL para crear BD y usuarios |
| `setup-database.ps1` | Script PowerShell para configuración completa |
| `.env.example` | Plantilla de configuración |
| `DATABASE_SETUP.md` | Documentación completa |
| `prisma/schema.prisma` | Esquema de base de datos |

---

## 🔄 Para Configurar Réplica (Opcional)

### Opción 1: SQL Server Always On (Recomendado)

1. Configura Always On Availability Groups en SSMS
2. Agrega `RepairSuite` al grupo de disponibilidad
3. Configura réplica secundaria como solo lectura
4. En `.env` agrega:
   ```
   DATABASE_REPLICA_URL="sqlserver://SERVIDOR_REPLICA:1433;database=RepairSuite;user=repairsuit_reader;password=RepairSuiteReader2024!;encrypt=true;trustServerCertificate=true"
   ```

### Opción 2: Log Shipping (Más simple)

1. Configura Log Shipping desde SSMS
2. Restaura los logs en servidor secundario con STANDBY
3. Usa la misma configuración de `.env` que arriba

### Opción 3: Replicación Transaccional

1. Configura Transactional Replication en SSMS
2. Suscribe el servidor secundario
3. Usa la misma configuración de `.env`

---

## 🎨 Estructura de Tablas Creadas

```
📊 RepairSuite Database
├── 👤 usuarios (Admin, Técnicos, Recepción)
├── 🧑 clientes
├── 💻 equipos
├── 📋 ordenes_servicio
│   ├── materiales_orden
│   └── garantias
├── 📦 productos (inventario)
│   └── movimientos_inventario
├── 🏢 proveedores
└── 💰 ventas
    └── items_venta
```

---

## 🚀 Comandos Útiles

```powershell
# Ver base de datos en navegador
pnpm db:studio

# Regenerar cliente de Prisma
pnpm db:generate

# Aplicar cambios del schema
pnpm db:push

# Poblar datos de nuevo
pnpm db:seed

# Iniciar desarrollo
pnpm dev
```

---

## ❓ Problemas Comunes

### ❌ "Cannot connect to database"
- ✅ Verifica que SQL Server esté corriendo
- ✅ Verifica puerto 1433 abierto
- ✅ Verifica credenciales en `.env`

### ❌ "Login failed for user"
- ✅ Ejecuta `setup-sqlserver.sql` de nuevo
- ✅ Verifica que el usuario tenga permisos

### ❌ Error al ejecutar PowerShell script
- ✅ Abre PowerShell como Administrador
- ✅ Ejecuta: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

---

## 📞 Necesitas ayuda?

Lee la documentación completa: `DATABASE_SETUP.md`
