import type { SaleDetail, Payment, DailyCashReport, AccountReceivable } from "@/lib/types/sales"

// ============================================
// PAYMENTS
// ============================================

export const mockPayments: Payment[] = [
    {
        id: "pay-001",
        ordenServicioId: "os-001",
        folioOS: "RS-OS-1024",
        monto: 2500,
        metodoPago: "Efectivo",
        fecha: "2025-01-20T10:30:00Z",
        referencia: "",
        usuarioRegistro: "user-001",
        nombreUsuario: "Ana Martínez",
        sucursal: "Sede A",
    },
    {
        id: "pay-002",
        ordenServicioId: "os-002",
        folioOS: "RS-OS-1023",
        monto: 1000,
        metodoPago: "Tarjeta",
        fecha: "2025-01-19T14:15:00Z",
        referencia: "VISA-****1234",
        usuarioRegistro: "user-002",
        nombreUsuario: "Carlos Gómez",
        sucursal: "Sede A",
    },
    {
        id: "pay-003",
        ordenServicioId: "os-002",
        folioOS: "RS-OS-1023",
        monto: 600,
        metodoPago: "Mixto",
        mixedBreakdown: {
            efectivo: 400,
            tarjeta: 200,
            transferencia: 0,
            mercadoPago: 0,
            deposito: 0,
        },
        fecha: "2025-01-20T16:45:00Z",
        notas: "Pago parcial - cliente solicitó dividir",
        usuarioRegistro: "user-001",
        nombreUsuario: "Ana Martínez",
        sucursal: "Sede A",
    },
    {
        id: "pay-004",
        ordenServicioId: "os-004",
        folioOS: "RS-OS-1021",
        monto: 1500,
        metodoPago: "Transferencia",
        fecha: "2025-01-18T11:20:00Z",
        referencia: "SPEI-987654321",
        comprobante: "/comprobantes/pay-004.pdf",
        usuarioRegistro: "user-003",
        nombreUsuario: "Luis Torres",
        sucursal: "Sede B",
    },
    {
        id: "pay-005",
        ordenServicioId: "os-005",
        folioOS: "RS-OS-1020",
        monto: 800,
        metodoPago: "MercadoPago",
        fecha: "2025-01-17T09:30:00Z",
        referencia: "MP-123456789",
        usuarioRegistro: "user-001",
        nombreUsuario: "Ana Martínez",
        sucursal: "Sede A",
    },
]

// ============================================
// SALES
// ============================================

