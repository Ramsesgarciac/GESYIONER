"use client"

import { useState, useRef, useEffect } from "react"
import { X, Upload, FileText, Loader2, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { replaceJustificante, previewJustificante, downloadJustificante } from "@/lib/services/Justificante.service"
import { Justificante } from "@/types/justificante"
// ─── Modal vista previa justificante ─────────────────────────────────────────

function PreviewJustificanteModal({ open, onClose, id_justificante, nombre_archivo }: {
    open: boolean
    onClose: () => void
    id_justificante: number
    nombre_archivo: string
}) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const extension = nombre_archivo.split('.').pop()?.toLowerCase() ?? ""
    const isImage = ["jpg", "jpeg", "png"].includes(extension)
    const isPdf = extension === "pdf"

    useEffect(() => {
        if (!open) return
        setLoading(true)
        setError(null)
        fetch(`http://localhost:3000/api/justificantes/${id_justificante}/download`)
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener el archivo")
                return res.blob()
            })
            .then(blob => setBlobUrl(URL.createObjectURL(blob)))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))

        return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) }
    }, [open, id_justificante])

    const handleClose = () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl)
        setBlobUrl(null)
        onClose()
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 flex flex-col" style={{ maxHeight: "90vh" }}>
                <div className="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <Eye className="w-4 h-4 text-primary shrink-0" />
                        <p className="text-sm font-medium text-foreground truncate">{nombre_archivo}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                        <button
                            onClick={() => downloadJustificante(id_justificante, nombre_archivo)}
                            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium bg-primary/8 hover:bg-primary/15 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Download className="w-3.5 h-3.5" />Descargar
                        </button>
                        <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden p-4 min-h-0">
                    {loading ? (
                        <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
                            <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Cargando vista previa...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
                            <FileText className="w-10 h-10 opacity-30" />
                            <p className="text-sm">{error}</p>
                        </div>
                    ) : blobUrl && isPdf ? (
                        <iframe src={blobUrl} className="w-full h-full rounded-lg border border-border" style={{ minHeight: "60vh" }} />
                    ) : blobUrl && isImage ? (
                        <div className="flex items-center justify-center h-full">
                            <img src={blobUrl} alt={nombre_archivo} className="max-w-full max-h-full rounded-lg object-contain" style={{ maxHeight: "70vh" }} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
                            <FileText className="w-10 h-10 opacity-30" />
                            <p className="text-sm">Vista previa no disponible para este tipo de archivo</p>
                            <button onClick={() => downloadJustificante(id_justificante, nombre_archivo)} className="text-xs text-primary font-medium underline">
                                Descargar archivo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Modal reemplazar justificante ────────────────────────────────────────────

interface ReplaceJustificanteModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    justificante: Justificante | null
}

export function ReplaceJustificanteModal({
    open,
    onClose,
    onSuccess,
    justificante,
}: ReplaceJustificanteModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const [replacing, setReplacing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [previewOpen, setPreviewOpen] = useState(false)
    const fileRef = useRef<HTMLInputElement | null>(null)

    if (!open || !justificante) return null

    const handleReplace = async () => {
        if (!file) return
        setReplacing(true)
        setError(null)
        try {
            await replaceJustificante(justificante.id_justificante, file)
            onSuccess()
            handleClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al reemplazar justificante')
        } finally {
            setReplacing(false)
        }
    }

    const handleClose = () => {
        setFile(null)
        setError(null)
        setPreviewOpen(false)
        onClose()
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 pt-6 pb-4 border-b border-border">
                        <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                        <h2 className="text-base font-semibold text-foreground">Justificante</h2>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[260px]">{justificante.nombre_archivo}</p>
                    </div>

                    <div className="px-6 py-5 space-y-4">
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">{error}</div>
                        )}

                        {/* Archivo actual */}
                        <div className="rounded-xl border border-border bg-gray-50/60 p-3.5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{justificante.nombre_archivo}</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        Subido: {new Date(justificante.fecha_subida).toLocaleDateString("es-MX")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1.5">
                                {/* ← Botón Ver: abre PreviewJustificanteModal igual que PreviewDocModal */}
                                <button
                                    onClick={() => setPreviewOpen(true)}
                                    className="flex items-center gap-1 text-[11px] text-primary font-medium bg-primary/8 hover:bg-primary/15 px-2.5 py-1.5 rounded-lg transition-colors"
                                >
                                    <Eye className="w-3 h-3" />Ver
                                </button>
                                <button
                                    onClick={() => downloadJustificante(justificante.id_justificante, justificante.nombre_archivo)}
                                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium bg-muted hover:bg-muted/80 px-2.5 py-1.5 rounded-lg transition-colors"
                                >
                                    <Download className="w-3 h-3" />Descargar
                                </button>
                            </div>
                        </div>

                        {/* Reemplazar */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reemplazar archivo</p>
                            <input
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                ref={fileRef}
                                onChange={e => { setFile(e.target.files?.[0] ?? null); setError(null) }}
                            />
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 border border-dashed rounded-xl transition-colors text-left ${file ? "border-primary/40 bg-primary/4" : "border-border bg-gray-50/40 hover:border-primary/30"
                                    }`}
                            >
                                <Upload className={`w-4 h-4 shrink-0 ${file ? "text-primary" : "text-muted-foreground"}`} />
                                <div className="min-w-0">
                                    {file ? (
                                        <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">Seleccionar nuevo PDF (máx. 5MB)</p>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={handleClose} disabled={replacing}>
                            Cancelar
                        </Button>
                        <Button
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={handleReplace}
                            disabled={!file || replacing}
                        >
                            {replacing ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Reemplazando...</> : "Reemplazar"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Vista previa — z-[60] para estar encima del modal actual */}
            <PreviewJustificanteModal
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                id_justificante={justificante.id_justificante}
                nombre_archivo={justificante.nombre_archivo}
            />
        </>
    )
}