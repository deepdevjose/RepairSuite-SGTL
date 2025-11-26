-- Migración: Agregar tabla de Notificaciones
-- Fecha: 2025-11-25
-- Descripción: Crea la tabla notificaciones y agrega la relación con usuarios

-- Crear tabla de notificaciones
CREATE TABLE notificaciones (
    id NVARCHAR(1000) NOT NULL,
    usuarioId NVARCHAR(1000),
    titulo NVARCHAR(255) NOT NULL,
    descripcion NVARCHAR(MAX) NOT NULL,
    tipo NVARCHAR(50) NOT NULL,
    ordenId NVARCHAR(1000),
    leida BIT NOT NULL DEFAULT 0,
    createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT PK_notificaciones PRIMARY KEY (id),
    CONSTRAINT FK_notificaciones_usuarios FOREIGN KEY (usuarioId) 
        REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Crear índices
CREATE INDEX IX_notificaciones_usuarioId_leida_createdAt 
    ON notificaciones(usuarioId, leida, createdAt);

CREATE INDEX IX_notificaciones_tipo_createdAt 
    ON notificaciones(tipo, createdAt);

GO

-- Insertar notificaciones de ejemplo (opcional - puedes comentar si no quieres datos de prueba)
DECLARE @adminId NVARCHAR(36);
SELECT TOP 1 @adminId = id FROM usuarios WHERE rol = 'Administrador';

IF @adminId IS NOT NULL
BEGIN
    -- Notificación de inventario bajo
    INSERT INTO notificaciones (id, usuarioId, titulo, descripcion, tipo, leida, createdAt, updatedAt)
    VALUES (
        LOWER(NEWID()),
        @adminId,
        'Inventario bajo',
        'Varios productos están por debajo del stock mínimo. Revisa el inventario.',
        'inventario',
        0,
        DATEADD(MINUTE, -45, GETDATE()),
        DATEADD(MINUTE, -45, GETDATE())
    );

    -- Notificación global (para todos los usuarios)
    INSERT INTO notificaciones (id, usuarioId, titulo, descripcion, tipo, leida, createdAt, updatedAt)
    VALUES (
        LOWER(NEWID()),
        NULL,
        'Mantenimiento programado',
        'El sistema estará en mantenimiento el próximo domingo de 2:00 AM a 4:00 AM.',
        'sistema',
        0,
        DATEADD(HOUR, -2, GETDATE()),
        DATEADD(HOUR, -2, GETDATE())
    );
END

PRINT 'Tabla notificaciones creada exitosamente';
