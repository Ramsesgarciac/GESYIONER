"use client"

import { useState, useEffect } from "react"
import { X, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCatalogoEventos } from "@/hooks/useCatalogoEvento"
import { CreateEventoDto } from "@/types/Evento"
import { createEvento } from "../lib/services/Evento.service"
import { updateEmpleado } from "../lib/services/Empleado.service"

interface AddEventoModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    id_empleado: number
    cargoActual?: string
    salarioActual?: number
}

type FormState = {
    id_tipo_evento: number
    fecha_evento: string
    cargo_anterior: string
    cargo_nuevo: string
    salario_anterior: string
    salario_nuevo: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

export function AddEventoModal({
    open,
    onClose,
    onSuccess,
    id_empleado,
    cargoActual = "",
    salarioActual,
}: AddEventoModalProps) {
    const getInitialForm = (): FormState => ({
        id_tipo_evento: 0,
        fecha_evento: "",
        cargo_anterior: cargoActual,
        cargo_nuevo: "",
        salario_anterior: salarioActual ? String(salarioActual) : "",
        salario_nuevo: "",
    })

    const [form, setForm] = useState<FormState>(getInitialForm())
    const [tipoOpen, setTipoOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [submitError, setSubmitError] = useState<string | null>(null)

    const { catalogoEventos, loading: loadingCatalogo } = useCatalogoEventos()

    useEffect(() => {
        if (open) {
            setForm(prev => ({
                ...prev,
                cargo_anterior: cargoActual,
                salario_anterior: salarioActual ? String(salarioActual) : "",
            }))
        }
    }, [open, cargoActual, salarioActual])

    if (!open) return null

    const selectedTipo = catalogoEventos.find(t => t.id_tipo_evento === form.id_tipo_evento)

    const handleChange = (field: keyof FormState, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }))
        setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    const validate = (): boolean => {
        const newErrors: FormErrors = {}
        if (!form.id_tipo_evento) newErrors.id_tipo_evento = "Selecciona un tipo de evento"
        if (!form.fecha_evento) newErrors.fecha_evento = "La fecha del evento es requerida"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return
        setSubmitting(true)
        setSubmitError(null)
        try {
            // 1. Crear el evento
            const payload: CreateEventoDto = {
                id_empleado,
                id_tipo_evento: form.id_tipo_evento,
                fecha_evento: form.fecha_evento,
                cargo_anterior: form.cargo_anterior || undefined,
                cargo_nuevo: form.cargo_nuevo || undefined,
                salario_anterior: form.salario_anterior ? Number(form.salario_anterior) : undefined,
                salario_nuevo: form.salario_nuevo ? Number(form.salario_nuevo) : undefined,
            }
            await createEvento(payload)

            // 2. PATCH al empleado con cargo_nuevo y/o salario_nuevo si fueron llenados
            const patchEmpleado: Record<string, string | number> = {}
            if (form.cargo_nuevo.trim()) patchEmpleado.puesto = form.cargo_nuevo.trim()
            if (form.salario_nuevo) patchEmpleado.salario_actual = Number(form.salario_nuevo)

            if (Object.keys(patchEmpleado).length > 0) {
                await updateEmpleado(id_empleado, patchEmpleado)
            }

            onSuccess()
            handleClose()
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Error al registrar evento")
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        setForm(getInitialForm())
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
                    <h2 className="text-base font-semibold text-foreground">Registrar evento</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Agrega un evento a la hoja de vida</p>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {submitError && (
                        <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">
                            {submitError}
                        </div>
                    )}

                    {/* Tipo de evento */}
                    <Field label="Tipo de evento" error={errors.id_tipo_evento}>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setTipoOpen(p => !p)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg bg-white text-left hover:bg-muted/20 transition-colors ${errors.id_tipo_evento ? "border-destructive" : "border-input"}`}
                            >
                                <span className={selectedTipo ? "text-foreground" : "text-muted-foreground"}>
                                    {loadingCatalogo ? "Cargando tipos..." : selectedTipo?.nombre_evento ?? "Selecciona el tipo de evento"}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${tipoOpen ? "rotate-180" : ""}`} />
                            </button>
                            {tipoOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-44 overflow-y-auto">
                                    {catalogoEventos.length === 0 ? (
                                        <p className="px-3 py-2 text-sm text-muted-foreground">Sin tipos disponibles</p>
                                    ) : (
                                        catalogoEventos.map(tipo => (
                                            <button
                                                key={tipo.id_tipo_evento}
                                                type="button"
                                                onClick={() => { handleChange("id_tipo_evento", tipo.id_tipo_evento); setTipoOpen(false) }}
                                                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-muted/40 transition-colors ${form.id_tipo_evento === tipo.id_tipo_evento ? "bg-primary/10 text-primary font-medium" : "text-foreground"}`}
                                            >
                                                <p className="font-medium">{tipo.nombre_evento}</p>
                                                {tipo.descripcion && <p className="text-[11px] text-muted-foreground mt-0.5">{tipo.descripcion}</p>}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </Field>

                    {/* Fecha */}
                    <Field label="Fecha del evento" error={errors.fecha_evento}>
                        <Input
                            type="date"
                            value={form.fecha_evento}
                            onChange={e => handleChange("fecha_evento", e.target.value)}
                            className={errors.fecha_evento ? "border-destructive" : ""}
                        />
                    </Field>

                    {/* Cargos */}
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Cargo anterior">
                            <Input
                                placeholder="Cargo actual del empleado"
                                value={form.cargo_anterior}
                                onChange={e => handleChange("cargo_anterior", e.target.value)}
                            />
                        </Field>
                        <Field label="Cargo nuevo">
                            <Input
                                placeholder="Ej: Profesor Titular"
                                value={form.cargo_nuevo}
                                onChange={e => handleChange("cargo_nuevo", e.target.value)}
                            />
                        </Field>
                    </div>

                    {/* Salarios */}
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Salario anterior">
                            <Input
                                type="number"
                                placeholder="Salario actual"
                                value={form.salario_anterior}
                                onChange={e => handleChange("salario_anterior", e.target.value)}
                            />
                        </Field>
                        <Field label="Salario nuevo">
                            <Input
                                type="number"
                                placeholder="Ej: 20000"
                                value={form.salario_nuevo}
                                onChange={e => handleChange("salario_nuevo", e.target.value)}
                            />
                        </Field>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={handleClose} disabled={submitting}>
                        Cancelar
                    </Button>
                    <Button
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Guardando...</> : "Registrar"}
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