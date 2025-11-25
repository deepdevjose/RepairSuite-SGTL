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
    "En diagnóstico": ["Diagnóstico completo", "Esperando diagnóstico", "Cancelada"],
    "Diagnóstico completo": ["Pendiente aprobación", "Cancelada"],
    "Pendiente aprobación": ["Asignado a técnico", "Cancelada"],
    "Asignado a técnico": ["En reparación", "Cancelada"],
    "En reparación": ["Reparación terminada", "Asignado a técnico", "Cancelada"],
    "Reparación terminada": ["Esperando entrega"],
    "Esperando entrega": ["En recepción"],
    "En recepción": ["Entregado a cliente"],
    "Entregado a cliente": [], // Final state
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
    "En diagnóstico -> Diagnóstico completo": ["Técnico", "Administrador"],
    "En diagnóstico -> Esperando diagnóstico": ["Técnico", "Administrador"], // Backtrack
    "Asignado a técnico -> En reparación": ["Técnico", "Administrador"],
    "En reparación -> Reparación terminada": ["Técnico", "Administrador"],
    "En reparación -> Asignado a técnico": ["Técnico", "Administrador"], // Backtrack

    // Receptionist transitions
    "Diagnóstico completo -> Pendiente aprobación": ["Recepción", "Administrador"],
    "Pendiente aprobación -> Asignado a técnico": ["Recepción", "Administrador"],
    "Esperando entrega -> En recepción": ["Recepción", "Administrador"],
    "En recepción -> Entregado a cliente": ["Recepción", "Administrador"],

    // Automatic transitions (system)
    "Reparación terminada -> Esperando entrega": ["Técnico", "Recepción", "Administrador"],

    // Cancellation (any role can cancel)
    "Esperando diagnóstico -> Cancelada": ["Recepción", "Técnico", "Administrador"],
    "En diagnóstico -> Cancelada": ["Recepción", "Técnico", "Administrador"],
    "Diagnóstico completo -> Cancelada": ["Recepción", "Administrador"],
    "Pendiente aprobación -> Cancelada": ["Recepción", "Administrador"],
    "Asignado a técnico -> Cancelada": ["Recepción", "Administrador"],
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
        description: "La orden fue creada y está esperando que el técnico inicie el diagnóstico",
    },
    "En diagnóstico": {
        label: "En diagnóstico",
        color: "purple",
        icon: "search",
        description: "El técnico está revisando el equipo para determinar el problema",
    },
    "Diagnóstico completo": {
        label: "Diagnóstico completo",
        color: "indigo",
        icon: "check-circle",
        description: "El diagnóstico está completo, esperando contactar al cliente",
    },
    "Pendiente aprobación": {
        label: "Pendiente aprobación",
        color: "yellow",
        icon: "alert-circle",
        description: "Esperando que el cliente apruebe la reparación",
    },
    "Asignado a técnico": {
        label: "Asignado a técnico",
        color: "cyan",
        icon: "user-check",
        description: "La reparación fue aprobada y asignada al técnico",
    },
    "En reparación": {
        label: "En reparación",
        color: "orange",
        icon: "wrench",
        description: "El técnico está realizando la reparación",
    },
    "Reparación terminada": {
        label: "Reparación terminada",
        color: "lime",
        icon: "check",
        description: "La reparación está completa",
    },
    "Esperando entrega": {
        label: "Esperando entrega",
        color: "teal",
        icon: "package",
        description: "El equipo está en almacén esperando ser entregado",
    },
    "En recepción": {
        label: "En recepción",
        color: "sky",
        icon: "inbox",
        description: "El equipo está en recepción esperando al cliente",
    },
    "Entregado a cliente": {
        label: "Entregado a cliente",
        color: "green",
        icon: "check-circle-2",
        description: "El equipo fue entregado al cliente",
    },
    "Cancelada": {
        label: "Cancelada",
        color: "red",
        icon: "x-circle",
        description: "La orden de servicio fue cancelada",
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
        case "Diagnóstico completo":
            if (!orderData.diagnostico) {
                return "Debe completar el diagnóstico antes de cambiar el estado"
            }
            break

        case "Asignado a técnico":
            if (!orderData.clienteAprobado) {
                return "El cliente debe aprobar la reparación primero"
            }
            if (!orderData.tecnicoAsignadoId) {
                return "Debe asignar un técnico"
            }
            break

        case "Entregado a cliente":
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
            return "Esperando entrega"
        default:
            return null
    }
}