export const mockSales: SaleDetail[] = [
    {
        ordenServicioId: "os-001",
        folioOS: "RS-OS-1024",
        cliente: "Juan Pérez García",
        clienteEmail: "juan.perez@email.com",
        clienteTelefono: "+52 55 1234 5678",
        equipo: "Laptop HP Pavilion 15",
        equipoMarca: "HP",
        equipoModelo: "Pavilion 15-au123la",
        sucursal: "Sede A",
        fechaCreacion: "2025-01-18T08:00:00Z",
        conceptos: [
            {
                tipo: "Servicio",
                catalogoSKU: "SRV-LIMP-PROFUNDA",
                nombre: "Limpieza Profunda con Pasta Térmica",
                cantidad: 1,
                precioUnitario: 350,
                costoUnitario: 50, // Pasta térmica
                subtotal: 350,
            },
            {
                tipo: "Servicio",
                catalogoSKU: "SRV-FORMAT-INSTALL",
                nombre: "Formateo e Instalación de Sistema Operativo",
                cantidad: 1,
                precioUnitario: 450,
                costoUnitario: 0,
                subtotal: 450,
            },
            {
                tipo: "Refacción",
                catalogoSKU: "RAM-DDR4-8GB-2666",
                nombre: "Memoria RAM DDR4 8GB 2666MHz",
                cantidad: 2,
                precioUnitario: 850,
                costoUnitario: 620,
                subtotal: 1700,
            },
        ],
        subtotal: 2500,
        descuento: 0,
        total: 2500,
        pagado: 2500,
        saldo: 0,
        estado: "Pagado",
        pagos: [mockPayments[0]],
        tecnicoAsignado: "Carlos Gómez",
    },
    {
        ordenServicioId: "os-002",
        folioOS: "RS-OS-1023",
        cliente: "María González López",
        clienteEmail: "maria.gonzalez@email.com",
        clienteTelefono: "+52 55 8765 4321",
        equipo: "Laptop Dell Inspiron 15",
        equipoMarca: "Dell",
        equipoModelo: "Inspiron 15 5000",
        sucursal: "Sede A",
        fechaCreacion: "2025-01-17T10:30:00Z",
        conceptos: [
            {
                tipo: "Servicio",
                catalogoSKU: "SRV-CAMBIO-PANTALLA",
                nombre: "Cambio de Pantalla",
                cantidad: 1,
                precioUnitario: 400,
                costoUnitario: 0,
                subtotal: 400,
            },
            {
                tipo: "Refacción",
                catalogoSKU: "PANT-15.6-FHD",
                nombre: "Pantalla 15.6\" FHD",
                cantidad: 1,
                precioUnitario: 2800,
                costoUnitario: 2100,
                subtotal: 2800,
            },
        ],
        subtotal: 3200,
        descuento: 0,
        total: 3200,
        pagado: 1600,
        saldo: 1600,
        estado: "Parcial",
        pagos: [mockPayments[1], mockPayments[2]],
        tecnicoAsignado: "Ana Martínez",
    },
    {
        ordenServicioId: "os-003",
        folioOS: "RS-OS-1022",
        cliente: "Pedro Ramírez Sánchez",
        clienteEmail: "pedro.ramirez@email.com",
        clienteTelefono: "+52 55 5555 1234",
        equipo: "Desktop HP Compaq",
        equipoMarca: "HP",
        equipoModelo: "Compaq Elite 8300",
        sucursal: "Sede B",
        fechaCreacion: "2025-01-16T14:00:00Z",
        fechaVencimiento: "2025-01-23T14:00:00Z",
        conceptos: [
            {
                tipo: "Servicio",
                catalogoSKU: "SRV-DIAG-GENERAL",
                nombre: "Diagnóstico General Completo",
                cantidad: 1,
                precioUnitario: 200,
                costoUnitario: 0,
                subtotal: 200,
            },
            {
                tipo: "Servicio",
                catalogoSKU: "SRV-UPGRADE-SSD",
                nombre: "Upgrade a SSD con Clonación",
                cantidad: 1,
                precioUnitario: 500,
                costoUnitario: 0,
                subtotal: 500,
            },
            {
                tipo: "Refacción",
                catalogoSKU: "SSD-256GB-SATA",
                nombre: "SSD 256GB SATA III",
                cantidad: 1,
                precioUnitario: 1250,
                costoUnitario: 890,
                subtotal: 1250,
            },
        ],
        subtotal: 1950,
        descuento: 150,
        total: 1800,
        pagado: 0,
        saldo: 1800,
        estado: "Pendiente",
        pagos: [],
        tecnicoAsignado: "Luis Torres",
        notas: "Cliente solicitó descuento por ser cliente frecuente",
    },
    {
        ordenServicioId: "os-004",
        folioOS: "RS-OS-1021",
        cliente: "Laura Martínez Díaz",
        clienteEmail: "laura.martinez@email.com",
        clienteTelefono: "+52 55 9876 5432",
        equipo: "Laptop Lenovo ThinkPad",
        equipoMarca: "Lenovo",
        equipoModelo: "ThinkPad T480",
        sucursal: "Sede B",
        fechaCreacion: "2025-01-15T09:00:00Z",
        conceptos: [
            {
                tipo: "Servicio",
                catalogoSKU: "SRV-CAMBIO-BATERIA",
                nombre: "Cambio de Batería",
                cantidad: 1,
                precioUnitario: 250,
                costoUnitario: 0,
                subtotal: 250,
            },
            {
                tipo: "Refacción",
                catalogoSKU: "BATT-DELL-INSPIRON",
                nombre: "Batería Dell Inspiron",
                cantidad: 1,
                precioUnitario: 1380,
                costoUnitario: 980,
                subtotal: 1380,
            },
        ],
        subtotal: 1630,
        descuento: 130,
        total: 1500,
        pagado: 1500,
        saldo: 0,
        estado: "Pagado",
        pagos: [mockPayments[3]],
        tecnicoAsignado: "Carlos Gómez",
    },
    {
        ordenServicioId: "os-005",
        folioOS: "RS-OS-1020",
        cliente: "Roberto Silva Torres",
        clienteEmail: "roberto.silva@email.com",
        clienteTelefono: "+52 55 1111 2222",
        equipo: "Laptop Asus VivoBook",
        equipoMarca: "Asus",
        equipoModelo: "VivoBook 15",
        sucursal: "Sede A",
        fechaCreacion: "2025-01-14T11:30:00Z",
        conceptos: [
            {
                tipo: "Servicio",
                catalogoSKU: "SRV-ELIMINACION-VIRUS",
                nombre: "Eliminación de Virus y Malware",
                cantidad: 1,
                precioUnitario: 300,
                costoUnitario: 0,
                subtotal: 300,
            },
            {
                tipo: "Servicio",
                catalogoSKU: "SRV-UPGRADE-RAM",
                nombre: "Upgrade de Memoria RAM",
                cantidad: 1,
                precioUnitario: 150,
                costoUnitario: 0,
                subtotal: 150,
            },
            {
                tipo: "Refacción",
                catalogoSKU: "RAM-DDR4-8GB-2666",
                nombre: "Memoria RAM DDR4 8GB 2666MHz",
                cantidad: 1,
                precioUnitario: 850,
                costoUnitario: 620,
                subtotal: 850,
            },
        ],
        subtotal: 1300,
        descuento: 0,
        total: 1300,
        pagado: 800,
        saldo: 500,
        estado: "Parcial",
        pagos: [mockPayments[4]],
        tecnicoAsignado: "Ana Martínez",
    },
    {
        ordenServicioId: "os-006",
        folioOS: "RS-OS-1019",
        cliente: "Carmen Rodríguez Vega",
        clienteEmail: "carmen.rodriguez@email.com",
        equipo: "Desktop Custom Build",
        sucursal: "Sede C",
        fechaCreacion: "2025-01-10T15:00:00Z",
        fechaVencimiento: "2025-01-17T15:00:00Z",
        conceptos: [
            {
                tipo: "Servicio",
                catalogoSKU: "SRV-RECUPERACION-DATOS",
                nombre: "Recuperación de Datos",
                cantidad: 1,
                precioUnitario: 800,
                costoUnitario: 0,
                subtotal: 800,
            },
        ],
        subtotal: 800,
        descuento: 0,
        total: 800,
        pagado: 0,
        saldo: 800,
        estado: "Vencido",
        pagos: [],
        tecnicoAsignado: "Luis Torres",
        notas: "Cliente no ha respondido llamadas",
    },
]

