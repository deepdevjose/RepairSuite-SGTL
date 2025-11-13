import { ShieldAlert } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AccessDenied() {
  return (
    <div className="flex min-h-[600px] items-center justify-center p-4">
      <Card className="max-w-md bg-slate-900 border-slate-800 p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-red-500/10 p-4">
            <ShieldAlert className="h-12 w-12 text-red-500" />
          </div>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-100">Acceso Denegado</h2>
        <p className="mb-6 text-slate-400">
          No tienes permisos para acceder a esta sección. Contacta a tu administrador si necesitas acceso.
        </p>
        <Link href="/dashboard">
          <Button className="bg-indigo-600 hover:bg-indigo-500">Volver al Dashboard</Button>
        </Link>
      </Card>
    </div>
  )
}
