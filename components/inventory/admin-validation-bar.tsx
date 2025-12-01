"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Loader2, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export function AdminValidationBar() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [pendingTickets, setPendingTickets] = useState<any[]>([])

    // Fetch pending tickets on mount
    useEffect(() => {
        fetchPendingTickets()
    }, [])

    async function fetchPendingTickets() {
        try {
            const res = await fetch('/api/inventory/withdrawals/pending')
            if (res.ok) {
                const data = await res.json()
                setPendingTickets(data)
            }
        } catch (error) {
            console.error("Error fetching pending tickets:", error)
        }
    }

    const handleValidate = async (ticketCode?: string) => {
        const codeToValidate = ticketCode || code
        if (!codeToValidate || codeToValidate.length < 6) {
            toast({
                title: "Código inválido",
                description: "El código debe tener al menos 6 caracteres.",
                variant: "destructive"
            })
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/inventory/withdrawals/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    codigo: codeToValidate.toUpperCase(),
                    adminId: user?.id
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al validar ticket')
            }

            toast({
                title: "¡Retiro Validado!",
                description: `Ticket completado. Stock descontado correctamente.`,
                variant: "default",
                className: "bg-green-600 border-green-500 text-white"
            })

            setCode("")
            fetchPendingTickets() // Refresh pending list
            // Ideally trigger a refresh of the inventory list here if needed

        } catch (error: any) {
            toast({
                title: "Error de validación",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4 mb-6">
            <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-4 animate-fade-in-up">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-full">
                            <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-indigo-100">Validación de Salidas</h3>
                            <p className="text-xs text-indigo-300">Ingresa el código del ticket para confirmar el retiro</p>
                        </div>
                    </div>

                    <div className="flex w-full sm:w-auto items-center gap-2">
                        <div className="relative w-full sm:w-48">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                            <Input
                                placeholder="CÓDIGO"
                                className="pl-9 bg-indigo-950/50 border-indigo-500/30 text-indigo-100 placeholder:text-indigo-400/50 uppercase font-mono tracking-wider"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                maxLength={6}
                            />
                        </div>
                        <Button
                            onClick={() => handleValidate()}
                            disabled={loading || !code}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Validar"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Pending Requests List */}
            {pendingTickets.length > 0 && (
                <div className="bg-slate-900/40 border border-white/5 rounded-lg p-4 animate-fade-in-up">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 text-amber-400 animate-spin" />
                        Solicitudes Pendientes ({pendingTickets.length})
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {pendingTickets.map((ticket) => (
                            <div key={ticket.id} className="bg-slate-800/50 border border-white/5 rounded p-3 flex justify-between items-center group hover:bg-slate-800 transition-colors">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-indigo-400">{ticket.codigo}</span>
                                        <span className="text-xs text-slate-500">by {ticket.usuario.nombre.split(' ')[0]}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        {ticket.items.length} items: {ticket.items.map((i: any) => i.producto.nombre).join(', ').substring(0, 20)}...
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => handleValidate(ticket.codigo)}
                                    disabled={loading}
                                    className="h-8 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    Aprobar
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
