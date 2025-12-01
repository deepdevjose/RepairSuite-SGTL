import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Package, FileText, CheckCircle2, XCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PendingRequestsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PendingRequestsDialog({ open, onOpenChange }: PendingRequestsDialogProps) {
    const [activeTab, setActiveTab] = useState("tickets")
    const [tickets, setTickets] = useState<any[]>([])
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        if (open) {
            fetchData()
        }
    }, [open])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [resTickets, resRequests] = await Promise.all([
                fetch('/api/inventory/withdrawals/pending'),
                fetch('/api/inventory/requests?estado=Pendiente')
            ])

            if (resTickets.ok) {
                const data = await resTickets.json()
                setTickets(data)
            }

            if (resRequests.ok) {
                const data = await resRequests.json()
                setRequests(data)
            }
        } catch (error) {
            console.error("Error fetching pending items:", error)
            toast({
                title: "Error",
                description: "No se pudieron cargar las solicitudes pendientes",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateRequestStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/inventory/requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: status })
            })

            if (res.ok) {
                toast({
                    title: `Solicitud ${status}`,
                    description: `La solicitud ha sido marcada como ${status.toLowerCase()}.`
                })
                fetchData()
            } else {
                throw new Error("Error updating request")
            }
        } catch (error) {
            toast({ title: "Error", description: "No se pudo actualizar la solicitud", variant: "destructive" })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800 text-slate-100">
                <DialogHeader>
                    <DialogTitle>Solicitudes Pendientes</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Revisa los tickets de retiro y solicitudes de material pendientes.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="tickets" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-slate-800 border-slate-700 w-full grid grid-cols-2">
                        <TabsTrigger value="tickets" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                            Tickets de Retiro
                            {tickets.length > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-0">
                                    {tickets.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="requests" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            Solicitudes de Material
                            {requests.length > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-0">
                                    {requests.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[400px] mt-4 pr-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full py-12 text-slate-500">
                                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                                <p>Cargando...</p>
                            </div>
                        ) : (
                            <>
                                <TabsContent value="tickets" className="space-y-4 mt-0">
                                    {tickets.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500">
                                            <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                            <p>No hay tickets de retiro pendientes</p>
                                        </div>
                                    ) : (
                                        tickets.map((ticket) => (
                                            <Card key={ticket.id} className="p-4 bg-slate-800/50 border-slate-700">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-lg font-bold text-indigo-400 tracking-wider">
                                                                {ticket.codigo}
                                                            </span>
                                                            <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 bg-yellow-500/10">
                                                                Pendiente
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-slate-400 mt-1">
                                                            Solicitado por <span className="text-slate-200">{ticket.usuario.nombre}</span>
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {new Date(ticket.createdAt).toLocaleString('es-MX')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 bg-slate-900/50 p-3 rounded-md border border-slate-800">
                                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Items solicitados:</p>
                                                    {ticket.items.map((item: any) => (
                                                        <div key={item.id} className="flex justify-between text-sm">
                                                            <span className="text-slate-300">{item.producto.nombre}</span>
                                                            <span className="text-slate-400 font-mono">x{item.cantidad}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-3 text-xs text-slate-500 italic">
                                                    * Usa la barra de validación para aprobar este ticket
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </TabsContent>

                                <TabsContent value="requests" className="space-y-4 mt-0">
                                    {requests.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500">
                                            <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                            <p>No hay solicitudes de material pendientes</p>
                                        </div>
                                    ) : (
                                        requests.map((req) => (
                                            <Card key={req.id} className="p-4 bg-slate-800/50 border-slate-700">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-slate-200">{req.tipo} - {req.marca} {req.modelo}</h4>
                                                        <p className="text-sm text-slate-400 mt-1">{req.descripcion}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Badge variant="outline" className="border-blue-500/50 text-blue-500 bg-blue-500/10">
                                                                {req.estado}
                                                            </Badge>
                                                            <span className="text-xs text-slate-500">
                                                                • {req.usuario.nombre} • {new Date(req.createdAt).toLocaleDateString('es-MX')}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                                            onClick={() => handleUpdateRequestStatus(req.id, 'Aprobada')}
                                                            title="Marcar como Aprobada/Vista"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                            onClick={() => handleUpdateRequestStatus(req.id, 'Rechazada')}
                                                            title="Rechazar solicitud"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </TabsContent>
                            </>
                        )}
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
