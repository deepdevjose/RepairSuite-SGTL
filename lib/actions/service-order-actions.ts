import type {
    ServiceOrder,
    CreateServiceOrderDTO,
    UpdateServiceOrderStateDTO,
    ServiceOrderState,
    PaymentRecord,
    InventoryRequest,
    DiagnosisResult,
    RepairCompletion,
    ServiceOrderHistory,
} from "@/lib/types/service-order"
import {
    isValidTransition,
    hasTransitionPermission,
    validateStateTransition,
    getAutomaticNextState,
} from "@/lib/utils/state-machine"

/**
 * Service Order Actions
 * Functions for managing service order lifecycle
 */

type UserRole = "Administrador" | "Recepción" | "Técnico"

/**
 * Create a new service order
 */
export async function createServiceOrder(
    data: CreateServiceOrderDTO,
    createdBy: { name: string; role: UserRole }
): Promise<ServiceOrder> {
    const now = new Date().toISOString()
    const folio = generateFolio()

    const initialPayment: PaymentRecord = {
        id: generateId("pay"),
        tipo: "Diagnóstico",
        monto: data.pagoInicial.monto,
        metodo: data.pagoInicial.metodo,
        fecha: now,
        recibidoPor: createdBy.name,
        referencia: data.pagoInicial.referencia,
    }

    const initialHistory: ServiceOrderHistory = {
        id: generateId("hist"),
        fecha: now,
        estadoNuevo: "Esperando diagnóstico",
        usuario: createdBy.name,
        notas: `Orden creada. Diagnóstico pagado: $${data.pagoInicial.monto}`,
    }

    const serviceOrder: ServiceOrder = {
        id: generateId("so"),
        folio,
        fechaCreacion: now,

        clienteId: data.clienteId,
        clienteNombre: "", // Should be fetched from client data
        clienteTelefono: "", // Should be fetched from client data

        equipoId: data.equipoId,
        equipoTipo: "", // Should be fetched from equipment data
        equipoMarca: "", // Should be fetched from equipment data
        equipoModelo: "", // Should be fetched from equipment data

        problemaReportado: data.problemaReportado,
        estado: "Esperando diagnóstico",
        prioridad: data.prioridad,

        tecnicoAsignadoId: data.tecnicoAsignadoId,
        tecnicoAsignadoNombre: "", // Should be fetched from staff data
        sucursal: data.sucursal,

        costoDiagnostico: data.costoDiagnostico,
        costoReparacion: 0,
        totalPagado: data.pagoInicial.monto,
        pagos: [initialPayment],

        solicitudesInventario: [],
        historial: [initialHistory],
        ultimaActualizacion: now,

        esGarantia: data.esGarantia,
        clienteAprobado: false,

        notasInternas: data.notasInternas,
    }

    // In a real app, this would save to database
    console.log("[createServiceOrder] Created:", serviceOrder)

    return serviceOrder
}

/**
 * Update service order state
 */
