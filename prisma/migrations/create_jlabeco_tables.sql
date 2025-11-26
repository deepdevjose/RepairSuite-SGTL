-- Crear tablas para el módulo JLabEco (Huella de Carbono)
-- Fecha: 2025-11-25

-- Tabla de dispositivos tecnológicos
CREATE TABLE dispositivos_tecnologicos (
    id NVARCHAR(1000) PRIMARY KEY,
    tipo NVARCHAR(1000) NOT NULL,
    marca NVARCHAR(1000) NOT NULL,
    modelo NVARCHAR(1000) NOT NULL,
    serie NVARCHAR(1000),
    
    -- Consumo energético
    consumoWatts DECIMAL(10, 2) NOT NULL,
    horasUsoMensual DECIMAL(10, 2) NOT NULL DEFAULT 720,
    consumoKwhMensual DECIMAL(10, 2) NOT NULL,
    
    -- Huella operativa
    factorEmisionKwhCO2e DECIMAL(10, 6) NOT NULL DEFAULT 0.527,
    huellaOperativaMensual DECIMAL(10, 2) NOT NULL,
    
    -- Huella de materiales
    huellaMaterialesKgCO2e DECIMAL(10, 2) NOT NULL,
    vidaUtilAnios INT NOT NULL DEFAULT 5,
    huellaMaterialesMensual DECIMAL(10, 2) NOT NULL,
    
    -- Huella total
    huellaTotalMensual DECIMAL(10, 2) NOT NULL,
    
    -- Datos adicionales
    ubicacion NVARCHAR(1000),
    responsable NVARCHAR(1000),
    fechaAdquisicion DATETIME2,
    fechaBaja DATETIME2,
    
    activo BIT NOT NULL DEFAULT 1,
    notas NVARCHAR(MAX),
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NOT NULL,
    usuarioId NVARCHAR(1000) NOT NULL,
    
    CONSTRAINT FK_dispositivos_tecnologicos_usuario 
        FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
);

GO

-- Índices para dispositivos tecnológicos
CREATE INDEX IX_dispositivos_tecnologicos_tipo_activo ON dispositivos_tecnologicos(tipo, activo);
CREATE INDEX IX_dispositivos_tecnologicos_fechaAdquisicion ON dispositivos_tecnologicos(fechaAdquisicion);
CREATE INDEX IX_dispositivos_tecnologicos_activo_createdAt ON dispositivos_tecnologicos(activo, createdAt);

GO

-- Tabla de historial de huella de carbono (agregados mensuales)
CREATE TABLE historial_huella (
    id NVARCHAR(1000) PRIMARY KEY,
    periodo DATETIME2 NOT NULL,
    
    -- KPIs agregados
    totalConsumoKwh DECIMAL(12, 2) NOT NULL,
    totalHuellaOperativa DECIMAL(12, 2) NOT NULL,
    totalHuellaMateriales DECIMAL(12, 2) NOT NULL,
    totalHuella DECIMAL(12, 2) NOT NULL,
    
    dispositivosActivos INT NOT NULL,
    
    -- Datos calculados
    promedioConsumoDispositivo DECIMAL(10, 2) NOT NULL,
    costoElectrico DECIMAL(10, 2),
    tarifaKwh DECIMAL(10, 4),
    
    notas NVARCHAR(MAX),
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    usuarioId NVARCHAR(1000) NOT NULL,
    
    CONSTRAINT FK_historial_huella_usuario 
        FOREIGN KEY (usuarioId) REFERENCES usuarios(id),
    CONSTRAINT UQ_historial_huella_periodo 
        UNIQUE (periodo)
);

GO

-- Índice para historial
CREATE INDEX IX_historial_huella_periodo ON historial_huella(periodo);

GO

-- Verificar estructura de tablas
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME IN ('dispositivos_tecnologicos', 'historial_huella')
ORDER BY TABLE_NAME, ORDINAL_POSITION;

GO

-- Insertar datos de ejemplo para demostración
DECLARE @adminUserId NVARCHAR(1000);
SELECT TOP 1 @adminUserId = id FROM usuarios WHERE rol = 'Administrador';

IF @adminUserId IS NOT NULL
BEGIN
    -- Router Cisco
    INSERT INTO dispositivos_tecnologicos (
        id, tipo, marca, modelo, serie,
        consumoWatts, horasUsoMensual, consumoKwhMensual,
        factorEmisionKwhCO2e, huellaOperativaMensual,
        huellaMaterialesKgCO2e, vidaUtilAnios, huellaMaterialesMensual,
        huellaTotalMensual,
        ubicacion, responsable, fechaAdquisicion,
        activo, updatedAt, usuarioId
    ) VALUES (
        NEWID(), 'Router', 'Cisco', 'RV340', 'SN123456',
        25, 720, 18.00, -- 25W * 720h / 1000 = 18 kWh
        0.527, 9.49, -- 18 * 0.527 = 9.49 kg CO2e
        45.5, 5, 0.76, -- 45.5 / 60 meses = 0.76 kg CO2e/mes
        10.25, -- 9.49 + 0.76
        'Sala de Servidores', 'IT Manager', GETDATE(),
        1, GETDATE(), @adminUserId
    );

    -- Switch HP
    INSERT INTO dispositivos_tecnologicos (
        id, tipo, marca, modelo, serie,
        consumoWatts, horasUsoMensual, consumoKwhMensual,
        factorEmisionKwhCO2e, huellaOperativaMensual,
        huellaMaterialesKgCO2e, vidaUtilAnios, huellaMaterialesMensual,
        huellaTotalMensual,
        ubicacion, responsable, fechaAdquisicion,
        activo, updatedAt, usuarioId
    ) VALUES (
        NEWID(), 'Switch', 'HP', 'ProCurve 2910', 'SN789012',
        30, 720, 21.60,
        0.527, 11.38,
        52.0, 7, 0.62,
        12.00,
        'Sala de Servidores', 'IT Manager', DATEADD(MONTH, -2, GETDATE()),
        1, GETDATE(), @adminUserId
    );

    -- Servidor Dell
    INSERT INTO dispositivos_tecnologicos (
        id, tipo, marca, modelo, serie,
        consumoWatts, horasUsoMensual, consumoKwhMensual,
        factorEmisionKwhCO2e, huellaOperativaMensual,
        huellaMaterialesKgCO2e, vidaUtilAnios, huellaMaterialesMensual,
        huellaTotalMensual,
        ubicacion, responsable, fechaAdquisicion,
        activo, updatedAt, usuarioId
    ) VALUES (
        NEWID(), 'Servidor', 'Dell', 'PowerEdge R740', 'SN345678',
        350, 720, 252.00,
        0.527, 132.80,
        1250.0, 5, 20.83,
        153.63,
        'Sala de Servidores', 'IT Manager', DATEADD(MONTH, -6, GETDATE()),
        1, GETDATE(), @adminUserId
    );

    PRINT 'Datos de ejemplo insertados correctamente';
END
ELSE
BEGIN
    PRINT 'No se encontró un usuario administrador, no se insertaron datos de ejemplo';
END

GO

-- Mostrar resumen de dispositivos insertados
SELECT 
    tipo,
    marca,
    modelo,
    consumoKwhMensual AS [Consumo kWh/mes],
    huellaOperativaMensual AS [Huella Operativa (kg CO2e)],
    huellaMaterialesMensual AS [Huella Materiales (kg CO2e)],
    huellaTotalMensual AS [Huella Total (kg CO2e)],
    ubicacion
FROM dispositivos_tecnologicos
ORDER BY huellaTotalMensual DESC;

GO
