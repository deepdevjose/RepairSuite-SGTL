-- =====================================================
-- SCRIPT DE CONFIGURACIÓN INICIAL
-- RepairSuite - SQL Server 2022
-- =====================================================

-- Paso 1: Crear la base de datos
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'RepairSuite')
BEGIN
    CREATE DATABASE RepairSuite;
    PRINT '✅ Base de datos RepairSuite creada';
END
ELSE
BEGIN
    PRINT 'ℹ️  La base de datos RepairSuite ya existe';
END
GO

-- Usar la base de datos
USE RepairSuite;
GO

-- Paso 2: Crear usuario de aplicación (RECOMENDADO)
IF NOT EXISTS (SELECT name FROM sys.server_principals WHERE name = 'repairsuit_user')
BEGIN
    CREATE LOGIN repairsuit_user WITH PASSWORD = 'RepairSuite2024!';
    PRINT '✅ Login repairsuit_user creado';
END
ELSE
BEGIN
    PRINT 'ℹ️  El login repairsuit_user ya existe';
END
GO

-- Crear usuario en la base de datos
IF NOT EXISTS (SELECT name FROM sys.database_principals WHERE name = 'repairsuit_user')
BEGIN
    CREATE USER repairsuit_user FOR LOGIN repairsuit_user;
    PRINT '✅ Usuario repairsuit_user creado';
END
GO

-- Dar permisos completos (db_owner) al usuario
ALTER ROLE db_owner ADD MEMBER repairsuit_user;
GO
PRINT '✅ Permisos db_owner otorgados a repairsuit_user';

-- Paso 3: Configurar opciones de base de datos para mejor rendimiento
ALTER DATABASE RepairSuite SET RECOVERY SIMPLE;
ALTER DATABASE RepairSuite SET AUTO_CREATE_STATISTICS ON;
ALTER DATABASE RepairSuite SET AUTO_UPDATE_STATISTICS ON;
GO
PRINT '✅ Opciones de base de datos configuradas';

-- Paso 4: Crear usuario de solo lectura para réplica (OPCIONAL)
IF NOT EXISTS (SELECT name FROM sys.server_principals WHERE name = 'repairsuit_reader')
BEGIN
    CREATE LOGIN repairsuit_reader WITH PASSWORD = 'RepairSuiteReader2024!';
    PRINT '✅ Login repairsuit_reader creado (solo lectura)';
END
GO

IF NOT EXISTS (SELECT name FROM sys.database_principals WHERE name = 'repairsuit_reader')
BEGIN
    CREATE USER repairsuit_reader FOR LOGIN repairsuit_reader;
    ALTER ROLE db_datareader ADD MEMBER repairsuit_reader;
    PRINT '✅ Usuario repairsuit_reader creado con permisos de solo lectura';
END
GO

-- =====================================================
-- RESUMEN DE CONFIGURACIÓN
-- =====================================================
PRINT '';
PRINT '🎉 ¡Configuración completada!';
PRINT '================================';
PRINT '';
PRINT '📋 Información de conexión:';
PRINT '   Servidor: ' + @@SERVERNAME;
PRINT '   Base de datos: RepairSuite';
PRINT '';
PRINT '👤 Credenciales de aplicación (Lectura/Escritura):';
PRINT '   Usuario: repairsuit_user';
PRINT '   Password: RepairSuite2024!';
PRINT '';
PRINT '👤 Credenciales de réplica (Solo Lectura):';
PRINT '   Usuario: repairsuit_reader';
PRINT '   Password: RepairSuiteReader2024!';
PRINT '';
PRINT '📝 String de conexión para .env:';
PRINT 'DATABASE_URL="sqlserver://' + @@SERVERNAME + ':1433;database=RepairSuite;user=repairsuit_user;password=RepairSuite2024!;encrypt=true;trustServerCertificate=true"';
PRINT '';
PRINT '⚠️  IMPORTANTE:';
PRINT '   1. Cambia las contraseñas en producción';
PRINT '   2. Habilita encrypt=true con certificados válidos en producción';
PRINT '   3. Configura backups automáticos';
PRINT '   4. Considera configurar SQL Server Always On para alta disponibilidad';
PRINT '';
PRINT '▶️  Próximo paso: Ejecuta setup-database.ps1 en PowerShell';