// ============================================
// DAILY CASH REPORTS
// ============================================

export const mockDailyCashReports: DailyCashReport[] = [
    {
        fecha: "2025-01-20",
        sucursal: "Sede A",
        totalCobrado: 3100,
        porMetodo: {
            Efectivo: 2500,
            Tarjeta: 200,
            Transferencia: 0,
            MercadoPago: 0,
            Depósito: 0,
            Mixto: 400,
        },
        numeroTransacciones: 2,
        usuariosQueCobaron: ["Ana Martínez"],
        ordenesCompletadas: ["RS-OS-1024", "RS-OS-1023"],
    },
]

// ============================================
// ACCOUNTS RECEIVABLE
// ============================================

export const mockAccountsReceivable: AccountReceivable[] = [
    {
        folioOS: "RS-OS-1023",
        cliente: "María González López",
        total: 3200,
        pagado: 1600,
        saldo: 1600,
        fechaCreacion: "2025-01-17T10:30:00Z",
        diasVencido: 0,
        sucursal: "Sede A",
    },
    {
        folioOS: "RS-OS-1022",
        cliente: "Pedro Ramírez Sánchez",
        total: 1800,
        pagado: 0,
        saldo: 1800,
        fechaCreacion: "2025-01-16T14:00:00Z",
        diasVencido: 0,
        sucursal: "Sede B",
    },
    {
        folioOS: "RS-OS-1020",
        cliente: "Roberto Silva Torres",
        total: 1300,
        pagado: 800,
        saldo: 500,
        fechaCreacion: "2025-01-14T11:30:00Z",
        diasVencido: 0,
        sucursal: "Sede A",
    },
    {
        folioOS: "RS-OS-1019",
        cliente: "Carmen Rodríguez Vega",
        total: 800,
        pagado: 0,
        saldo: 800,
        fechaCreacion: "2025-01-10T15:00:00Z",
        diasVencido: 3,
        sucursal: "Sede C",
    },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getSaleByFolio(folio: string): SaleDetail | undefined {
    return mockSales.find((s) => s.folioOS === folio)
}

export function getPaymentsByFolio(folio: string): Payment[] {
    return mockPayments.filter((p) => p.folioOS === folio)
}

export function getAllSales(): SaleDetail[] {
    return mockSales
}

export function getAllPayments(): Payment[] {
    return mockPayments
}

export function getAccountsReceivable(): AccountReceivable[] {
    return mockAccountsReceivable
}
