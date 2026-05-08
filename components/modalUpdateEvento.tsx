"use client"

import { useEffect, useState } from "react"
import { X, Loader2, CalendarDays, Briefcase, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Evento, UpdateEventoDto } from "@/types/Evento"

interface UpdateEventoModalProps {
    open: boolean
    onClose: () => void
    evento: Evento | null
    onUpdate: (id: number, dto: UpdateEventoDto) => Promise<any>
    onSuccess: () => void
}

export function UpdateEventoModal({
    open,
    onClose,
    evento,
    onUpdate,
    onSuccess,
}: UpdateEventoModalProps) {

    const [form, setForm] = useState({
        fecha_evento: "",
        cargo_anterior: "",
        cargo_nuevo: "",
        salario_anterior: "",
        salario_nuevo: "",
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (evento) {
            setForm({
                fecha_evento: evento.fecha_evento?.split("T")[0] ?? "",
                cargo_anterior: evento.cargo_anterior ?? "",
                cargo_nuevo: evento.cargo_nuevo ?? "",
                salario_anterior: evento.salario_anterior?.toString() ?? "",
                salario_nuevo: evento.salario_nuevo?.toString() ?? "",
            })
        }
    }, [evento])

    if (!open || !evento) return null

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            setError(null)

            await onUpdate(evento.id_evento, {
                fecha_evento: form.fecha_evento,
                cargo_anterior: form.cargo_anterior || null,
                cargo_nuevo: form.cargo_nuevo || null,
                salario_anterior: form.salario_anterior
                    ? Number(form.salario_anterior)
                    : null,
                salario_nuevo: form.salario_nuevo
                    ? Number(form.salario_nuevo)
                    : null,
            })

            onSuccess()

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error al actualizar evento"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-border">

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <h2 className="text-base font-semibold text-foreground">
                        Editar evento
                    </h2>

                    <p className="text-xs text-muted-foreground mt-0.5">
                        Modifica la información del evento
                    </p>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">

                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <Field label="Fecha del evento">
                        <div className="relative">
                            <CalendarDays className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />

                            <Input
                                type="date"
                                value={form.fecha_evento}
                                onChange={(e) =>
                                    handleChange("fecha_evento", e.target.value)
                                }
                                className="pl-9"
                            />
                        </div>
                    </Field>

                    <Field label="Cargo anterior">
                        <div className="relative">
                            <Briefcase className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />

                            <Input
                                value={form.cargo_anterior}
                                onChange={(e) =>
                                    handleChange("cargo_anterior", e.target.value)
                                }
                                className="pl-9"
                            />
                        </div>
                    </Field>

                    <Field label="Cargo nuevo">
                        <div className="relative">
                            <Briefcase className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />

                            <Input
                                value={form.cargo_nuevo}
                                onChange={(e) =>
                                    handleChange("cargo_nuevo", e.target.value)
                                }
                                className="pl-9"
                            />
                        </div>
                    </Field>

                    <div className="grid grid-cols-2 gap-3">

                        <Field label="Salario anterior">
                            <div className="relative">
                                <DollarSign className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />

                                <Input
                                    type="number"
                                    value={form.salario_anterior}
                                    onChange={(e) =>
                                        handleChange("salario_anterior", e.target.value)
                                    }
                                    className="pl-9"
                                />
                            </div>
                        </Field>

                        <Field label="Salario nuevo">
                            <div className="relative">
                                <DollarSign className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />

                                <Input
                                    type="number"
                                    value={form.salario_nuevo}
                                    onChange={(e) =>
                                        handleChange("salario_nuevo", e.target.value)
                                    }
                                    className="pl-9"
                                />
                            </div>
                        </Field>

                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">

                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>

                    <Button
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Guardar cambios"
                        )}
                    </Button>

                </div>
            </div>
        </div>
    )
}

function Field({
    label,
    children
}: {
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">
                {label}
            </label>

            {children}
        </div>
    )
}