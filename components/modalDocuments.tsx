"use client"

import { useState, useRef, useEffect } from "react"
import { X, Upload, Loader2, Clock, CheckCircle2, FileText, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadDocumento, downloadDocumento } from "@/lib/services/Document.service"
import { useHistorialDocumento } from "@/hooks/UseDocument"

// ─────────────────────────────────────────────────────────────────────────────
// Modal: Actualizar documento
// ─────────────────────────────────────────────────────────────────────────────

interface UpdateDocModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    id_empleado: number
    id_tipo_doc: number
    nombre_doc: string
}

export function UpdateDocModal({ open, onClose, onSuccess, id_empleado, id_tipo_doc, nombre_doc }: UpdateDocModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    if (!open) return null

    const handleUpload = async () => {
        if (!file) return
        setUploading(true)
        setError(null)
        try {
            await uploadDocumento({ id_empleado, id_tipo_doc, file })
            onSuccess()
            handleClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al subir documento")
        } finally {
            setUploading(false)
        }
    }

    const handleClose = () => {
        setFile(null)
        setError(null)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4">
                <div className="px-6 pt-6 pb-4 border-b border-border">
                    <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                    <h2 className="text-base font-semibold text-foreground">Actualizar documento</h2>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{nombre_doc}</p>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {error && <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">{error}</div>}

                    <div
                        onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-all"
                    >
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        {file ? (
                            <p className="text-sm font-medium text-foreground truncate px-4">{file.name}</p>
                        ) : (
                            <>
                                <p className="text-sm text-muted-foreground">Haz clic para seleccionar</p>
                                <p className="text-[11px] text-muted-foreground/60 mt-1">PDF, JPG o PNG · máx 10MB</p>
                            </>
                        )}
                    </div>
                    <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                        onChange={e => setFile(e.target.files?.[0] ?? null)} />

                    <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                        El documento actual pasará al historial y este nuevo quedará como versión activa.
                    </p>
                </div>

                <div className="px-6 pb-6 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={handleClose} disabled={uploading}>Cancelar</Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleUpload} disabled={!file || uploading}>
                        {uploading ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Subiendo...</> : "Actualizar"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal: Historial de versiones
// ─────────────────────────────────────────────────────────────────────────────

interface ReplaceDocModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    onReplace: (id_doc_empleado: number, file: File) => Promise<unknown>
    id_doc_empleado: number
    nombre_doc: string
    nombre_archivo: string
}

export function ReplaceDocModal({
    open,
    onClose,
    onSuccess,
    onReplace,
    id_doc_empleado,
    nombre_doc,
    nombre_archivo,
}: ReplaceDocModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    if (!open) return null

    const handleReplace = async () => {
        if (!file) return
        setUploading(true)
        setError(null)
        try {
            await onReplace(id_doc_empleado, file)
            onSuccess()
            handleClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al reemplazar documento")
        } finally {
            setUploading(false)
        }
    }

    const handleClose = () => {
        setFile(null)
        setError(null)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4">
                <div className="px-6 pt-6 pb-4 border-b border-border">
                    <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                    <h2 className="text-base font-semibold text-foreground">Editar documento</h2>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{nombre_doc}</p>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {error && <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">{error}</div>}

                    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                        <p className="text-[11px] text-muted-foreground">Archivo actual</p>
                        <p className="text-xs font-medium text-foreground truncate mt-0.5">{nombre_archivo}</p>
                    </div>

                    <div
                        onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-all"
                    >
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        {file ? (
                            <p className="text-sm font-medium text-foreground truncate px-4">{file.name}</p>
                        ) : (
                            <>
                                <p className="text-sm text-muted-foreground">Selecciona el nuevo archivo</p>
                                <p className="text-[11px] text-muted-foreground/60 mt-1">PDF, JPG o PNG - max 10MB</p>
                            </>
                        )}
                    </div>
                    <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                        onChange={e => setFile(e.target.files?.[0] ?? null)} />
                </div>

                <div className="px-6 pb-6 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={handleClose} disabled={uploading}>Cancelar</Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleReplace} disabled={!file || uploading}>
                        {uploading ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Guardando...</> : "Guardar"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

interface HistorialDocModalProps {
    open: boolean
    onClose: () => void
    id_empleado: number
    id_tipo_doc: number
    nombre_doc: string
}

function formatFechaDoc(fecha: string): string {
    if (!fecha) return "—"
    const [year, month, day] = fecha.split("T")[0].split("-")
    return `${day}/${month}/${year}`
}

export function HistorialDocModal({ open, onClose, id_empleado, id_tipo_doc, nombre_doc }: HistorialDocModalProps) {
    const [previewVersion, setPreviewVersion] = useState<{ id_doc_empleado: number; nombre_archivo: string } | null>(null)

    const { historial, loading } = useHistorialDocumento(
        open ? id_empleado : null,
        open ? id_tipo_doc : null
    )

    if (!open) return null

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
                    <div className="px-6 pt-6 pb-4 border-b border-border">
                        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <h2 className="text-base font-semibold text-foreground">Historial de versiones</h2>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{nombre_doc}</p>
                    </div>

                    <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Cargando historial...</span>
                            </div>
                        ) : !historial || historial.versiones.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                                <Clock className="w-8 h-8 opacity-30" />
                                <p className="text-sm">Sin versiones registradas</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {historial.versiones.map((version) => (
                                    <div
                                        key={version.id_doc_empleado}
                                        className={`rounded-xl border p-3.5 ${version.activo ? "border-primary/20 bg-primary/5" : "border-border bg-gray-50/60"}`}
                                    >
                                        {/* Info del archivo */}
                                        <div className="flex items-center gap-2.5 mb-2.5">
                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${version.activo ? "bg-primary/10" : "bg-muted"}`}>
                                                <FileText className={`w-3.5 h-3.5 ${version.activo ? "text-primary" : "text-muted-foreground"}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-xs font-medium text-foreground truncate">{version.nombre_archivo}</p>
                                                    {version.activo && (
                                                        <span className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium shrink-0">
                                                            <CheckCircle2 className="w-2.5 h-2.5" />Activo
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                                    {formatFechaDoc(version.fecha_carga)} · versión {version.version}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Botones de acción */}
                                        <div className="flex items-center gap-1.5 pl-9">
                                            <button
                                                onClick={() => setPreviewVersion({ id_doc_empleado: version.id_doc_empleado, nombre_archivo: version.nombre_archivo })}
                                                className="flex items-center gap-1 text-[11px] text-primary font-medium bg-primary/8 hover:bg-primary/15 px-2.5 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-3 h-3" />Ver
                                            </button>
                                            <button
                                                onClick={() => downloadDocumento(version.id_doc_empleado)}
                                                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium bg-muted hover:bg-muted/80 px-2.5 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Download className="w-3 h-3" />Descargar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="px-6 pb-5 pt-2 border-t border-border">
                        <p className="text-[11px] text-muted-foreground">
                            {historial ? `${historial.total_versiones} versión${historial.total_versiones !== 1 ? "es" : ""} en total` : ""}
                        </p>
                    </div>
                </div>
            </div>

            {/* Vista previa de versión — z-[60] para estar encima del historial */}
            {previewVersion && (
                <PreviewDocModal
                    open={!!previewVersion}
                    onClose={() => setPreviewVersion(null)}
                    id_doc_empleado={previewVersion.id_doc_empleado}
                    nombre_archivo={previewVersion.nombre_archivo}
                    zIndex={60}
                />
            )}
        </>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal: Vista previa del documento
// ─────────────────────────────────────────────────────────────────────────────

interface PreviewDocModalProps {
    open: boolean
    onClose: () => void
    id_doc_empleado: number
    nombre_archivo: string
    zIndex?: number
}

export function PreviewDocModal({ open, onClose, id_doc_empleado, nombre_archivo, zIndex = 50 }: PreviewDocModalProps) {
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

        fetch(`http://localhost:3000/api/documentos-empleados/${id_doc_empleado}/download`)
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener el archivo")
                return res.blob()
            })
            .then(blob => {
                const url = URL.createObjectURL(blob)
                setBlobUrl(url)
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))

        return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) }
    }, [open, id_doc_empleado])

    const handleClose = () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl)
        setBlobUrl(null)
        onClose()
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 flex flex-col" style={{ maxHeight: "90vh" }}>
                <div className="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <Eye className="w-4 h-4 text-primary shrink-0" />
                        <p className="text-sm font-medium text-foreground truncate">{nombre_archivo}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                        <button
                            onClick={() => downloadDocumento(id_doc_empleado)}
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
                            <button onClick={() => downloadDocumento(id_doc_empleado)} className="text-xs text-primary font-medium underline">
                                Descargar archivo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
