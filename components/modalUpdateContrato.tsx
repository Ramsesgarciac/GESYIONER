"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Contrato, UpdateContratoDto } from "@/types/Contrato"

interface Props {
    open: boolean
    onClose: () => void
    contrato: Contrato | null
    onUpdate: (id: number, dto: UpdateContratoDto) => Promise<any>
    onSuccess: () => void
}

export function UpdateContratoModal({
    open,
    onClose,
    contrato,
    onUpdate,
    onSuccess,
}: Props) {
    const [loading, setLoading] = useState(false)

    const [fecha_inicio, setFechaInicio] = useState(
        contrato?.fecha_inicio?.split("T")[0] ?? ""
    )

    const [fecha_fin, setFechaFin] = useState(
        contrato?.fecha_fin?.split("T")[0] ?? ""
    )

    const [id_tipo_contrato, setIdTipoContrato] = useState(
        contrato?.id_tipo_contrato ?? 0
    )

    if (!open || !contrato) return null

    const handleSubmit = async () => {
        try {
            setLoading(true)

            await onUpdate(contrato.id_contrato, {
                fecha_inicio,
                fecha_fin,
            })

            onSuccess()
        } catch (error) {
            console.error(error)
            alert("Error al actualizar contrato")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl p-6 w-full max-w-md">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4"
                >
                    <X className="w-4 h-4" />
                </button>

                <h2 className="text-lg font-semibold mb-5">
                    Editar contrato
                </h2>

                <div className="space-y-4">

                    <div>
                        <label className="text-sm">Fecha inicio</label>
                        <input
                            type="date"
                            value={fecha_inicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm">Fecha fin</label>
                        <input
                            type="date"
                            value={fecha_fin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-primary text-white rounded-lg py-2"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Guardando...
                            </span>
                        ) : (
                            "Guardar cambios"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}