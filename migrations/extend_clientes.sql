-- Migración: Extender tabla clientes con campos completos
-- Fecha: 2025-11-25
-- Descripción: Agrega campos detallados de nombre, dirección y datos adicionales

-- Verificar si las columnas ya existen antes de agregar
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'clientes' AND COLUMN_NAME = 'nombre1')
BEGIN
    -- Agregar columnas de nombre dividido
    ALTER TABLE clientes ADD nombre1 NVARCHAR(255);
    ALTER TABLE clientes ADD nombre2 NVARCHAR(255);
    ALTER TABLE clientes ADD apellidoPaterno NVARCHAR(255);
    ALTER TABLE clientes ADD apellidoMaterno NVARCHAR(255);
    
    -- Agregar columnas de dirección detallada
    ALTER TABLE clientes ADD calle NVARCHAR(255);
    ALTER TABLE clientes ADD numero NVARCHAR(50);
    ALTER TABLE clientes ADD colonia NVARCHAR(255);
    ALTER TABLE clientes ADD municipio NVARCHAR(255);
    ALTER TABLE clientes ADD estado NVARCHAR(255);
    ALTER TABLE clientes ADD pais NVARCHAR(100) DEFAULT 'México';
    
    -- Agregar datos adicionales
    ALTER TABLE clientes ADD sexo NVARCHAR(10);
    ALTER TABLE clientes ADD edad INT;
    ALTER TABLE clientes ADD rfc NVARCHAR(20);
    ALTER TABLE clientes ADD tipoCliente NVARCHAR(50);
    
    PRINT 'Columnas agregadas, procediendo con migración de datos...';
    
    -- Migrar datos existentes de 'nombre' a 'nombre1' y 'apellidoPaterno'
    -- Asumiendo que 'nombre' contiene "Nombre Apellido"
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
    
    -- Hacer NOT NULL los campos requeridos después de migración
    UPDATE clientes SET nombre1 = 'Cliente' WHERE nombre1 IS NULL OR nombre1 = '';
    UPDATE clientes SET apellidoPaterno = 'Sin Apellido' WHERE apellidoPaterno IS NULL OR apellidoPaterno = '';
    UPDATE clientes SET pais = 'México' WHERE pais IS NULL OR pais = '';
    
    ALTER TABLE clientes ALTER COLUMN nombre1 NVARCHAR(255) NOT NULL;
    ALTER TABLE clientes ALTER COLUMN apellidoPaterno NVARCHAR(255) NOT NULL;
    ALTER TABLE clientes ALTER COLUMN pais NVARCHAR(100) NOT NULL;
    
    -- Eliminar columna antigua 'nombre' y 'direccion'
    -- Comentado por seguridad - descomentar cuando estés seguro de la migración
    -- ALTER TABLE clientes DROP COLUMN nombre;
    -- ALTER TABLE clientes DROP COLUMN direccion;
    
    -- Crear índices adicionales
    CREATE INDEX IX_clientes_nombre_completo ON clientes(nombre1, apellidoPaterno);
    CREATE INDEX IX_clientes_email ON clientes(email) WHERE email IS NOT NULL;
    
    PRINT 'Migración de clientes completada exitosamente';
END
ELSE
BEGIN
    PRINT 'Las columnas ya existen, migración omitida';
END

GO

-- Verificar estructura final
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'clientes'
ORDER BY ORDINAL_POSITION;
