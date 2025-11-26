-- Migración: Extender tabla clientes con campos completos (versión directa)
-- Ejecutar solo si las columnas no existen

-- Paso 1: Agregar todas las columnas nuevas
ALTER TABLE clientes ADD nombre1 NVARCHAR(255) NULL;
ALTER TABLE clientes ADD nombre2 NVARCHAR(255) NULL;
ALTER TABLE clientes ADD apellidoPaterno NVARCHAR(255) NULL;
ALTER TABLE clientes ADD apellidoMaterno NVARCHAR(255) NULL;
ALTER TABLE clientes ADD calle NVARCHAR(255) NULL;
ALTER TABLE clientes ADD numero NVARCHAR(50) NULL;
ALTER TABLE clientes ADD colonia NVARCHAR(255) NULL;
ALTER TABLE clientes ADD municipio NVARCHAR(255) NULL;
ALTER TABLE clientes ADD estado NVARCHAR(255) NULL;
ALTER TABLE clientes ADD pais NVARCHAR(100) NULL;
ALTER TABLE clientes ADD sexo NVARCHAR(10) NULL;
ALTER TABLE clientes ADD edad INT NULL;
ALTER TABLE clientes ADD rfc NVARCHAR(20) NULL;
ALTER TABLE clientes ADD tipoCliente NVARCHAR(50) NULL;

PRINT 'Columnas agregadas exitosamente';
GO

-- Paso 2: Migrar datos existentes
UPDATE clientes 
SET 
    nombre1 = CASE 
        WHEN CHARINDEX(' ', nombre) > 0 
        THEN LEFT(nombre, CHARINDEX(' ', nombre) - 1)
        ELSE nombre
    END,
    apellidoPaterno = CASE 
        WHEN CHARINDEX(' ', nombre) > 0 
        THEN LTRIM(SUBSTRING(nombre, CHARINDEX(' ', nombre) + 1, LEN(nombre)))
        ELSE 'Sin Apellido'
    END,
    pais = 'México'
WHERE nombre IS NOT NULL;

PRINT 'Datos migrados exitosamente';
GO

-- Paso 3: Completar valores nulos con defaults
UPDATE clientes SET nombre1 = 'Cliente' WHERE nombre1 IS NULL OR nombre1 = '';
UPDATE clientes SET apellidoPaterno = 'Sin Apellido' WHERE apellidoPaterno IS NULL OR apellidoPaterno = '';
UPDATE clientes SET pais = 'México' WHERE pais IS NULL OR pais = '';

PRINT 'Valores por defecto aplicados';
GO

-- Paso 4: Hacer NOT NULL los campos requeridos
ALTER TABLE clientes ALTER COLUMN nombre1 NVARCHAR(255) NOT NULL;
ALTER TABLE clientes ALTER COLUMN apellidoPaterno NVARCHAR(255) NOT NULL;
ALTER TABLE clientes ALTER COLUMN pais NVARCHAR(100) NOT NULL;

PRINT 'Restricciones NOT NULL aplicadas';
GO

-- Paso 5: Crear índices
CREATE INDEX IX_clientes_nombre_completo ON clientes(nombre1, apellidoPaterno);
CREATE INDEX IX_clientes_email ON clientes(email) WHERE email IS NOT NULL;

PRINT 'Índices creados exitosamente';
PRINT 'Migración completada!';
GO

-- Verificar resultado
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'clientes'
ORDER BY ORDINAL_POSITION;
