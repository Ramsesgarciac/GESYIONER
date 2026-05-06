"use client"

import { useState } from "react"
import { Loader2, AlertCircle, Eye, Pencil, X, ChevronDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Incidencia, UpdateIncidenciaDto } from "@/types/Incidencias"
import { Justificante } from "@/types/justificante"
import { useJustificantesByIncidencia } from "@/hooks/useJustificantes"
import { useTiposIncidencias } from "@/hooks/useTipoIncidencia"
import { ReplaceJustificanteModal } from "@/components/modalReplaceJustificante"

function formatFecha(fecha: string): string {
    if (!fecha) return "—"
    const [year, month, day] = fecha.split("T")[0].split("-")
    return `${day}/${month}/${year}`
}

function toDateInput(fecha: string): string {
    return fecha ? fecha.split("T")[0] : ""
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
    canEdit?: boolean
    onUpdate?: (id: number, dto: UpdateIncidenciaDto) => Promise<Incidencia>
}

const INITIAL_EDIT_FORM = {
    id_tipo_incidencia: 0,
    fecha_inicio: "",
    fecha_fin: "",
    observaciones: "",
}

type EditForm = typeof INITIAL_EDIT_FORM
type EditFormErrors = Partial<Record<keyof EditForm, string>>

export function IncidenciasTabla({ incidencias, loading, canEdit = false, onUpdate }: IncidenciasTablaProps) {
    const [editingIncidencia, setEditingIncidencia] = useState<Incidencia | null>(null)
    const { tiposIncidencias } = useTiposIncidencias()

    const getTipoNombre = (incidencia: Incidencia) => {
        return tiposIncidencias.find(tipo => Number(tipo.id_tipo_incidencia) === Number(incidencia.id_tipo_incidencia))?.nombre
            ?? incidencia.tipoIncidencia?.nombre
            ?? `Tipo ${incidencia.id_tipo_incidencia}`
    }

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
                        {canEdit && onUpdate && (
                            <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Acciones</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {incidencias.map((inc) => (
                        <TableRow key={inc.id_incidencia} className="hover:bg-muted/30 border-b border-border/50">
                            <TableCell className="text-center py-3.5 text-sm font-medium">
                                {getTipoNombre(inc)}
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
                            {canEdit && onUpdate && (
                                <TableCell className="text-center py-3.5">
                                    <button
                                        type="button"
                                        onClick={() => setEditingIncidencia(inc)}
                                        className="inline-flex items-center gap-1 text-[11px] text-primary font-medium bg-primary/8 hover:bg-primary/15 px-2.5 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Pencil className="w-3 h-3" />
                                        Editar
                                    </button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {editingIncidencia && onUpdate && (
                <EditIncidenciaModal
                    incidencia={editingIncidencia}
                    onClose={() => setEditingIncidencia(null)}
                    onSave={async (id, dto) => {
                        await onUpdate(id, dto)
                        setEditingIncidencia(null)
                    }}
                />
            )}
        </div>
    )
}

function EditIncidenciaModal({
    incidencia,
    onClose,
    onSave,
}: {
    incidencia: Incidencia
    onClose: () => void
    onSave: (id: number, dto: UpdateIncidenciaDto) => Promise<void>
}) {
    const [form, setForm] = useState<EditForm>({
        id_tipo_incidencia: Number(incidencia.id_tipo_incidencia),
        fecha_inicio: toDateInput(incidencia.fecha_inicio),
        fecha_fin: toDateInput(incidencia.fecha_fin),
        observaciones: incidencia.observaciones ?? "",
    })
    const [tipoOpen, setTipoOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<EditFormErrors>({})
    const [submitError, setSubmitError] = useState<string | null>(null)

    const { tiposIncidencias, loading: loadingTipos } = useTiposIncidencias()
    const selectedTipo = tiposIncidencias.find(t => Number(t.id_tipo_incidencia) === Number(form.id_tipo_incidencia))

    const handleChange = (field: keyof EditForm, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }))
        setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    const validate = () => {
        const newErrors: EditFormErrors = {}
        if (!form.id_tipo_incidencia) newErrors.id_tipo_incidencia = "Selecciona un tipo de incidencia"
        if (!form.fecha_inicio) newErrors.fecha_inicio = "La fecha de inicio es requerida"
        if (!form.fecha_fin) newErrors.fecha_fin = "La fecha de fin es requerida"
        if (form.fecha_inicio && form.fecha_fin && form.fecha_fin < form.fecha_inicio) {
            newErrors.fecha_fin = "La fecha fin no puede ser menor a la fecha inicio"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return
        setSubmitting(true)
        setSubmitError(null)
        try {
            await onSave(incidencia.id_incidencia, {
                id_empleado: incidencia.id_empleado,
                id_tipo_incidencia: Number(form.id_tipo_incidencia),
                fecha_inicio: form.fecha_inicio,
                fecha_fin: form.fecha_fin,
                observaciones: form.observaciones,
            })
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Error al actualizar incidencia")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-border">
                    <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                    <h2 className="text-base font-semibold text-foreground">Editar incidencia</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Actualiza los datos registrados</p>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {submitError && (
                        <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">{submitError}</div>
                    )}

                    <Field label="Tipo de incidencia" error={errors.id_tipo_incidencia}>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setTipoOpen(p => !p)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg bg-white text-left hover:bg-muted/20 transition-colors ${errors.id_tipo_incidencia ? "border-destructive" : "border-input"}`}
                            >
                                <span className={selectedTipo ? "text-foreground" : "text-muted-foreground"}>
                                    {loadingTipos ? "Cargando tipos..." : selectedTipo?.nombre ?? "Selecciona el tipo de incidencia"}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${tipoOpen ? "rotate-180" : ""}`} />
                            </button>
                            {tipoOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-44 overflow-y-auto">
                                    {tiposIncidencias.length === 0 ? (
                                        <p className="px-3 py-2 text-sm text-muted-foreground">Sin tipos disponibles</p>
                                    ) : (
                                        tiposIncidencias.map(tipo => (
                                            <button
                                                key={tipo.id_tipo_incidencia}
                                                type="button"
                                                onClick={() => { handleChange("id_tipo_incidencia", Number(tipo.id_tipo_incidencia)); setTipoOpen(false) }}
                                                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-muted/40 transition-colors ${Number(form.id_tipo_incidencia) === Number(tipo.id_tipo_incidencia) ? "bg-primary/10 text-primary font-medium" : "text-foreground"}`}
                                            >
                                                <p className="font-medium">{tipo.nombre}</p>
                                                {tipo.descripcion && <p className="text-[11px] text-muted-foreground mt-0.5">{tipo.descripcion}</p>}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Fecha inicio" error={errors.fecha_inicio}>
                            <Input type="date" value={form.fecha_inicio} onChange={e => handleChange("fecha_inicio", e.target.value)} className={errors.fecha_inicio ? "border-destructive" : ""} />
                        </Field>
                        <Field label="Fecha fin" error={errors.fecha_fin}>
                            <Input type="date" value={form.fecha_fin} onChange={e => handleChange("fecha_fin", e.target.value)} className={errors.fecha_fin ? "border-destructive" : ""} />
                        </Field>
                    </div>

                    <Field label="Motivo (opcional)">
                        <textarea
                            placeholder="Escribe los motivos..."
                            value={form.observaciones}
                            onChange={e => handleChange("observaciones", e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-white resize-none focus:outline-none focus:ring-2 focus:ring-ring/30 placeholder:text-muted-foreground"
                        />
                    </Field>
                </div>

                <div className="px-6 pb-6 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={submitting}>Cancelar</Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Guardando...</> : "Guardar"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">{label}</label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    )
}