export async function updateOrderState(
    orderId: string,
    newState: ServiceOrderState,
    user: { name: string; role: UserRole },
    notas?: string
): Promise<{ success: boolean; error?: string; order?: ServiceOrder }> {
    // In a real app, fetch from database
    // For now, we'll simulate
    const order = await getOrderById(orderId)

    if (!order) {
        return { success: false, error: "Orden no encontrada" }
    }

    const currentState = order.estado

    // Validate transition
    if (!isValidTransition(currentState, newState)) {
        return {
            success: false,
            error: `Transición inválida de "${currentState}" a "${newState}"`,
        }
    }

    // Check permissions
    if (!hasTransitionPermission(currentState, newState, user.role)) {
        return {
            success: false,
            error: `No tienes permiso para realizar esta transición`,
        }
    }

    // Validate business rules
    const validationError = validateStateTransition(currentState, newState, {
        diagnostico: order.diagnostico,
        clienteAprobado: order.clienteAprobado,
        tecnicoAsignadoId: order.tecnicoAsignadoId,
        totalPagado: order.totalPagado,
        costoReparacion: order.costoReparacion,
    })

    if (validationError) {
        return { success: false, error: validationError }
    }

    // Create history entry
    const historyEntry: ServiceOrderHistory = {
        id: generateId("hist"),
        fecha: new Date().toISOString(),
        estadoAnterior: currentState,
        estadoNuevo: newState,
        usuario: user.name,
        notas,
    }

    // Update order
    const updatedOrder: ServiceOrder = {
        ...order,
        estado: newState,
        historial: [...order.historial, historyEntry],
        ultimaActualizacion: new Date().toISOString(),
    }

    // Check for automatic next state
    const autoNextState = getAutomaticNextState(newState)
    if (autoNextState) {
        const autoHistoryEntry: ServiceOrderHistory = {
            id: generateId("hist"),
            fecha: new Date().toISOString(),
            estadoAnterior: newState,
            estadoNuevo: autoNextState,
            usuario: "Sistema",
            notas: "Transición automática",
        }

        updatedOrder.estado = autoNextState
        updatedOrder.historial.push(autoHistoryEntry)
    }

    // In a real app, save to database
    console.log("[updateOrderState] Updated:", updatedOrder)

    return { success: true, order: updatedOrder }
}

/**
 * Add diagnosis result to service order
 */
export async function addDiagnosisResult(
    orderId: string,
    diagnosis: Omit<DiagnosisResult, "fecha" | "tecnico">,
    tecnico: string
): Promise<{ success: boolean; error?: string; order?: ServiceOrder }> {
    const order = await getOrderById(orderId)

    if (!order) {
        return { success: false, error: "Orden no encontrada" }
    }

    if (order.estado !== "En diagnóstico") {
        return {
            success: false,
            error: "La orden debe estar en estado 'En diagnóstico'",
        }
    }

    const diagnosisResult: DiagnosisResult = {
        ...diagnosis,
        fecha: new Date().toISOString(),
        tecnico,
    }

    const updatedOrder: ServiceOrder = {
        ...order,
        diagnostico: diagnosisResult,
        costoReparacion: diagnosis.costoEstimado,
        ultimaActualizacion: new Date().toISOString(),
    }

    // In a real app, save to database
    console.log("[addDiagnosisResult] Updated:", updatedOrder)

    return { success: true, order: updatedOrder }
}

/**
 * Approve repair (client accepts the diagnosis and cost)
 */
export async function approveRepair(
    orderId: string,
    approvedBy: string
): Promise<{ success: boolean; error?: string; order?: ServiceOrder }> {
    const order = await getOrderById(orderId)

    if (!order) {
        return { success: false, error: "Orden no encontrada" }
    }

    if (order.estado !== "Pendiente aprobación") {
        return {
            success: false,
            error: "La orden debe estar en estado 'Pendiente aprobación'",
        }
    }

    const updatedOrder: ServiceOrder = {
        ...order,
        clienteAprobado: true,
        ultimaActualizacion: new Date().toISOString(),
    }

    // In a real app, save to database
    console.log("[approveRepair] Updated:", updatedOrder)

    return { success: true, order: updatedOrder }
}

/**
 * Request inventory items for a service order
 */
export async function requestInventory(
    orderId: string,
    request: Omit<InventoryRequest, "id" | "fechaSolicitud" | "estado">,
    solicitadoPor: string
): Promise<{ success: boolean; error?: string; request?: InventoryRequest }> {
    const order = await getOrderById(orderId)

    if (!order) {
        return { success: false, error: "Orden no encontrada" }
    }

    const inventoryRequest: InventoryRequest = {
        ...request,
        id: generateId("inv-req"),
        fechaSolicitud: new Date().toISOString(),
        estado: "Pendiente",
        solicitadoPor,
    }

    // In a real app, save to database and update order
    console.log("[requestInventory] Created:", inventoryRequest)

    return { success: true, request: inventoryRequest }
}

/**
 * Approve inventory request (admin only)
 */
