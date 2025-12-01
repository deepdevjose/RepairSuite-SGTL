"use client"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Ticket, Printer, Download, X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface WithdrawalTicketDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    ticket: {
        codigo: string
        items: {
            producto: {
                nombre: string
                sku: string
            }
            cantidad: number
        }[]
        usuario: {
            nombre: string
        }
        fechaExpiracion: string | Date
        createdAt: string | Date
    } | null
}

export function WithdrawalTicketDialog({ open, onOpenChange, ticket }: WithdrawalTicketDialogProps) {
    const [showExitConfirm, setShowExitConfirm] = useState(false)
    const ticketRef = useRef<HTMLDivElement>(null)

    if (!ticket) return null

    const handlePrint = () => {
        const printContent = ticketRef.current
        if (!printContent) return

        // Create a hidden iframe for printing
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        document.body.appendChild(iframe)

        const doc = iframe.contentWindow?.document
        if (!doc) return

        // Write the ticket content and styles to the iframe
        doc.open()
        doc.write(`
            <html>
                <head>
                    <title>Ticket de Retiro - ${ticket.codigo}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
                        .ticket-container { 
                            max-width: 320px; 
                            margin: 0 auto; 
                            border: 1px solid #e2e8f0; 
                            border-radius: 8px; 
                            padding: 20px;
                            position: relative;
                        }
                        .circle {
                            width: 24px;
                            height: 24px;
                            background-color: white;
                            border-radius: 50%;
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                            border: 1px solid #e2e8f0;
                        }
                        .circle-left { left: -12px; border-right-color: transparent; }
                        .circle-right { right: -12px; border-left-color: transparent; }
                    </style>
                </head>
                <body>
                    ${printContent.outerHTML}
                    <script>
                        window.onload = () => {
                            window.print();
                            window.onafterprint = () => {
                                window.frameElement.remove();
                            };
                        };
                    </script>
                </body>
            </html>
        `)
        doc.close()
    }

    const handleCloseAttempt = () => {
        setShowExitConfirm(true)
    }

    const handleConfirmClose = () => {
        setShowExitConfirm(false)
        onOpenChange(false)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={(val) => !val && handleCloseAttempt()}>
                <DialogContent className="bg-slate-900 border-white/10 text-slate-100 sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Ticket className="h-5 w-5 text-indigo-400" />
                            Ticket de Retiro
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Comparte este código con el administrador para que autorice la salida del material.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Ticket Visual Representation */}
                    <div className="flex flex-col items-center py-4 gap-4">
                        <div
                            ref={ticketRef}
                            className="bg-white text-slate-900 p-6 rounded-lg shadow-lg w-full max-w-[320px] relative overflow-hidden"
                        >
                            {/* Decorative circles for "ticket" look */}
                            <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-900 rounded-full" />
                            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-slate-900 rounded-full" />

                            <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
                                <h3 className="font-bold text-lg uppercase tracking-wider">Vale de Salida</h3>
                                <p className="text-xs text-slate-500">RepairSuite SGTL</p>
                            </div>

                            <div className="space-y-4">
                                <div className="text-center">
                                    <p className="text-xs text-slate-500 uppercase">Código de Verificación</p>
                                    <p className="text-4xl font-mono font-bold tracking-widest text-indigo-600 my-2">
                                        {ticket.codigo}
                                    </p>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b border-slate-100 pb-2">
                                        <span className="text-slate-500">Solicitante:</span>
                                        <span className="font-medium">{ticket.usuario.nombre}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-xs text-slate-500 uppercase font-semibold">Items:</span>
                                        {ticket.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-start text-xs">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.producto.nombre}</span>
                                                    <span className="text-slate-400 font-mono text-[10px]">{item.producto.sku}</span>
                                                </div>
                                                <span className="font-bold whitespace-nowrap">x {item.cantidad}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
                                        <span className="text-slate-500">Fecha:</span>
                                        <span>{format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t-2 border-dashed border-slate-300 text-center">
                                    <p className="text-[10px] text-slate-400">
                                        Válido hasta: {format(new Date(ticket.fechaExpiracion), "dd/MM/yyyy HH:mm", { locale: es })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center max-w-[320px] space-y-1">
                            <p className="text-xs text-slate-400">
                                💡 Puedes descargar el PDF y enviarlo por WhatsApp o tomar una foto.
                            </p>
                            <p className="text-[10px] text-emerald-400 font-medium flex items-center justify-center gap-1">
                                <span>🌱</span> Ayudemos a cuidar el medio ambiente
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={handlePrint} className="gap-2 border-slate-700 hover:bg-slate-800 text-slate-300">
                            <Printer className="h-4 w-4" />
                            Imprimir
                        </Button>
                        <Button onClick={handleCloseAttempt} className="bg-indigo-600 hover:bg-indigo-700">
                            Cerrar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
                <AlertDialogContent className="bg-slate-900 border-white/10 text-slate-100">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro que quieres salir?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Asegúrate de haber guardado o impreso tu código de retiro. Si lo pierdes, tendrás que consultarlo en tu historial.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmClose} className="bg-indigo-600 hover:bg-indigo-700">Salir</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
