-- Migración: Extender tabla ventas con campos completos
-- Fecha: 2025-11-25
-- Descripción: Agrega campos de pagos, descuentos, relación con órdenes de servicio

-- Paso 1: Agregar nuevas columnas a la tabla ventas
ALTER TABLE ventas ADD ordenServicioId NVARCHAR(1000) NULL;
ALTER TABLE ventas ADD descuento DECIMAL(10, 2) DEFAULT 0 NOT NULL;
ALTER TABLE ventas ADD montoPagado DECIMAL(10, 2) DEFAULT 0 NOT NULL;
ALTER TABLE ventas ADD saldoPendiente DECIMAL(10, 2) NOT NULL;
ALTER TABLE ventas ADD estadoPago NVARCHAR(50) DEFAULT 'Pendiente' NOT NULL;
ALTER TABLE ventas ADD fechaVencimiento DATETIME2 NULL;
ALTER TABLE ventas ADD fechaCompletado DATETIME2 NULL;

PRINT 'Columnas agregadas a ventas';
GO

-- Paso 2: Actualizar datos existentes
UPDATE ventas 
SET 
    saldoPendiente = total - montoPagado,
    estadoPago = CASE 
        WHEN montoPagado >= total THEN 'Pagado'
        WHEN montoPagado > 0 THEN 'Parcial'
        ELSE 'Pendiente'
    END
WHERE saldoPendiente IS NULL OR saldoPendiente = 0;

PRINT 'Datos de ventas actualizados';
GO

-- Paso 3: Agregar columnas a items_venta
ALTER TABLE items_venta ADD costoUnitario DECIMAL(10, 2) DEFAULT 0 NOT NULL;
ALTER TABLE items_venta ADD tipo NVARCHAR(50) DEFAULT 'Producto' NOT NULL;

PRINT 'Columnas agregadas a items_venta';
GO

-- Paso 4: Crear tabla pagos_venta
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'pagos_venta')
BEGIN
    CREATE TABLE pagos_venta (
        id NVARCHAR(1000) PRIMARY KEY DEFAULT NEWID(),
        ventaId NVARCHAR(1000) NOT NULL,
        monto DECIMAL(10, 2) NOT NULL,
        metodoPago NVARCHAR(50) NOT NULL,
        referencia NVARCHAR(255) NULL,
        comprobante NVARCHAR(500) NULL,
        notas TEXT NULL,
        usuarioId NVARCHAR(1000) NOT NULL,
        createdAt DATETIME2 DEFAULT GETDATE() NOT NULL,
        
        CONSTRAINT FK_pagos_venta_venta FOREIGN KEY (ventaId) REFERENCES ventas(id) ON DELETE CASCADE,
        CONSTRAINT FK_pagos_venta_usuario FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
    );

    CREATE INDEX IX_pagos_venta_ventaId ON pagos_venta(ventaId, createdAt);
    CREATE INDEX IX_pagos_venta_metodoPago ON pagos_venta(metodoPago);

    PRINT 'Tabla pagos_venta creada';
END
ELSE
BEGIN
    PRINT 'Tabla pagos_venta ya existe';
END
GO

-- Paso 5: Agregar FK de ordenServicioId (si existe la tabla ordenes_servicio)
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ordenes_servicio')
BEGIN
    ALTER TABLE ventas ADD CONSTRAINT FK_ventas_ordenServicio 
        FOREIGN KEY (ordenServicioId) REFERENCES ordenes_servicio(id);
    
    CREATE INDEX IX_ventas_ordenServicioId ON ventas(ordenServicioId);
    
    PRINT 'FK a ordenes_servicio agregada';
END
GO

-- Paso 6: Crear índices adicionales
CREATE INDEX IX_ventas_estadoPago ON ventas(estadoPago);

PRINT 'Índices adicionales creados';
PRINT 'Migración de ventas completada exitosamente!';
GO

-- Verificar resultado
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME IN ('ventas', 'items_venta', 'pagos_venta')
ORDER BY TABLE_NAME, ORDINAL_POSITION;
