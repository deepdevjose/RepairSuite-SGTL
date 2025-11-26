# Flujo de Órdenes de Servicio - RepairSuite SGTL

## 📋 Resumen del Flujo Implementado

Este documento describe el flujo completo de una orden de servicio tal como funciona en el negocio real.

---

## 🔄 Estados de la Orden de Servicio (SIMPLIFICADO)

### 1. **Esperando diagnóstico**
- **Responsable:** Recepcionista → Técnico
- **Acciones:**
  - Cliente llega con equipo dañado
  - Recepcionista registra al cliente (si es nuevo)
  - Recepcionista registra el equipo (si no existe)
  - Recepcionista crea la orden de servicio con:
    - Datos del cliente y equipo
    - Problema reportado (descripción inicial del cliente)
    - **Cobra $150 por diagnóstico**
    - Asigna un técnico disponible
  - **NO se completa diagnóstico detallado aún**

### 2. **En diagnóstico**
- **Responsable:** Técnico
- **Acciones:**
  - Técnico ve la OS en su panel de "Mis Órdenes"
  - Técnico cambia estado a "En diagnóstico"
  - **Revisa físicamente el equipo**
  - Identifica el problema

### 3. **Diagnóstico completo**
- **Responsable:** Técnico
- **Acciones:**
  - Técnico termina de revisar el equipo
  - Cambia estado a "Diagnóstico completo"
  - **AHORA SÍ** completa el diagnóstico detallado con:
    - Problema encontrado (técnico, detallado)
    - Solución propuesta
    - **Cotización/costo de reparación**
    - Tiempo estimado
    - Materiales necesarios (opcional)
  - Sistema notifica a recepción

### 4. **Esperando aprobación**
- **Responsable:** Recepcionista
- **Acciones:**
  - Recepcionista contacta al cliente
  - Informa sobre el problema y costo total
  - **Cliente decide:**
    - ✅ **Acepta:** Continúa a siguiente estado
    - ❌ **Rechaza:** Se cancela la orden

### 5. **En reparación**
- **Responsable:** Técnico
- **Acciones:**
  - Recepcionista marca que cliente aceptó
  - Estado cambia automáticamente a "En reparación"
  - **Técnico ve que la OS regresó a él**
  - Técnico realiza la reparación
  - Usa piezas/materiales del inventario según necesite

### 6. **Reparación terminada**
- **Responsable:** Técnico → Sistema
- **Acciones:**
  - Técnico completa la reparación
  - Abre la OS y marca como "Reparación terminada"
  - **Registra las piezas que usó del inventario**
  - **Sistema automáticamente cambia a:** "Lista para entrega"

### 7. **Lista para entrega**
- **Responsable:** Recepcionista
- **Acciones:**
  - Recepcionista ve que hay equipo listo para entregar
  - Contacta al cliente para que recoja
  - Espera a que cliente llegue

### 8. **Pagado y entregado** _(Estado final)_
- **Responsable:** Recepcionista
- **Acciones:**
  - Cliente llega a recoger
  - **Recepcionista verifica identidad**
  - **Cobra saldo pendiente** (si lo hay)
  - Verifica que el pago esté completo
  - Entrega equipo reparado
  - Cliente firma de recibido
  - Cambia estado a "Pagado y entregado"
  - **Estado final de la OS** ✅

### 9. **Cancelada** _(Estado final alternativo)_
- **Puede suceder en cualquier momento antes de la entrega**
- Razones: Cliente no aprobó, reparación imposible, cliente no recogió, etc.

---

## 💰 Flujo de Pagos Simplificado

### Pagos en el proceso:

1. **Diagnóstico ($150):**
   - Se cobra **obligatoriamente** al crear la OS
   - Sin este pago no se crea la orden

2. **Reparación (Variable):**
   - Se informa el costo después del diagnóstico técnico
   - Cliente puede pagar:
     - **Anticipo** cuando acepta la reparación
     - **Saldo final** al recoger el equipo
     - **Total** en cualquier momento

3. **Total a pagar:**
   ```
   Total = Diagnóstico ($150) + Costo de Reparación
   ```

4. **Validación al entregar:**
   - Sistema verifica que `totalPagado >= totalEsperado`
   - No permite marcar como "Pagado y entregado" si falta pago

---

## 📦 Manejo de Materiales/Piezas

### Flujo simplificado:

1. **Durante diagnóstico (Estado "Diagnóstico completo"):**
   - Técnico puede listar materiales necesarios (opcional)
   - Es solo informativo para la cotización

2. **Durante reparación (Estado "En reparación"):**
   - Técnico usa piezas según vaya necesitando
   - **NO hay solicitud previa ni aprobación**
   - Toma materiales del inventario directamente

