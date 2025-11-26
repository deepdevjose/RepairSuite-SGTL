import type {
    ServiceOrder,
    ServiceOrderSummary,
    PaymentRecord,
    InventoryRequest,
    ServiceOrderHistory,
    DiagnosisResult,
    RepairCompletion,
} from "@/lib/types/service-order"

/**
 * Mock Service Orders Data
 * Sample data for testing the complete workflow
 */

// Datos limpios - conectar a base de datos real
export const mockServiceOrders: ServiceOrder[] = []
    // Los datos se cargarán desde la base de datos
    {
        id: "so-001",
        folio: "RS-OS-1024",
        fechaCreacion: "2025-01-15T09:00:00Z",

        clienteId: "client-001",
        clienteNombre: "Juan Pérez",
        clienteTelefono: "5512345678",

        equipoId: "equip-001",
        equipoTipo: "Laptop",
        equipoMarca: "HP",
        equipoModelo: "Pavilion 15",
        equipoSerie: "5CD1234ABC",

        problemaReportado: "La pantalla está rota y las bisagras están dañadas. No enciende correctamente.",
        estado: "En reparación",
        prioridad: "Normal",

        tecnicoAsignadoId: "tech-002",
        tecnicoAsignadoNombre: "Carlos Gómez",

        diagnostico: {
            problema: "Pantalla LCD completamente rota, bisagras izquierda y derecha fracturadas, cable flex de pantalla dañado",
            solucion: "Reemplazo de pantalla LCD 15.6', reemplazo de bisagras, reemplazo de cable flex",
            costoEstimado: 2500,
            tiempoEstimado: "2-3 días",
            materialesNecesarios: ["Pantalla HP 15.6' HD", "Kit bisagras HP Pavilion 15", "Cable flex pantalla"],
            fecha: "2025-01-15T11:30:00Z",
            tecnico: "Carlos Gómez",
        },

        costoDiagnostico: 150,
        costoReparacion: 2500,
        totalPagado: 150,
        pagos: [
            {
                id: "pay-001",
                tipo: "Diagnóstico",
                monto: 150,
                metodo: "Efectivo",
                fecha: "2025-01-15T09:15:00Z",
                recibidoPor: "María González (Recepción)",
            },
        ],

        solicitudesInventario: [
            {
                id: "inv-req-001",
                productoId: "prod-101",
                productoNombre: "Pantalla HP 15.6' HD",
                cantidad: 1,
                solicitadoPor: "Carlos Gómez",
                fechaSolicitud: "2025-01-15T12:00:00Z",
                estado: "Aprobada",
                justificacion: "Necesaria para reparación de OS RS-OS-1024",
                aprobadoPor: "Admin Principal",
                fechaAprobacion: "2025-01-15T12:30:00Z",
            },
            {
                id: "inv-req-002",
                productoId: "prod-102",
                productoNombre: "Kit bisagras HP Pavilion 15",
                cantidad: 1,
                solicitadoPor: "Carlos Gómez",
                fechaSolicitud: "2025-01-15T12:00:00Z",
                estado: "Aprobada",
                aprobadoPor: "Admin Principal",
                fechaAprobacion: "2025-01-15T12:30:00Z",
            },
        ],

        historial: [
            {
                id: "hist-001",
                fecha: "2025-01-15T09:00:00Z",
                estadoNuevo: "Esperando diagnóstico",
                usuario: "María González (Recepción)",
                notas: "Orden creada, diagnóstico pagado",
            },
            {
                id: "hist-002",
                fecha: "2025-01-15T10:00:00Z",
                estadoAnterior: "Esperando diagnóstico",
                estadoNuevo: "En diagnóstico",
                usuario: "Carlos Gómez (Técnico)",
            },
            {
                id: "hist-003",
                fecha: "2025-01-15T11:30:00Z",
                estadoAnterior: "En diagnóstico",
                estadoNuevo: "Diagnóstico completo",
                usuario: "Carlos Gómez (Técnico)",
                notas: "Diagnóstico completado, costo estimado: $2,500",
            },
            {
                id: "hist-004",
                fecha: "2025-01-15T13:00:00Z",
                estadoAnterior: "Diagnóstico completo",
                estadoNuevo: "Esperando aprobación",
                usuario: "María González (Recepción)",
                notas: "Cliente contactado",
            },
            {
                id: "hist-005",
                fecha: "2025-01-15T14:00:00Z",
                estadoAnterior: "Esperando aprobación",
                estadoNuevo: "En reparación",
                usuario: "María González (Recepción)",
                notas: "Cliente aprobó la reparación",
            },
        ],

        ultimaActualizacion: "2025-01-15T14:30:00Z",
        esGarantia: false,
        clienteAprobado: true,
    },

    {
        id: "so-002",
        folio: "RS-OS-1023",
        fechaCreacion: "2025-01-14T10:00:00Z",

        clienteId: "client-002",
        clienteNombre: "María González",
        clienteTelefono: "5587654321",

        equipoId: "equip-002",
        equipoTipo: "Laptop",
        equipoMarca: "Apple",
        equipoModelo: 'MacBook Pro 13"',

        problemaReportado: "La batería se descarga muy rápido, solo dura 1 hora",
        estado: "Lista para entrega",
        prioridad: "Normal",

        tecnicoAsignadoId: "tech-001",
        tecnicoAsignadoNombre: "Ana Martínez",

        diagnostico: {
            problema: "Batería degradada al 45% de capacidad original, ciclos de carga: 1,247",
            solucion: "Reemplazo de batería original Apple",
            costoEstimado: 3800,
            tiempoEstimado: "1 día",
            materialesNecesarios: ["Batería MacBook Pro 13' A1502"],
            fecha: "2025-01-14T11:00:00Z",
            tecnico: "Ana Martínez",
        },

        reparacion: {
            trabajoRealizado: "Batería reemplazada, calibración del sistema de energía completada, pruebas de carga/descarga realizadas",
            materialesUsados: ["inv-req-003"],
            fecha: "2025-01-15T10:00:00Z",
            tecnico: "Ana Martínez",
        },

        costoDiagnostico: 150,
        costoReparacion: 3800,
        totalPagado: 3950,
        pagos: [
            {
                id: "pay-002",
                tipo: "Diagnóstico",
                monto: 150,
                metodo: "Tarjeta",
                fecha: "2025-01-14T10:15:00Z",
                recibidoPor: "María González (Recepción)",
                referencia: "XXXX-1234",
            },
            {
                id: "pay-003",
                tipo: "Pago final",
                monto: 3800,
                metodo: "Transferencia",
                fecha: "2025-01-15T09:00:00Z",
                recibidoPor: "María González (Recepción)",
                referencia: "TRANS-789456",
            },
        ],

        solicitudesInventario: [
            {
                id: "inv-req-003",
                productoId: "prod-201",
                productoNombre: "Batería MacBook Pro 13' A1502",
                cantidad: 1,
                solicitadoPor: "Ana Martínez",
                fechaSolicitud: "2025-01-14T13:00:00Z",
                estado: "Aprobada",
                aprobadoPor: "Admin Principal",
                fechaAprobacion: "2025-01-14T13:15:00Z",
            },
        ],

        historial: [
            {
                id: "hist-007",
                fecha: "2025-01-14T10:00:00Z",
                estadoNuevo: "Esperando diagnóstico",
                usuario: "María González (Recepción)",
            },
            {
                id: "hist-008",
                fecha: "2025-01-14T10:30:00Z",
                estadoAnterior: "Esperando diagnóstico",
                estadoNuevo: "En diagnóstico",
                usuario: "Ana Martínez (Técnico)",
            },
            {
                id: "hist-009",
                fecha: "2025-01-14T11:00:00Z",
                estadoAnterior: "En diagnóstico",
                estadoNuevo: "Diagnóstico completo",
                usuario: "Ana Martínez (Técnico)",
            },
            {
                id: "hist-010",
                fecha: "2025-01-14T12:00:00Z",
                estadoAnterior: "Diagnóstico completo",
                estadoNuevo: "Esperando aprobación",
                usuario: "María González (Recepción)",
            },
            {
                id: "hist-011",
                fecha: "2025-01-14T13:00:00Z",
                estadoAnterior: "Esperando aprobación",
                estadoNuevo: "En reparación",
                usuario: "María González (Recepción)",
                notas: "Cliente aprobó, pago recibido",
            },
            {
                id: "hist-012",
                fecha: "2025-01-14T14:00:00Z",
                estadoAnterior: "En reparación",
                estadoNuevo: "Reparación terminada",
                usuario: "Ana Martínez (Técnico)",
            },
            {
                id: "hist-013",
                fecha: "2025-01-15T10:00:00Z",
                estadoAnterior: "Reparación terminada",
                estadoNuevo: "Lista para entrega",
                usuario: "Sistema",
                notas: "Transición automática",
            },
        ],

        ultimaActualizacion: "2025-01-15T10:15:00Z",
        esGarantia: false,
        clienteAprobado: true,
    },

    {
        id: "so-003",
        folio: "RS-OS-1022",
        fechaCreacion: "2025-01-15T09:00:00Z",

        clienteId: "client-003",
        clienteNombre: "Pedro Ramírez",
        clienteTelefono: "5598765432",

        equipoId: "equip-003",
        equipoTipo: "Laptop",
        equipoMarca: "Dell",
        equipoModelo: "XPS 15",

        problemaReportado: "No enciende, se escucha un pitido al presionar el botón de encendido",
        estado: "En diagnóstico",
        prioridad: "Alta",

        tecnicoAsignadoId: "tech-003",
        tecnicoAsignadoNombre: "Luis Torres",

        costoDiagnostico: 150,
        costoReparacion: 0,
        totalPagado: 150,
        pagos: [
            {
                id: "pay-004",
                tipo: "Diagnóstico",
                monto: 150,
                metodo: "Efectivo",
                fecha: "2025-01-15T09:15:00Z",
                recibidoPor: "Roberto Sánchez (Recepción)",
            },
        ],

        solicitudesInventario: [],

        historial: [
            {
                id: "hist-015",
                fecha: "2025-01-15T09:00:00Z",
                estadoNuevo: "Esperando diagnóstico",
                usuario: "Roberto Sánchez (Recepción)",
            },
            {
                id: "hist-016",
                fecha: "2025-01-15T09:30:00Z",
                estadoAnterior: "Esperando diagnóstico",
                estadoNuevo: "En diagnóstico",
                usuario: "Luis Torres (Técnico)",
            },
        ],

        ultimaActualizacion: "2025-01-15T09:30:00Z",
        esGarantia: true,
        clienteAprobado: false,
    },

    {
        id: "so-004",
        folio: "RS-OS-1021",
        fechaCreacion: "2025-01-14T16:00:00Z",

        clienteId: "client-004",
        clienteNombre: "Ana López",
        clienteTelefono: "5576543210",

        equipoId: "equip-004",
        equipoTipo: "Laptop",
        equipoMarca: "Lenovo",
        equipoModelo: "ThinkPad T480",

        problemaReportado: "Se apaga sola después de 10 minutos de uso, se calienta mucho",
        estado: "Esperando aprobación",
        prioridad: "Normal",

        tecnicoAsignadoId: "tech-002",
        tecnicoAsignadoNombre: "Carlos Gómez",

        diagnostico: {
            problema: "Placa madre con corto circuito en regulador de voltaje, RAM con errores de memoria",
            solucion: "Reemplazo de placa madre y módulos RAM",
            costoEstimado: 5200,
            tiempoEstimado: "3-4 días",
            materialesNecesarios: ["Placa madre Lenovo T480", "RAM DDR4 8GB x2"],
            fecha: "2025-01-14T17:30:00Z",
            tecnico: "Carlos Gómez",
        },

        costoDiagnostico: 150,
        costoReparacion: 5200,
        totalPagado: 150,
        pagos: [
            {
                id: "pay-005",
                tipo: "Diagnóstico",
                monto: 150,
                metodo: "Efectivo",
                fecha: "2025-01-14T16:15:00Z",
                recibidoPor: "María González (Recepción)",
            },
        ],

        solicitudesInventario: [],

        historial: [
            {
                id: "hist-017",
                fecha: "2025-01-14T16:00:00Z",
                estadoNuevo: "Esperando diagnóstico",
                usuario: "María González (Recepción)",
            },
            {
                id: "hist-018",
                fecha: "2025-01-14T16:30:00Z",
                estadoAnterior: "Esperando diagnóstico",
                estadoNuevo: "En diagnóstico",
                usuario: "Carlos Gómez (Técnico)",
            },
            {
                id: "hist-019",
                fecha: "2025-01-14T17:30:00Z",
                estadoAnterior: "En diagnóstico",
                estadoNuevo: "Diagnóstico completo",
                usuario: "Carlos Gómez (Técnico)",
            },
            {
                id: "hist-020",
                fecha: "2025-01-14T18:00:00Z",
                estadoAnterior: "Diagnóstico completo",
                estadoNuevo: "Esperando aprobación",
                usuario: "María González (Recepción)",
                notas: "Cliente contactado, esperando decisión sobre reparación costosa",
            },
        ],

        ultimaActualizacion: "2025-01-14T18:00:00Z",
        esGarantia: false,
        clienteAprobado: false,
    },
]

