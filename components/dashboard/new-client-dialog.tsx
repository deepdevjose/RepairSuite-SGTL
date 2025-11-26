"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ClientForm } from "@/components/client-form"

interface NewClientDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave?: (client: any) => void
}

export function NewClientDialog({ open, onOpenChange, onSave }: NewClientDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Registrar Nuevo Cliente</DialogTitle>
                </DialogHeader>

                <ClientForm 
                    onClose={() => onOpenChange(false)}
                    onSave={onSave}
                />
            </DialogContent>
        </Dialog>
    )
}
