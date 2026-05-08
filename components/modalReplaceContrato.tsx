"use client"

import { useRef, useState } from "react"
import {
    X,
    Loader2,
    Upload,
    FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"

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
    const [error, setError] = useState<string | null>(null)

    const fileRef = useRef<HTMLInputElement>(null)

    if (!open) return null

    const handleClose = () => {
        setFile(null)
        setError(null)
        onClose()
    }

    const handleSubmit = async () => {

        if (!file) {
            setError("Selecciona un archivo PDF")
            return
        }

        try {

            setLoading(true)
            setError(null)

            await onReplace(id_contrato, file)

            onSuccess()
            handleClose()

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Error al reemplazar contrato"
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

                    <h2 className="text-base font-semibold text-foreground">
                        Reemplazar contrato
                    </h2>

                    <p className="text-xs text-muted-foreground mt-0.5">
                        El archivo actual será reemplazado
                    </p>

                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">

                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Archivo actual */}
                    <div className="rounded-xl border bg-muted/30 p-3">

                        <p className="text-[11px] text-muted-foreground mb-1">
                            Archivo actual
                        </p>

                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary shrink-0" />
                            <p className="text-sm font-medium truncate">
                                {nombre_archivo}
                            </p>
                        </div>

                    </div>

                    {/* Upload */}
                    <Field
                        label="Nuevo archivo PDF"
                        error={error ?? undefined}
                    >

                        <div
                            onClick={() => fileRef.current?.click()}
                            className={`
                border-2 border-dashed rounded-xl p-5 text-center
                cursor-pointer transition-all
                ${error
                                    ? "border-destructive"
                                    : "border-border hover:border-primary/50 hover:bg-muted/20"
                                }
              `}
                        >

                            {file ? (
                                <div className="flex items-center justify-center gap-2">
                                    <FileText className="w-4 h-4 text-primary shrink-0" />
                                    <p className="text-sm font-medium truncate">
                                        {file.name}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />

                                    <p className="text-sm text-muted-foreground">
                                        Haz clic para seleccionar PDF
                                    </p>

                                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                                        máximo 10MB
                                    </p>
                                </>
                            )}

                        </div>

                        <input
                            ref={fileRef}
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                                setFile(e.target.files?.[0] ?? null)
                                setError(null)
                            }}
                        />

                    </Field>

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
                                Reemplazando...
                            </>
                        ) : (
                            "Reemplazar"
                        )}

                    </Button>

                </div>

            </div>
        </div>
    )
}

function Field({
    label,
    error,
    children,
}: {
    label: string
    error?: string
    children: React.ReactNode
}) {

    return (
        <div className="space-y-1">

            <label className="text-xs font-medium text-foreground">
                {label}
            </label>

            {children}

            {error && (
                <p className="text-xs text-destructive">
                    {error}
                </p>
            )}

        </div>
    )
}