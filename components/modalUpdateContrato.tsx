"use client"

import { useEffect, useState } from "react"

import {
    X,
    Loader2,
    CalendarDays,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Contrato,
    UpdateContratoDto,
} from "@/types/Contrato"

interface Props {
    open: boolean
    onClose: () => void
    contrato: Contrato | null
    onUpdate: (
        id: number,
        dto: UpdateContratoDto
    ) => Promise<any>
    onSuccess: () => void
}

export function UpdateContratoModal({
    open,
    onClose,
    contrato,
    onUpdate,
    onSuccess,
}: Props) {

    const [fecha_inicio, setFechaInicio] = useState("")
    const [fecha_fin, setFechaFin] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // ✅ SINCRONIZA LAS FECHAS
    useEffect(() => {

        if (contrato) {

            setFechaInicio(
                contrato.fecha_inicio.split("T")[0]
            )

            setFechaFin(
                contrato.fecha_fin.split("T")[0]
            )

        }

    }, [contrato])

    if (!open || !contrato) return null

    const handleClose = () => {
        setError(null)
        onClose()
    }

    const handleSubmit = async () => {

        try {

            setLoading(true)
            setError(null)

            await onUpdate(
                contrato.id_contrato,
                {
                    fecha_inicio,
                    fecha_fin,
                }
            )

            onSuccess()
            handleClose()

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Error al actualizar contrato"
            )

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4">

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-border">

                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">

                        <CalendarDays className="w-4 h-4 text-primary" />

                        <h2 className="text-base font-semibold text-foreground">
                            Editar contrato
                        </h2>

                    </div>

                    <p className="text-xs text-muted-foreground mt-0.5">
                        Modifica las fechas del contrato
                    </p>

                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">

                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">

                        <Field label="Fecha inicio">

                            <Input
                                type="date"
                                value={fecha_inicio}
                                onChange={(e) =>
                                    setFechaInicio(e.target.value)
                                }
                            />

                        </Field>

                        <Field label="Fecha fin">

                            <Input
                                type="date"
                                value={fecha_fin}
                                onChange={(e) =>
                                    setFechaFin(e.target.value)
                                }
                            />

                        </Field>

                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">

                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleClose}
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
                            "Guardar"
                        )}

                    </Button>

                </div>

            </div>
        </div>
    )
}

function Field({
    label,
    children,
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