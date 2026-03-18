"use client"

import { useState } from "react"
import { X, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTiposIncidencias } from "@/hooks/useTipoIncidencia"
import { CreateIncidenciaDto } from "@/types/Incidencias"
import { createIncidencia } from "../lib/services/IncidenciaService.service"

interface AddIncidenciaModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    id_empleado: number
}

const INITIAL_FORM: Omit<CreateIncidenciaDto, 'id_empleado'> = {
    id_tipo_incidencia: 0,
    fecha_inicio: "",
    fecha_fin: "",
    observaciones: "",
}

type FormErrors = Partial<Record<keyof typeof INITIAL_FORM, string>>

export function AddIncidenciaModal({ open, onClose, onSuccess, id_empleado }: AddIncidenciaModalProps) {
    const [form, setForm] = useState(INITIAL_FORM)
    const [tipoOpen, setTipoOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [submitError, setSubmitError] = useState<string | null>(null)

    const { tiposIncidencias, loading: loadingTipos } = useTiposIncidencias()

    if (!open) return null

    const selectedTipo = tiposIncidencias.find(t => t.id_tipo_incidencia === form.id_tipo_incidencia)

    const handleChange = (field: keyof typeof INITIAL_FORM, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }))
        setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    const validate = (): boolean => {
        const newErrors: FormErrors = {}
        if (!form.id_tipo_incidencia) newErrors.id_tipo_incidencia = "Selecciona un tipo de incidencia"
        if (!form.fecha_inicio) newErrors.fecha_inicio = "La fecha de inicio es requerida"
        if (!form.fecha_fin) newErrors.fecha_fin = "La fecha de fin es requerida"
        if (form.fecha_inicio && form.fecha_fin && form.fecha_fin < form.fecha_inicio)
            newErrors.fecha_fin = "La fecha fin no puede ser menor a la fecha inicio"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return
        setSubmitting(true)
        setSubmitError(null)
        try {
            await createIncidencia({
                id_empleado,
                id_tipo_incidencia: form.id_tipo_incidencia,
                fecha_inicio: form.fecha_inicio,
                fecha_fin: form.fecha_fin,
                observaciones: form.observaciones || undefined,
            })
            onSuccess()
            handleClose()
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Error al registrar incidencia")
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        setForm(INITIAL_FORM)
        setErrors({})
        setSubmitError(null)
        setTipoOpen(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-border">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <h2 className="text-base font-semibold text-foreground">Registrar incidencia</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Completa los datos de la incidencia</p>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {submitError && (
                        <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">
                            {submitError}
                        </div>
                    )}

                    {/* Tipo de incidencia */}
                    <Field label="Tipo de incidencia" error={errors.id_tipo_incidencia}>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setTipoOpen(p => !p)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg bg-white text-left hover:bg-muted/20 transition-colors ${errors.id_tipo_incidencia ? "border-destructive" : "border-input"
                                    }`}
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
                                                onClick={() => {
                                                    handleChange("id_tipo_incidencia", tipo.id_tipo_incidencia)
                                                    setTipoOpen(false)
                                                }}
                                                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-muted/40 transition-colors ${form.id_tipo_incidencia === tipo.id_tipo_incidencia
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "text-foreground"
                                                    }`}
                                            >
                                                <p className="font-medium">{tipo.nombre}</p>
                                                {tipo.descripcion && (
                                                    <p className="text-[11px] text-muted-foreground mt-0.5">{tipo.descripcion}</p>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </Field>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Fecha inicio" error={errors.fecha_inicio}>
                            <Input
                                type="date"
                                value={form.fecha_inicio}
                                onChange={e => handleChange("fecha_inicio", e.target.value)}
                                className={errors.fecha_inicio ? "border-destructive" : ""}
                            />
                        </Field>
                        <Field label="Fecha fin" error={errors.fecha_fin}>
                            <Input
                                type="date"
                                value={form.fecha_fin}
                                onChange={e => handleChange("fecha_fin", e.target.value)}
                                className={errors.fecha_fin ? "border-destructive" : ""}
                            />
                        </Field>
                    </div>

                    {/* Observaciones */}
                    <Field label="Observaciones (opcional)">
                        <textarea
                            placeholder="Escribe alguna observación..."
                            value={form.observaciones}
                            onChange={e => handleChange("observaciones", e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-white resize-none focus:outline-none focus:ring-2 focus:ring-ring/30 placeholder:text-muted-foreground"
                        />
                    </Field>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleClose}
                        disabled={submitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Guardando...</>
                        ) : "Registrar"}
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