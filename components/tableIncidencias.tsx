"use client"

import { useState } from "react"
import { Loader2, AlertCircle, FileText, Eye, RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Incidencia } from "@/types/Incidencias"
import { Justificante } from "@/types/justificante"
import { useJustificantesByIncidencia } from "@/hooks/useJustificantes"
import { ReplaceJustificanteModal } from "@/components/modalReplaceJustificante"

function formatFecha(fecha: string): string {
    if (!fecha) return "—"
    const [year, month, day] = fecha.split("T")[0].split("-")
    return `${day}/${month}/${year}`
}

// ─── Celda de justificante por incidencia ─────────────────────────────────────

function JustificanteCell({ id_incidencia }: { id_incidencia: number }) {
    const { justificantes, loading } = useJustificantesByIncidencia(id_incidencia)
    const [selected, setSelected] = useState<Justificante | null>(null)
    const [replaceOpen, setReplaceOpen] = useState(false)
    const { refetch } = useJustificantesByIncidencia(id_incidencia)

    const justificante = justificantes[0] ?? null // Tomar el más reciente

    if (loading) return <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground mx-auto" />

    return (
        <>
            {justificante ? (
                <div className="flex items-center justify-center gap-1.5">
                    <button
                        onClick={() => { setSelected(justificante); setReplaceOpen(true) }}
                        className="flex items-center gap-1 text-[11px] text-primary font-medium bg-primary/8 hover:bg-primary/15 px-2 py-1.5 rounded-lg transition-colors"
                    >
                        <Eye className="w-3 h-3" />Ver
                    </button>

                </div>
            ) : (
                <span className="text-[11px] text-muted-foreground/50 italic">Sin archivo</span>
            )}

            <ReplaceJustificanteModal
                open={replaceOpen}
                onClose={() => { setReplaceOpen(false); setSelected(null) }}
                onSuccess={() => { setReplaceOpen(false); setSelected(null); refetch() }}
                justificante={selected}
            />
        </>
    )
}

// ─── Tabla de incidencias ─────────────────────────────────────────────────────

interface IncidenciasTablaProps {
    incidencias: Incidencia[]
    loading: boolean
}

export function IncidenciasTabla({ incidencias, loading }: IncidenciasTablaProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="flex items-center justify-center py-14 gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Cargando incidencias...</span>
                </div>
            </div>
        )
    }

    if (incidencias.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="flex flex-col items-center justify-center py-14 gap-2 text-muted-foreground">
                    <AlertCircle className="w-8 h-8 opacity-30" /><p className="text-sm">No hay incidencias registradas</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary">
                        <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Incidencia</TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Fecha inicio</TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Fecha fin</TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Observaciones</TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Justificante</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {incidencias.map((inc) => (
                        <TableRow key={inc.id_incidencia} className="hover:bg-muted/30 border-b border-border/50">
                            <TableCell className="text-center py-3.5 text-sm font-medium">
                                {inc.tipoIncidencia?.nombre ?? `Tipo ${inc.id_tipo_incidencia}`}
                            </TableCell>
                            <TableCell className="text-center py-3.5 text-sm text-muted-foreground">
                                {formatFecha(inc.fecha_inicio)}
                            </TableCell>
                            <TableCell className="text-center py-3.5 text-sm text-muted-foreground">
                                {formatFecha(inc.fecha_fin)}
                            </TableCell>
                            <TableCell className="text-center py-3.5 text-sm text-muted-foreground max-w-[180px] truncate">
                                {inc.observaciones ?? "—"}
                            </TableCell>
                            <TableCell className="text-center py-3.5">
                                <JustificanteCell id_incidencia={inc.id_incidencia} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}