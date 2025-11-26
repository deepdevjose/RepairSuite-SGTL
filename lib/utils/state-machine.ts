import type { ServiceOrderState, UserRole } from "@/lib/types/service-order"

/**
 * State Machine for Service Order Workflow
 * Defines valid state transitions and role-based permissions
 */

type UserRole = "Administrador" | "Recepción" | "Técnico"

/**
 * Valid state transitions map
 * Key: current state, Value: array of possible next states
 */
export const STATE_TRANSITIONS: Record<ServiceOrderState, ServiceOrderState[]> = {
    "Esperando diagnóstico": ["En diagnóstico", "Cancelada"],
    "En diagnóstico": ["Diagnóstico terminado", "Esperando diagnóstico", "Cancelada"],
    "Diagnóstico terminado": ["Esperando aprobación", "Cancelada"],
    "Esperando aprobación": ["En reparación", "Cancelada"],
    "En reparación": ["Reparación terminada", "Cancelada"],
    "Reparación terminada": ["Lista para entrega"],
    "Lista para entrega": ["Pagado y entregado"],
    "Pagado y entregado": [], // Final state
    "Cancelada": [], // Final state
}

/**
 * Role-based permissions for state transitions
 * Defines which roles can perform which state transitions
 */
export const STATE_TRANSITION_PERMISSIONS: Record<
    string, // Transition key: "currentState -> newState"
    UserRole[]
> = {
    // Technician transitions
    "Esperando diagnóstico -> En diagnóstico": ["Técnico", "Administrador"],
    "En diagnóstico -> Diagnóstico terminado": ["Técnico", "Administrador"],
    "En diagnóstico -> Esperando diagnóstico": ["Técnico", "Administrador"], // Backtrack
    "En reparación -> Reparación terminada": ["Técnico", "Administrador"],

    // Receptionist transitions
    "Diagnóstico terminado -> Esperando aprobación": ["Recepción", "Administrador"],
    "Esperando aprobación -> En reparación": ["Recepción", "Administrador"],
    "Lista para entrega -> Pagado y entregado": ["Recepción", "Administrador"],

    // Automatic transitions (system)
    "Reparación terminada -> Lista para entrega": ["Técnico", "Recepción", "Administrador"],

    // Cancellation (any role can cancel)
    "Esperando diagnóstico -> Cancelada": ["Recepción", "Técnico", "Administrador"],
    "En diagnóstico -> Cancelada": ["Recepción", "Técnico", "Administrador"],
    "Diagnóstico terminado -> Cancelada": ["Recepción", "Administrador"],
    "Esperando aprobación -> Cancelada": ["Recepción", "Administrador"],
    "En reparación -> Cancelada": ["Recepción", "Administrador"],
}

/**
 * State metadata for UI display
 */
export const STATE_METADATA: Record<
    ServiceOrderState,
    {
        label: string
        color: string
        icon: string
        description: string
    }
> = {
    "Esperando diagnóstico": {
        label: "Esperando diagnóstico",
        color: "blue",
        icon: "clock",
        description: "Orden creada por recepción, diagnóstico pagado ($150), técnico asignado",
    },
    "En diagnóstico": {
        label: "En diagnóstico",
        color: "purple",
        icon: "search",
        description: "Técnico está revisando el equipo",
    },
    "Diagnóstico terminado": {
        label: "Diagnóstico terminado",
        color: "indigo",
        icon: "check-circle",
        description: "Técnico completó diagnóstico y agregó cotización, listo para que recepción contacte al cliente",
    },
    "Esperando aprobación": {
        label: "Esperando aprobación",
        color: "yellow",
        icon: "alert-circle",
        description: "Recepción contacta al cliente para aprobar reparación",
    },
    "En reparación": {
        label: "En reparación",
        color: "orange",
        icon: "wrench",
        description: "Cliente aprobó, técnico está reparando",
    },
    "Reparación terminada": {
        label: "Reparación terminada",
        color: "lime",
        icon: "check",
        description: "Técnico terminó, registró piezas usadas",
    },
    "Lista para entrega": {
        label: "Lista para entrega",
        color: "teal",
        icon: "package",
        description: "En recepción, esperando que cliente recoja",
    },
    "Pagado y entregado": {
        label: "Pagado y entregado",
        color: "green",
        icon: "check-circle-2",
        description: "Cliente pagó y recogió su equipo (completado)",
    },
    "Cancelada": {
        label: "Cancelada",
        color: "red",
        icon: "x-circle",
        description: "Orden de servicio cancelada",
    },
}

/**
 * Check if a state transition is valid
 */
export function isValidTransition(
    currentState: ServiceOrderState,
    newState: ServiceOrderState
): boolean {
    const validNextStates = STATE_TRANSITIONS[currentState]
    return validNextStates.includes(newState)
}

/**
 * Check if a user role has permission for a state transition
 */
export function hasTransitionPermission(
    currentState: ServiceOrderState,
    newState: ServiceOrderState,
    userRole: UserRole
): boolean {
    const transitionKey = `${currentState} -> ${newState}`
    const allowedRoles = STATE_TRANSITION_PERMISSIONS[transitionKey]

    if (!allowedRoles) {
        return false
    }

    return allowedRoles.includes(userRole)
}

/**
 * Get all valid next states for a given current state and user role
 */
export function getValidNextStates(
    currentState: ServiceOrderState,
    userRole: UserRole
): ServiceOrderState[] {
    const possibleStates = STATE_TRANSITIONS[currentState]

    return possibleStates.filter((nextState) =>
        hasTransitionPermission(currentState, nextState, userRole)
    )
}

/**
 * Validation rules for state transitions
 * Returns error message if validation fails, null if valid
 */
export function validateStateTransition(
    currentState: ServiceOrderState,
    newState: ServiceOrderState,
    orderData: {
        diagnostico?: any
        clienteAprobado?: boolean
        tecnicoAsignadoId?: string
        totalPagado?: number
        costoReparacion?: number
    }
): string | null {
    // Check if transition is valid
    if (!isValidTransition(currentState, newState)) {
        return `No se puede cambiar de "${currentState}" a "${newState}"`
    }

    // Specific validation rules
    switch (newState) {
        case "Esperando aprobación":
            if (!orderData.diagnostico) {
                return "Debe completar el diagnóstico con detalles y cotización antes de contactar al cliente"
            }
            break

        case "En reparación":
            if (!orderData.clienteAprobado) {
                return "El cliente debe aprobar la reparación primero"
            }
            break

        case "Pagado y entregado":
            if (orderData.totalPagado !== undefined && orderData.costoReparacion !== undefined) {
                const totalEsperado = orderData.costoReparacion + 150 // Diagnosis cost
                if (orderData.totalPagado < totalEsperado) {
                    return "Debe completar el pago antes de entregar el equipo"
                }
            }
            break
    }

    return null
}

/**
 * Get the next automatic state (if any)
 * Some states automatically transition to the next state
 */
export function getAutomaticNextState(
    currentState: ServiceOrderState
): ServiceOrderState | null {
    switch (currentState) {
        case "Reparación terminada":
            return "Lista para entrega"
        default:
            return null
    }
}
