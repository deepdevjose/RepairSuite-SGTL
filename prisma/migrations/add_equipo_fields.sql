-- Agregar nuevos campos al modelo Equipo
ALTER TABLE equipos ADD color NVARCHAR(100) NULL;
ALTER TABLE equipos ADD fechaIngreso DATETIME2 NOT NULL DEFAULT GETDATE();
ALTER TABLE equipos ADD estadoFisico TEXT NULL;
ALTER TABLE equipos ADD accesoriosRecibidos TEXT NULL;
ALTER TABLE equipos ADD enciende NVARCHAR(50) NULL;
ALTER TABLE equipos ADD tieneContrasena BIT NOT NULL DEFAULT 0;
ALTER TABLE equipos ADD contrasena NVARCHAR(500) NULL;

PRINT 'Migración completada: Campos agregados a tabla equipos';
