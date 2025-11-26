import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener estadísticas agregadas (KPIs)
export async function GET() {
  try {
    // Obtener todos los dispositivos activos
    const dispositivos = await prisma.dispositivoTecnologico.findMany({
      where: { activo: true }
    })

    if (dispositivos.length === 0) {
      return NextResponse.json({
        totalConsumoKwh: 0,
        totalHuellaOperativa: 0,
        totalHuellaMateriales: 0,
        totalHuella: 0,
        dispositivosActivos: 0,
        promedioConsumoDispositivo: 0,
        dispositivosPorTipo: []
      })
    }

    // Calcular totales
    const totalConsumoKwh = dispositivos.reduce((sum, d) => 
      sum + Number(d.consumoKwhMensual), 0
    )
    const totalHuellaOperativa = dispositivos.reduce((sum, d) => 
      sum + Number(d.huellaOperativaMensual), 0
    )
    const totalHuellaMateriales = dispositivos.reduce((sum, d) => 
      sum + Number(d.huellaMaterialesMensual), 0
    )
    const totalHuella = totalHuellaOperativa + totalHuellaMateriales

    // Calcular promedio
    const promedioConsumoDispositivo = totalConsumoKwh / dispositivos.length

    // Agrupar por tipo
    const dispositivosPorTipo = dispositivos.reduce((acc: any[], d) => {
      const existing = acc.find(item => item.tipo === d.tipo)
      if (existing) {
        existing.cantidad += 1
        existing.consumoTotal += Number(d.consumoKwhMensual)
        existing.huellaTotal += Number(d.huellaTotalMensual)
      } else {
        acc.push({
          tipo: d.tipo,
          cantidad: 1,
          consumoTotal: Number(d.consumoKwhMensual),
          huellaTotal: Number(d.huellaTotalMensual)
        })
      }
      return acc
    }, [])

    // Ordenar por huella total descendente
    dispositivosPorTipo.sort((a, b) => b.huellaTotal - a.huellaTotal)

    return NextResponse.json({
      totalConsumoKwh: Math.round(totalConsumoKwh * 100) / 100,
      totalHuellaOperativa: Math.round(totalHuellaOperativa * 100) / 100,
      totalHuellaMateriales: Math.round(totalHuellaMateriales * 100) / 100,
      totalHuella: Math.round(totalHuella * 100) / 100,
      dispositivosActivos: dispositivos.length,
      promedioConsumoDispositivo: Math.round(promedioConsumoDispositivo * 100) / 100,
      dispositivosPorTipo
    })
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
