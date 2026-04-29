"use client"

import { Loader2, AlertCircle, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FaltaAdministrativa } from "@/types/falta-administrativa"
import { deleteFaltaAdministrativa } from "@/lib/services/FaltaAdministrativa.service"

function formatFecha(fecha: string): string {
    if (!fecha) return "—"
    const [year, month, day] = fecha.split("T")[0].split("-")
    return `${day}/${month}/${year}`
}

interface FaltasAdministrativasTablaProps {
    faltas: FaltaAdministrativa[]
    loading: boolean
    onRefetch: () => void
}

export function FaltasAdministrativasTabla({ faltas, loading, onRefetch }: FaltasAdministrativasTablaProps) {
    const handleDelete = async (id: number) => {
        if (!confirm("¿Eliminar esta falta administrativa?")) return
        try {
            await deleteFaltaAdministrativa(id)
            onRefetch()
        } catch (error) {
            console.error(error)
            alert("Error al eliminar la falta")
        }
    }

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="flex items-center justify-center py-14 gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Cargando faltas administrativas...</span>
                </div>
            </div>
        )
    }

    if (faltas.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="flex flex-col items-center justify-center py-14 gap-2 text-muted-foreground">
                    <AlertCircle className="w-8 h-8 opacity-30" /><p className="text-sm">No hay faltas administrativas registradas</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary">
                        <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Nombre</TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Fecha</TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Motivo</TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Sanción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {faltas.map((falta) => (
                        <TableRow key={falta.id_falta_administrativa} className="hover:bg-muted/30 border-b border-border/50">
                            <TableCell className="text-center py-3.5 text-sm font-medium">
                                {falta.nombre}
                            </TableCell>
                            <TableCell className="text-center py-3.5 text-sm text-muted-foreground">
                                {formatFecha(falta.fecha)}
                            </TableCell>
                            <TableCell className="text-center py-3.5 text-sm text-muted-foreground max-w-[200px] truncate">
                                {falta.motivo}
                            </TableCell>
                            <TableCell className="text-center py-3.5 text-sm text-muted-foreground">
                                {falta.sancion ?? "—"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
