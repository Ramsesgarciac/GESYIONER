"use client"

import { useState, useRef } from "react"
import { X, Upload, FileText, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadJustificante } from "@/lib/services/Justificante.service"

interface AddJustificanteModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    id_incidencia: number
    // Texto descriptivo para mostrar al usuario qué incidencia es
    descripcionIncidencia?: string
}

export function AddJustificanteModal({
    open,
    onClose,
    onSuccess,
    id_incidencia,
    descripcionIncidencia,
}: AddJustificanteModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement | null>(null)

    if (!open) return null

    const handleFileChange = (f: File | null) => {
        setFile(f)
        setError(null)
        setUploaded(false)
    }

    const handleUpload = async () => {
        if (!file) return
        setUploading(true)
        setError(null)
        try {
            await uploadJustificante(id_incidencia, file)
            setUploaded(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al subir justificante')
        } finally {
            setUploading(false)
        }
    }

    const handleClose = () => {
        setFile(null)
        setUploaded(false)
        setError(null)
        onClose()
    }

    const handleFinish = () => {
        onSuccess()
        handleClose()
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
                    <h2 className="text-base font-semibold text-foreground">Subir justificante</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {descripcionIncidencia
                            ? `Justificante para: ${descripcionIncidencia}`
                            : `Incidencia #${id_incidencia}`}
                    </p>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {!uploaded ? (
                        <>
                            {error && (
                                <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Área de selección */}
                            <input
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                ref={fileRef}
                                onChange={e => handleFileChange(e.target.files?.[0] ?? null)}
                            />

                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className={`w-full flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed rounded-xl transition-colors ${file
                                    ? "border-primary/40 bg-primary/4"
                                    : "border-border bg-gray-50/60 hover:border-primary/30 hover:bg-muted/20"
                                    }`}
                            >
                                <FileText className={`w-8 h-8 ${file ? "text-primary" : "text-muted-foreground/40"}`} />
                                {file ? (
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-foreground truncate max-w-[220px]">{file.name}</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB · PDF
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Haz clic para seleccionar</p>
                                        <p className="text-[11px] text-muted-foreground/60 mt-0.5">Solo PDF · máx. 5MB</p>
                                    </div>
                                )}
                            </button>

                            {file && (
                                <Button
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                    onClick={handleUpload}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Subiendo...</>
                                    ) : (
                                        <><Upload className="w-3.5 h-3.5 mr-1.5" />Subir justificante</>
                                    )}
                                </Button>
                            )}
                        </>
                    ) : (
                        /* Estado de éxito */
                        <div className="flex flex-col items-center justify-center py-6 gap-3">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-primary" />
                            </div>
                            <p className="text-sm font-medium text-foreground">Justificante subido con éxito</p>
                            <p className="text-[11px] text-muted-foreground truncate max-w-[220px]">{file?.name}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={handleClose}>
                        {uploaded ? "Cerrar" : "Omitir"}
                    </Button>
                    {uploaded && (
                        <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleFinish}>
                            Finalizar
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}