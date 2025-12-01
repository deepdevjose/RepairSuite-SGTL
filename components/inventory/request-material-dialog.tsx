"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Package, Cpu, Disc, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface RequestMaterialDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function RequestMaterialDialog({ open, onOpenChange }: RequestMaterialDialogProps) {
    const { user } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("hardware")

    // Form states
    const [hardwareData, setHardwareData] = useState({
        marca: "",
        modelo: "",
        descripcion: ""
    })
    const [softwareData, setSoftwareData] = useState({
        nombre: "",
        version: "",
        descripcion: ""
    })

    const handleSubmit = async () => {
        if (!user) return

        setLoading(true)
        try {
            const isHardware = activeTab === "hardware"
            const data = isHardware ? hardwareData : softwareData

            // Basic validation
            if (isHardware && (!hardwareData.marca || !hardwareData.descripcion)) {
                toast({
                    title: "Error",
                    description: "Por favor completa la marca y descripción",
                    variant: "destructive"
                })
                setLoading(false)
                return
            }
            if (!isHardware && (!softwareData.nombre || !softwareData.descripcion)) {
                toast({
                    title: "Error",
                    description: "Por favor completa el nombre y descripción",
                    variant: "destructive"
                })
                setLoading(false)
                return
            }

            const payload = {
                tipo: isHardware ? "Hardware" : "Software",
                marca: isHardware ? hardwareData.marca : undefined,
                modelo: isHardware ? hardwareData.modelo : softwareData.version, // Reuse model field for version or just put in description
                descripcion: isHardware
                    ? hardwareData.descripcion
                    : `Software: ${softwareData.nombre} v${softwareData.version || 'N/A'}. ${softwareData.descripcion}`,
                usuarioId: user.id
            }

            const response = await fetch('/api/inventory/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!response.ok) throw new Error('Error al crear solicitud')

            toast({
                title: "Solicitud enviada",
                description: "El administrador ha sido notificado de tu solicitud.",
            })

            // Reset forms
            setHardwareData({ marca: "", modelo: "", descripcion: "" })
            setSoftwareData({ nombre: "", version: "", descripcion: "" })
            onOpenChange(false)

        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "No se pudo enviar la solicitud. Intenta de nuevo.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Package className="h-5 w-5 text-indigo-400" />
                        Solicitar Material
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Solicita piezas o licencias que no se encuentren en inventario.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                        <TabsTrigger value="hardware" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                            <Cpu className="h-4 w-4 mr-2" />
                            Hardware / Piezas
                        </TabsTrigger>
                        <TabsTrigger value="software" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                            <Disc className="h-4 w-4 mr-2" />
                            Software / Licencias
                        </TabsTrigger>
                    </TabsList>

                    <div className="py-4">
                        <TabsContent value="hardware" className="space-y-4 mt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Marca</Label>
                                    <Input
                                        placeholder="Ej. Samsung, Kingston"
                                        className="bg-slate-800 border-slate-700"
                                        value={hardwareData.marca}
                                        onChange={(e) => setHardwareData({ ...hardwareData, marca: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Modelo</Label>
                                    <Input
                                        placeholder="Ej. EVO 870, KVR2666"
                                        className="bg-slate-800 border-slate-700"
                                        value={hardwareData.modelo}
                                        onChange={(e) => setHardwareData({ ...hardwareData, modelo: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Descripción detallada</Label>
                                <Textarea
                                    placeholder="Describe la pieza, especificaciones técnicas, compatibilidad necesaria..."
                                    className="bg-slate-800 border-slate-700 min-h-[100px]"
                                    value={hardwareData.descripcion}
                                    onChange={(e) => setHardwareData({ ...hardwareData, descripcion: e.target.value })}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="software" className="space-y-4 mt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nombre del Software</Label>
                                    <Input
                                        placeholder="Ej. Windows 11 Pro, Office 2021"
                                        className="bg-slate-800 border-slate-700"
                                        value={softwareData.nombre}
                                        onChange={(e) => setSoftwareData({ ...softwareData, nombre: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Versión / Edición</Label>
                                    <Input
                                        placeholder="Ej. 64-bit, Home & Business"
                                        className="bg-slate-800 border-slate-700"
                                        value={softwareData.version}
                                        onChange={(e) => setSoftwareData({ ...softwareData, version: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Detalles adicionales</Label>
                                <Textarea
                                    placeholder="Tipo de licencia requerida, cantidad de equipos, etc..."
                                    className="bg-slate-800 border-slate-700 min-h-[100px]"
                                    value={softwareData.descripcion}
                                    onChange={(e) => setSoftwareData({ ...softwareData, descripcion: e.target.value })}
                                />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enviar Solicitud
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