export async function approveInventoryRequest(
    requestId: string,
    orderId: string,
    approvedBy: string,
    notas?: string
): Promise<{ success: boolean; error?: string }> {
    // In a real app, this would:
    // 1. Update the inventory request status
    // 2. Create an inventory movement record
    // 3. Update the service order

    console.log("[approveInventoryRequest] Approved:", {
        requestId,
        orderId,
        approvedBy,
        notas,
    })

    return { success: true }
}

/**
 * Reject inventory request
 */
export async function rejectInventoryRequest(
    requestId: string,
    rejectedBy: string,
    notas: string
): Promise<{ success: boolean; error?: string }> {
    console.log("[rejectInventoryRequest] Rejected:", {
        requestId,
        rejectedBy,
        notas,
    })

    return { success: true }
}

/**
 * Add payment to service order
 */
export async function addPayment(
    orderId: string,
    payment: Omit<PaymentRecord, "id" | "fecha">,
    recibidoPor: string
): Promise<{ success: boolean; error?: string; payment?: PaymentRecord }> {
    const order = await getOrderById(orderId)

    if (!order) {
        return { success: false, error: "Orden no encontrada" }
    }

    const paymentRecord: PaymentRecord = {
        ...payment,
        id: generateId("pay"),
        fecha: new Date().toISOString(),
        recibidoPor,
    }

    // In a real app, save to database and update order
    console.log("[addPayment] Created:", paymentRecord)

    return { success: true, payment: paymentRecord }
}

/**
 * Complete repair
 */
export async function completeRepair(
    orderId: string,
    completion: Omit<RepairCompletion, "fecha" | "tecnico">,
    tecnico: string
): Promise<{ success: boolean; error?: string; order?: ServiceOrder }> {
    const order = await getOrderById(orderId)

    if (!order) {
        return { success: false, error: "Orden no encontrada" }
    }

    if (order.estado !== "En reparación") {
        return {
            success: false,
            error: "La orden debe estar en estado 'En reparación'",
        }
    }

    const repairCompletion: RepairCompletion = {
        ...completion,
        fecha: new Date().toISOString(),
        tecnico,
    }

    const updatedOrder: ServiceOrder = {
        ...order,
        reparacion: repairCompletion,
        ultimaActualizacion: new Date().toISOString(),
    }

    // In a real app, save to database
    console.log("[completeRepair] Updated:", updatedOrder)

    return { success: true, order: updatedOrder }
}

/**
 * Deliver equipment to client
 */
export async function deliverToClient(
    orderId: string,
    entregadoA: string,
    entregadoPor: string
): Promise<{ success: boolean; error?: string; order?: ServiceOrder }> {
    const order = await getOrderById(orderId)

    if (!order) {
        return { success: false, error: "Orden no encontrada" }
    }

    if (order.estado !== "En recepción") {
        return {
            success: false,
            error: "La orden debe estar en estado 'En recepción'",
        }
    }

    // Check if fully paid
    const totalEsperado = order.costoDiagnostico + order.costoReparacion
    if (order.totalPagado < totalEsperado) {
        return {
            success: false,
            error: `Falta pago. Total esperado: $${totalEsperado}, Pagado: $${order.totalPagado}`,
        }
    }

    const updatedOrder: ServiceOrder = {
        ...order,
        fechaEntrega: new Date().toISOString(),
        entregadoA,
        ultimaActualizacion: new Date().toISOString(),
    }

    // In a real app, save to database
    console.log("[deliverToClient] Updated:", updatedOrder)

    return { success: true, order: updatedOrder }
}

// Helper functions

function generateFolio(): string {
    const num = Math.floor(Math.random() * 9000) + 1000
    return `RS-OS-${num}`
}

function generateId(prefix: string): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `${prefix}-${timestamp}-${random}`
}

async function getOrderById(id: string): Promise<ServiceOrder | null> {
    // In a real app, fetch from database
    // For now, return null (mock implementation)
    return null
}
