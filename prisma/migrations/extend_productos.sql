-- Extender tabla productos con campos adicionales de inventario
-- Fecha: 2025-01-30

-- Agregar columnas nuevas para información del producto
ALTER TABLE productos
ADD marca NVARCHAR(200),
    modelo NVARCHAR(200),
    compatibilidad NVARCHAR(MAX),
    especificaciones NVARCHAR(MAX),
    ubicacion NVARCHAR(100),
    stockReservado INT NOT NULL DEFAULT 0;

GO

-- Crear índices adicionales para mejorar consultas
CREATE INDEX IX_productos_marca ON productos(marca) WHERE marca IS NOT NULL;
CREATE INDEX IX_productos_ubicacion ON productos(ubicacion) WHERE ubicacion IS NOT NULL;
CREATE INDEX IX_productos_stockReservado ON productos(stockReservado);

GO

-- Verificar estructura actualizada
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'productos'
ORDER BY ORDINAL_POSITION;

GO

-- Verificar datos existentes
SELECT COUNT(*) AS TotalProductos FROM productos;
SELECT 
    categoria,
    COUNT(*) AS Cantidad,
    SUM(stockActual) AS StockTotal,
    SUM(stockReservado) AS StockReservadoTotal
FROM productos
GROUP BY categoria;

GO