/**
 * Get service order summaries for list views
 */
export function getServiceOrderSummaries(): ServiceOrderSummary[] {
    return mockServiceOrders.map((order) => ({
        id: order.id,
        folio: order.folio,
        clienteNombre: order.clienteNombre,
        equipoTipo: order.equipoTipo,
        equipoMarca: order.equipoMarca,
        estado: order.estado,
        tecnicoAsignadoNombre: order.tecnicoAsignadoNombre,
        totalEstimado: order.costoDiagnostico + order.costoReparacion,
        ultimaActualizacion: order.ultimaActualizacion,
        esGarantia: order.esGarantia,
        prioridad: order.prioridad,
    }))
}

/**
 * Get service order by ID
 */
export function getServiceOrderById(id: string): ServiceOrder | undefined {
    return mockServiceOrders.find((order) => order.id === id)
}

/**
 * Get service order by folio
 */
export function getServiceOrderByFolio(folio: string): ServiceOrder | undefined {
    return mockServiceOrders.find((order) => order.folio === folio)
}

/**
 * Get service orders by technician
 */
export function getServiceOrdersByTechnician(tecnicoId: string): ServiceOrder[] {
    return mockServiceOrders.filter((order) => order.tecnicoAsignadoId === tecnicoId)
}

/**
 * Get service orders by state
 */
export function getServiceOrdersByState(estado: string): ServiceOrder[] {
    return mockServiceOrders.filter((order) => order.estado === estado)
}

/**
 * Get pending inventory requests across all orders
 */
export function getPendingInventoryRequests(): Array<{
    request: InventoryRequest
    order: ServiceOrder
}> {
    const pending: Array<{ request: InventoryRequest; order: ServiceOrder }> = []

    mockServiceOrders.forEach((order) => {
        order.solicitudesInventario.forEach((request) => {
            if (request.estado === "Pendiente") {
                pending.push({ request, order })
            }
        })
    })

    return pending
}
