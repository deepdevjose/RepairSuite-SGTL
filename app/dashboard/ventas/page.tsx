"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"
import { AccessDenied } from "@/components/access-denied"
import { BadgeStatus } from "@/components/badge-status"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockSales = [
  {
    folio: "RS-OS-1024",
    cliente: "Juan Pérez",
    sucursal: "Sede A",
    total: 2500,
    pagado: 2500,
    saldo: 0,
    estado: "Pagado",
  },
  {
    folio: "RS-OS-1023",
    cliente: "María González",
    sucursal: "Sede A",
    total: 3200,
    pagado: 1600,
    saldo: 1600,
    estado: "Parcial",
  },
  {
    folio: "RS-OS-1022",
    cliente: "Pedro Ramírez",
    sucursal: "Sede B",
    total: 1800,
    pagado: 0,
    saldo: 1800,
    estado: "Pendiente",
  },
]

export default function VentasPage() {
  const { hasPermission, user } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentData, setPaymentData] = useState({
    monto: "",
    metodo_pago: "Efectivo",
    referencia: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!hasPermission("ventas")) {
    return (
      <>
        <DashboardHeader title="Ventas y Pagos" />
        <AccessDenied />
      </>
    )
  }

  const canRegisterPayment = user?.role === "Administrador" || user?.role === "Recepción"

  const validatePayment = () => {
    const newErrors: Record<string, string> = {}

    if (!paymentData.monto || Number(paymentData.monto) <= 0) {
      newErrors.monto = "El monto debe ser mayor a 0"
    }
    // Mock: check if amount exceeds balance
    if (Number(paymentData.monto) > 1600) {
      newErrors.monto = "El monto no puede exceder el saldo pendiente"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePaymentSubmit = () => {
    if (!validatePayment()) return

    toast({
      title: "Pago registrado",
      description: "El pago se ha registrado correctamente.",
    })
    setIsPaymentDialogOpen(false)
    setPaymentData({ monto: "", metodo_pago: "Efectivo", referencia: "" })
  }

  const filteredSales = mockSales.filter(
    (sale) =>
      sale.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.cliente.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <DashboardHeader title="Ventas y Pagos" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <Card className="bg-slate-900 border-slate-800 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar por folio o cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                />
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-slate-900 border-slate-800 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-500/10 p-3">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Total cobrado</div>
                  <div className="text-2xl font-bold text-slate-100">$4,100</div>
                </div>
              </div>
            </Card>
            <Card className="bg-slate-900 border-slate-800 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-500/10 p-3">
                  <DollarSign className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Por cobrar</div>
                  <div className="text-2xl font-bold text-slate-100">$3,400</div>
                </div>
              </div>
            </Card>
            <Card className="bg-slate-900 border-slate-800 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <DollarSign className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Total ventas</div>
                  <div className="text-2xl font-bold text-slate-100">$7,500</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-slate-900 border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">Folio OS</TableHead>
                  <TableHead className="text-slate-400">Cliente</TableHead>
                  <TableHead className="text-slate-400">Sucursal</TableHead>
                  <TableHead className="text-slate-400">Total</TableHead>
                  <TableHead className="text-slate-400">Pagado</TableHead>
                  <TableHead className="text-slate-400">Saldo</TableHead>
                  <TableHead className="text-slate-400">Estado</TableHead>
                  <TableHead className="text-slate-400">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.folio} className="border-slate-800 hover:bg-slate-800/50 text-slate-300">
                    <TableCell className="font-mono text-sm">{sale.folio}</TableCell>
                    <TableCell>{sale.cliente}</TableCell>
                    <TableCell className="text-slate-400">{sale.sucursal}</TableCell>
                    <TableCell className="font-semibold">${sale.total}</TableCell>
                    <TableCell className="text-green-400">${sale.pagado}</TableCell>
                    <TableCell className={sale.saldo > 0 ? "text-yellow-400" : "text-slate-400"}>
                      ${sale.saldo}
                    </TableCell>
                    <TableCell>
                      <BadgeStatus status={sale.estado} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="text-indigo-400 hover:text-indigo-300">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {canRegisterPayment && sale.saldo > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsPaymentDialogOpen(true)}
                            className="text-green-400 hover:text-green-300"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Pagar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Registrar pago</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-slate-800 rounded-lg">
              <div className="text-sm text-slate-400">Saldo pendiente</div>
              <div className="text-2xl font-bold text-slate-100">$1,600</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monto" className="text-slate-200">
                Monto a pagar <span className="text-red-400">*</span>
              </Label>
              <Input
                id="monto"
                type="number"
                value={paymentData.monto}
                onChange={(e) => setPaymentData({ ...paymentData, monto: e.target.value })}
                className={`bg-slate-800 border-slate-700 text-slate-100 ${errors.monto ? "border-red-500" : ""}`}
                placeholder="0.00"
              />
              {errors.monto && <p className="text-xs text-red-400">{errors.monto}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="metodo_pago" className="text-slate-200">
                Método de pago
              </Label>
              <Select
                value={paymentData.metodo_pago}
                onValueChange={(value) => setPaymentData({ ...paymentData, metodo_pago: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="Efectivo">Efectivo</SelectItem>
                  <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                  <SelectItem value="Transferencia">Transferencia</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referencia" className="text-slate-200">
                Referencia
              </Label>
              <Input
                id="referencia"
                value={paymentData.referencia}
                onChange={(e) => setPaymentData({ ...paymentData, referencia: e.target.value })}
                className="bg-slate-800 border-slate-700 text-slate-100"
                placeholder="Número de transacción, etc."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPaymentDialogOpen(false)}
                className="border-slate-700 text-slate-300"
              >
                Cancelar
              </Button>
              <Button onClick={handlePaymentSubmit} className="bg-green-600 hover:bg-green-500">
                Registrar pago
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
