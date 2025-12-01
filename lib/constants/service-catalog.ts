export type ServiceType = 'diagnostico' | 'mantenimiento' | 'reinstalacion_so' | 'instalacion_so' | 'instalacion_software'

export interface ServiceItem {
    id: string
    type: ServiceType
    label: string
    price: number
    requiresDiagnosis: boolean
    isSoftware?: boolean
}

export const SERVICE_CATALOG: ServiceItem[] = [
    {
        id: 'diagnostico',
        type: 'diagnostico',
        label: 'Diagnóstico General',
        price: 150,
        requiresDiagnosis: true
    },
    {
        id: 'mantenimiento',
        type: 'mantenimiento',
        label: 'Mantenimiento Preventivo',
        price: 350,
        requiresDiagnosis: false
    },
    {
        id: 'reinstalacion_so',
        type: 'reinstalacion_so',
        label: 'Reinstalación de S.O.',
        price: 250,
        requiresDiagnosis: false
    },
    {
        id: 'instalacion_so',
        type: 'instalacion_so',
        label: 'Instalación de S.O. (Win/Linux/Mac)',
        price: 250,
        requiresDiagnosis: false
    }
]

export const SOFTWARE_CATALOG: ServiceItem[] = [
    {
        id: 'avast',
        type: 'instalacion_software',
        label: 'AVAST Antivirus',
        price: 150,
        requiresDiagnosis: false,
        isSoftware: true
    },
    {
        id: 'office',
        type: 'instalacion_software',
        label: 'Microsoft Office',
        price: 180,
        requiresDiagnosis: false,
        isSoftware: true
    },
    {
        id: 'autocad',
        type: 'instalacion_software',
        label: 'AutoCAD',
        price: 180,
        requiresDiagnosis: false,
        isSoftware: true
    },
    {
        id: 'solidworks',
        type: 'instalacion_software',
        label: 'SolidWorks',
        price: 180,
        requiresDiagnosis: false,
        isSoftware: true
    }
]