3. **Al terminar (Estado "Reparación terminada"):**
   - Técnico registra **qué piezas usó realmente**
   - Sistema las descuenta del inventario automáticamente
   - Queda registro de materiales usados en la OS

---

## 👥 Roles y Permisos

### Recepcionista:
- ✅ Crear órdenes de servicio (sin diagnóstico técnico)
- ✅ Registrar clientes y equipos
- ✅ Cobrar pagos ($150 inicial + saldos)
- ✅ Contactar cliente (cambiar a "Esperando aprobación")
- ✅ Aprobar reparación cuando cliente acepta → "En reparación"
- ✅ Entregar equipos a clientes → "Pagado y entregado"

### Técnico:
- ✅ Ver "Mis Órdenes" (solo las asignadas a él)
- ✅ Iniciar diagnóstico → "En diagnóstico"
- ✅ Marcar diagnóstico listo → "Diagnóstico completo"
- ✅ Completar detalles técnicos y cotización
- ✅ Ver cuando la OS regresa a "En reparación"
- ✅ Terminar reparación → "Reparación terminada"
- ✅ Registrar piezas usadas al terminar

### Administrador:
- ✅ Todo lo anterior
- ✅ Ver todas las órdenes (no solo las propias)
- ✅ Gestionar inventario y movimientos
- ✅ Reportes y estadísticas

---

## 🔔 Notificaciones Clave

1. **A Recepción:**
   - Cuando un diagnóstico está completo → contactar cliente
   - Cuando un equipo está "Lista para entrega" → avisar cliente

2. **A Técnico:**
   - Cuando se le asigna una nueva OS
   - Cuando cliente aprueba la reparación → la OS regresa como "En reparación"

3. **A Administrador:**
   - Órdenes estancadas (sin movimiento por X tiempo)
   - Alertas de inventario bajo

---

## 📊 Panel de Técnico

La vista `/dashboard/ordenes/mis-ordenes` muestra:

- **5 Tabs organizados por estado:**
  1. **Por diagnosticar** (Esperando diagnóstico)
  2. **En diagnóstico** (En diagnóstico)
  3. **Diagnóstico completo** (con indicador "Completar detalles")
  4. **En reparación** (En reparación)
  5. **Completadas** (Reparación terminada + Lista para entrega + Pagado y entregado)

- **Estadísticas rápidas** en cards de cada estado
- **Búsqueda** por folio, cliente o equipo
- **Cards visuales** con información clave
- **Acceso rápido** a acciones disponibles

---

## 🎯 Diferencias Clave vs. Versión Anterior

### ❌ **Eliminado:**
- Estado "Pendiente aprobación cliente" → ahora es "Esperando aprobación"
- Estado "Aprobado - Esperando materiales" → simplificado
- Estado "Esperando entrega" y "En recepción" → ahora es solo "Lista para entrega"
- Estado "Entregado a cliente" → ahora es "Pagado y entregado"
- Sistema de solicitud/aprobación de materiales por adelantado

### ✅ **Mejorado:**
- Flujo más directo y natural
- Menos estados = menos confusión
- Materiales se registran al terminar (no antes)
- Diagnóstico técnico se completa DESPUÉS de revisar físicamente
- Recepción solo captura lo básico al inicio

---

## 📱 Componentes Actualizados

1. **`order-details-dialog.tsx`**
   - Botones dinámicos según estado simplificado
   - Técnico: Iniciar/completar diagnóstico, editar detalles, terminar reparación
   - Recepción: Contactar cliente, aprobar reparación, entregar y cobrar
   
2. **`/mis-ordenes/page.tsx`**
   - Vista especializada para técnicos
   - 5 tabs en lugar de 6
   - Indicador visual en "Diagnóstico completo"

3. **`diagnosis-dialog.tsx`**
   - Se usa solo cuando el estado es "Diagnóstico completo"
   - Técnico ya revisó físicamente el equipo

4. **`repair-completion-dialog.tsx`**
   - Aquí se registran las piezas usadas
   - Al guardar → estado cambia a "Reparación terminada"

---

## 🔧 Archivos Modificados

- `lib/types/service-order.ts` - 9 estados (antes 11)
- `lib/utils/state-machine.ts` - Transiciones simplificadas
- `lib/actions/service-order-actions.ts` - Validaciones actualizadas
- `lib/data/service-orders-mock.ts` - Ejemplos actualizados
- `components/ordenes/order-details-dialog.tsx` - Acciones simplificadas
- `app/dashboard/ordenes/mis-ordenes/page.tsx` - 5 tabs

---

**Fecha de actualización:** Noviembre 24, 2025  
**Sistema:** RepairSuite SGTL v2.1 (Flujo Simplificado)  
**Estados totales:** 9 (antes 11)
