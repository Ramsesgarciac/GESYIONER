"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"

interface Props {
    open: boolean
    onClose: () => void
    id_contrato: number
    nombre_archivo: string
    onReplace: (id: number, file: File) => Promise<any>
    onSuccess: () => void
}

export function ReplaceContratoModal({
    open,
    onClose,
    id_contrato,
    nombre_archivo,
    onReplace,
    onSuccess,
}: Props) {

    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    if (!open) return null

    const handleSubmit = async () => {
        if (!file) {
            alert("Selecciona un archivo")
            return
        }

        try {
            setLoading(true)

            await onReplace(id_contrato, file)

            onSuccess()
        } catch (error) {
            console.error(error)
            alert("Error al reemplazar archivo")
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

                <h2 className="text-lg font-semibold mb-2">
                    Reemplazar contrato
                </h2>

                <p className="text-sm text-muted-foreground mb-4">
                    {nombre_archivo}
                </p>

                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                        setFile(e.target.files?.[0] ?? null)
                    }
                    className="mb-4"
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-primary text-white rounded-lg py-2"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Reemplazando...
                        </span>
                    ) : (
                        "Reemplazar archivo"
                    )}
                </button>
            </div>
        </div>
    )
}