# Sistema de Notificaciones

## Implementación completada

Se ha agregado un sistema completo de notificaciones conectado a la base de datos.

### Cambios realizados:

1. **Modelo de datos** (`prisma/schema.prisma`):
   - Agregado modelo `Notificacion` con los siguientes campos:
     - `id`, `usuarioId`, `titulo`, `descripcion`, `tipo`, `ordenId`, `leida`, `createdAt`, `updatedAt`
   - Relación con modelo `Usuario`
   - Índices optimizados para consultas rápidas

2. **API REST** (`app/api/notificaciones/`):
   - `GET /api/notificaciones?usuarioId={id}&soloNoLeidas=true` - Obtener notificaciones
   - `POST /api/notificaciones` - Crear notificación
   - `PATCH /api/notificaciones/[id]` - Marcar como leída
   - `DELETE /api/notificaciones/[id]` - Eliminar notificación

3. **Componente actualizado** (`components/dashboard-header.tsx`):
   - Ahora obtiene notificaciones reales de la base de datos
   - Se actualiza automáticamente cada 30 segundos
   - Permite marcar notificaciones como leídas con un click
   - Muestra tiempo transcurrido dinámicamente

4. **Helpers** (`lib/utils/notifications.ts`):
   - Funciones helper para crear notificaciones en eventos comunes:
     - `notificarOrdenListaEntrega()`
     - `notificarInventarioBajo()`
     - `notificarOrdenAprobada()`
     - `notificarGarantiasPorVencer()`
     - `notificarOrdenNueva()`
     - `notificarPagoRecibido()`
     - `notificarSistemaGlobal()` - Para todos los usuarios

## Aplicar la migración

Para aplicar los cambios a tu base de datos SQL Server, ejecuta el script:

```powershell
# Opción 1: Usar SQL Server Management Studio (SSMS)
# - Abre el archivo migrations/add_notificaciones.sql
# - Conéctate a tu base de datos
# - Ejecuta el script

# Opción 2: Desde PowerShell con sqlcmd
sqlcmd -S tu_servidor -d RepairSuite -U tu_usuario -P tu_password -i migrations/add_notificaciones.sql
```

## Cómo usar las notificaciones

### Crear notificaciones desde tu código:

```typescript
import { 
  notificarOrdenListaEntrega,
  notificarInventarioBajo,
  notificarSistemaGlobal 
} from "@/lib/utils/notifications"

// Ejemplo 1: Cuando una orden se completa
await notificarOrdenListaEntrega(
  orden.id, 
  orden.folio, 
  "MacBook Pro 13\""
)

// Ejemplo 2: Cuando el stock está bajo
if (producto.stockActual <= producto.stockMinimo) {
  await notificarInventarioBajo(producto.nombre, producto.stockActual)
}

// Ejemplo 3: Notificación para todos los usuarios
await notificarSistemaGlobal(
  "Mantenimiento programado",
  "El sistema no estará disponible el domingo de 2-4 AM"
)
```

### Integración recomendada:

1. **En creación de órdenes** (`app/api/ordenes/route.ts`):
   ```typescript
   await notificarOrdenNueva(orden.id, orden.folio, orden.tecnicoId)
   ```

2. **Al cambiar estado de orden**:
   ```typescript
   if (nuevoEstado === "Lista para entrega") {
     await notificarOrdenListaEntrega(orden.id, orden.folio, equipoDescripcion)
   }
   ```

3. **Al registrar movimientos de inventario**:
   ```typescript
   if (producto.stockActual <= producto.stockMinimo) {
     await notificarInventarioBajo(producto.nombre, producto.stockActual)
   }
   ```

4. **Al registrar pagos**:
   ```typescript
   await notificarPagoRecibido(orden.id, orden.folio, monto)
   ```

## Tipos de notificaciones

- `orden` - Relacionadas con órdenes de servicio
- `inventario` - Stock bajo, movimientos importantes
- `garantia` - Garantías por vencer o vencidas
- `sistema` - Mantenimiento, actualizaciones
- `general` - Otras notificaciones

## Próximos pasos (opcional)

- [ ] Agregar notificaciones push del navegador
- [ ] Implementar sonido al recibir notificación
- [ ] Panel de configuración de notificaciones por usuario
- [ ] Envío de notificaciones por email
- [ ] Webhook para notificaciones a servicios externos
