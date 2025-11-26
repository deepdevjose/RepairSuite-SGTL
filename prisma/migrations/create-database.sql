-- ============================================
-- RepairSuite - JLaboratories
-- Script de Creación de Base de Datos
-- SQL Server 2022
-- ============================================

USE master;
GO

-- Crear la base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'RepairSuiteDB')
BEGIN
    CREATE DATABASE RepairSuiteDB
    COLLATE Latin1_General_CI_AS;
    PRINT 'Base de datos RepairSuiteDB creada exitosamente';
END
ELSE
BEGIN
    PRINT 'La base de datos RepairSuiteDB ya existe';
END
GO

USE RepairSuiteDB;
GO

-- Configurar opciones de la base de datos
ALTER DATABASE RepairSuiteDB SET RECOVERY SIMPLE;
ALTER DATABASE RepairSuiteDB SET READ_COMMITTED_SNAPSHOT ON;
GO

PRINT 'Base de datos configurada y lista para usar con Prisma';
PRINT 'Siguiente paso: Ejecutar "npx prisma migrate dev" para crear las tablas';
GO
