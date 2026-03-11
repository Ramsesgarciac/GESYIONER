"use client"

import { useState, useRef } from "react"
import { X, ChevronDown, Check, Upload, FileText, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCategorias } from "@/hooks/useCategoriaEmpleados"
import { CreateEmpleadoDto } from "@/types/Empleado"
import { createEmpleado } from "../lib/services/Empleado.service"
import { useTiposDocs } from "@/hooks/UseTipoDocs"
import { uploadDocumento } from "../lib/services/Document.service"

interface AddEmployeeModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

const INITIAL_FORM: CreateEmpleadoDto = {
    nombre: "",
    curp: "",
    rfc: "",
    discapacidad: "",
    puesto: "",
    area_asignada: "",
    numero_empleado: 0,
    id_categoria: 0,
    salario_actual: undefined,
}

type FormErrors = Partial<Record<keyof CreateEmpleadoDto, string>>

// Estado de cada documento en el step 2
interface DocUploadState {
    file: File | null
    uploading: boolean
    uploaded: boolean
    error: string | null
}

export function AddEmployeeModal({ open, onClose, onSuccess }: AddEmployeeModalProps) {
    const [step, setStep] = useState(1)
    const [form, setForm] = useState<CreateEmpleadoDto>(INITIAL_FORM)
    const [categoryOpen, setCategoryOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [createdEmpleadoId, setCreatedEmpleadoId] = useState<number | null>(null)

    // Map de id_tipo_doc -> estado de upload
    const [docStates, setDocStates] = useState<Record<number, DocUploadState>>({})

    const { categorias, loading: loadingCategorias } = useCategorias()
    const { tiposDocs, loading: loadingTipos } = useTiposDocs()

    // Refs para los inputs file ocultos
    const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({})

    if (!open) return null

    const selectedCategoria = categorias.find(c => c.id_cat_empleado === form.id_categoria)

    const handleChange = (field: keyof CreateEmpleadoDto, value: string | number | undefined) => {
        setForm(prev => ({ ...prev, [field]: value }))
        setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    const validate = (): boolean => {
        const newErrors: FormErrors = {}
        if (!form.nombre.trim()) newErrors.nombre = "El nombre es requerido"
        if (!form.curp.trim()) newErrors.curp = "El CURP es requerido"
        else if (form.curp.length !== 18) newErrors.curp = "El CURP debe tener 18 caracteres"
        if (!form.rfc.trim()) newErrors.rfc = "El RFC es requerido"
        else if (form.rfc.length < 12) newErrors.rfc = "El RFC debe tener al menos 12 caracteres"
        if (!form.id_categoria) newErrors.id_categoria = "Selecciona una categoría"
        if (!form.puesto.trim()) newErrors.puesto = "El puesto es requerido"
        if (!form.area_asignada.trim()) newErrors.area_asignada = "El área es requerida"
        if (!form.numero_empleado || form.numero_empleado <= 0)
            newErrors.numero_empleado = "El número de empleado es requerido"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmitStep1 = async () => {
        if (!validate()) return
        setSubmitting(true)
        setSubmitError(null)
        try {
            const payload: CreateEmpleadoDto = {
                ...form,
                discapacidad: form.discapacidad || undefined,
                salario_actual: form.salario_actual || undefined,
            }
            const nuevo = await createEmpleado(payload)
            setCreatedEmpleadoId(nuevo.id_empleado)

            // Inicializar estado de docs
            const initialDocStates: Record<number, DocUploadState> = {}
            tiposDocs.forEach(t => {
                initialDocStates[t.id_tipo_doc] = { file: null, uploading: false, uploaded: false, error: null }
            })
            setDocStates(initialDocStates)
            setStep(2)
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Error al crear empleado")
        } finally {
            setSubmitting(false)
        }
    }

    const handleFileChange = (id_tipo_doc: number, file: File | null) => {
        setDocStates(prev => ({
            ...prev,
            [id_tipo_doc]: { ...prev[id_tipo_doc], file, error: null }
        }))
    }

    const handleUpload = async (id_tipo_doc: number) => {
        const state = docStates[id_tipo_doc]
        if (!state?.file || !createdEmpleadoId) return

        setDocStates(prev => ({
            ...prev,
            [id_tipo_doc]: { ...prev[id_tipo_doc], uploading: true, error: null }
        }))

        try {
            await uploadDocumento({
                id_empleado: createdEmpleadoId,
                id_tipo_doc,
                file: state.file,
            })
            setDocStates(prev => ({
                ...prev,
                [id_tipo_doc]: { ...prev[id_tipo_doc], uploading: false, uploaded: true }
            }))
        } catch (err) {
            setDocStates(prev => ({
                ...prev,
                [id_tipo_doc]: {
                    ...prev[id_tipo_doc],
                    uploading: false,
                    error: err instanceof Error ? err.message : "Error al subir"
                }
            }))
        }
    }

    const handleClose = () => {
        setStep(1)
        setForm(INITIAL_FORM)
        setErrors({})
        setSubmitError(null)
        setCreatedEmpleadoId(null)
        setDocStates({})
        setCategoryOpen(false)
        onClose()
    }

    const handleFinish = () => {
        onSuccess()
        handleClose()
    }

    // Calcular progreso de documentos
    const totalDocs = tiposDocs.length
    const uploadedDocs = Object.values(docStates).filter(s => s.uploaded).length
    const obligatoriosPendientes = tiposDocs
        .filter(t => t.obligatorio && !docStates[t.id_tipo_doc]?.uploaded)
        .length

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

                {/* Header */}
                <div className="px-6 pt-6 pb-4">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray:600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <h2 className="text-lg font-semibold text-center text-foreground mb-4">
                        Registro del empleado
                    </h2>

                    {/* Tabs */}
                    <div className="flex rounded-lg overflow-hidden border border-border">
                        {["Datos", "Documentacion"].map((label, i) => (
                            <button
                                key={label}
                                onClick={() => createdEmpleadoId && setStep(i + 1)}
                                className={`flex-1 py-2 text-sm font-medium transition-colors ${step === i + 1
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-white text-muted-foreground hover:bg-muted/50"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── Step 1: Datos ─────────────────────────────────────────────── */}
                {step === 1 && (
                    <div className="px-6 pb-6 space-y-4 max-h-[65vh] overflow-y-auto">
                        {submitError && (
                            <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">
                                {submitError}
                            </div>
                        )}

                        <Field label="Nombre" error={errors.nombre}>
                            <Input
                                placeholder="porfavor escriba el nombre del empleado"
                                value={form.nombre}
                                onChange={e => handleChange("nombre", e.target.value)}
                                className={errors.nombre ? "border-destructive" : ""}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="CURP" error={errors.curp}>
                                <Input
                                    placeholder="escriba la curp"
                                    value={form.curp}
                                    onChange={e => handleChange("curp", e.target.value.toUpperCase())}
                                    maxLength={18}
                                    className={errors.curp ? "border-destructive" : ""}
                                />
                            </Field>
                            <Field label="RFC" error={errors.rfc}>
                                <Input
                                    placeholder="escriba la RFC"
                                    value={form.rfc}
                                    onChange={e => handleChange("rfc", e.target.value.toUpperCase())}
                                    maxLength={13}
                                    className={errors.rfc ? "border-destructive" : ""}
                                />
                            </Field>
                        </div>

                        <Field label="Categoria de empleo" error={errors.id_categoria}>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setCategoryOpen(p => !p)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md bg-white text-left hover:bg-muted/20 transition-colors ${errors.id_categoria ? "border-destructive" : "border-input"
                                        }`}
                                >
                                    <span className={selectedCategoria ? "text-foreground" : "text-muted-foreground"}>
                                        {loadingCategorias
                                            ? "Cargando categorías..."
                                            : selectedCategoria?.nombre ?? "seleccione la categoria del empleado"}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
                                </button>

                                {categoryOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-md shadow-lg max-h-44 overflow-y-auto">
                                        {categorias.length === 0 ? (
                                            <p className="px-3 py-2 text-sm text-muted-foreground">Sin categorías disponibles</p>
                                        ) : (
                                            categorias.map(cat => (
                                                <button
                                                    key={cat.id_cat_empleado}
                                                    type="button"
                                                    onClick={() => {
                                                        handleChange("id_categoria", cat.id_cat_empleado)
                                                        setCategoryOpen(false)
                                                    }}
                                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/40 transition-colors ${form.id_categoria === cat.id_cat_empleado
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "text-foreground"
                                                        }`}
                                                >
                                                    {cat.nombre}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </Field>

                        <Field label="Discapacidad">
                            <Input
                                placeholder="porfavor escriba la discapacidad del empleado"
                                value={form.discapacidad ?? ""}
                                onChange={e => handleChange("discapacidad", e.target.value)}
                            />
                        </Field>

                        <Field label="Puesto" error={errors.puesto}>
                            <Input
                                placeholder="porfavor escriba el puesto del empleado"
                                value={form.puesto}
                                onChange={e => handleChange("puesto", e.target.value)}
                                className={errors.puesto ? "border-destructive" : ""}
                            />
                        </Field>

                        <Field label="Actividades a desarrollar" error={errors.area_asignada}>
                            <Input
                                placeholder="porfavor escriba el área asignada"
                                value={form.area_asignada}
                                onChange={e => handleChange("area_asignada", e.target.value)}
                                className={errors.area_asignada ? "border-destructive" : ""}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Núm. empleado" error={errors.numero_empleado}>
                                <Input
                                    type="number"
                                    placeholder="Ej: 1022"
                                    value={form.numero_empleado || ""}
                                    onChange={e => handleChange("numero_empleado", Number(e.target.value))}
                                    className={errors.numero_empleado ? "border-destructive" : ""}
                                />
                            </Field>
                            <Field label="Salario actual">
                                <Input
                                    type="number"
                                    placeholder="Ej: 15000"
                                    value={form.salario_actual ?? ""}
                                    onChange={e => handleChange("salario_actual", Number(e.target.value))}
                                />
                            </Field>
                        </div>

                        <Button
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
                            onClick={handleSubmitStep1}
                            disabled={submitting}
                        >
                            {submitting ? "Guardando..." : "Siguiente"}
                        </Button>
                    </div>
                )}

                {/* ─── Step 2: Documentación ─────────────────────────────────────── */}
                {step === 2 && (
                    <div className="px-6 pb-6 flex flex-col gap-4">

                        {/* Cabecera con ID y progreso */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span className="text-xs text-muted-foreground">
                                    Empleado <span className="font-semibold text-primary">#{createdEmpleadoId}</span> creado
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {uploadedDocs}/{totalDocs} subidos
                            </span>
                        </div>

                        {/* Barra de progreso */}
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: totalDocs > 0 ? `${(uploadedDocs / totalDocs) * 100}%` : "0%" }}
                            />
                        </div>

                        {/* Lista de tipos de documento */}
                        {loadingTipos ? (
                            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Cargando documentos...</span>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                                {tiposDocs.map(tipo => {
                                    const state = docStates[tipo.id_tipo_doc] ?? { file: null, uploading: false, uploaded: false, error: null }

                                    return (
                                        <div
                                            key={tipo.id_tipo_doc}
                                            className={`rounded-xl border p-3 transition-colors ${state.uploaded
                                                ? "border-primary/30 bg-primary/5"
                                                : "border-border bg-white"
                                                }`}
                                        >
                                            {/* Nombre del documento */}
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <FileText className={`w-4 h-4 shrink-0 ${state.uploaded ? "text-primary" : "text-muted-foreground"}`} />
                                                    <div>
                                                        <p className="text-xs font-medium text-foreground leading-tight">
                                                            {tipo.nombre_doc}
                                                        </p>
                                                        {tipo.descripcion && (
                                                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                                                                {tipo.descripcion}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    {tipo.obligatorio && !state.uploaded && (
                                                        <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded font-medium">
                                                            Obligatorio
                                                        </span>
                                                    )}
                                                    {state.uploaded && (
                                                        <Check className="w-4 h-4 text-primary" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Acciones */}
                                            {!state.uploaded ? (
                                                <div className="flex items-center gap-2">
                                                    {/* Input file oculto */}
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        className="hidden"
                                                        ref={el => { fileInputRefs.current[tipo.id_tipo_doc] = el }}
                                                        onChange={e => handleFileChange(tipo.id_tipo_doc, e.target.files?.[0] ?? null)}
                                                    />

                                                    {/* Selector de archivo */}
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRefs.current[tipo.id_tipo_doc]?.click()}
                                                        className="flex-1 text-left text-xs px-2.5 py-1.5 border border-dashed border-border rounded-lg text-muted-foreground hover:border-primary/50 hover:bg-muted/20 transition-colors truncate"
                                                    >
                                                        {state.file ? state.file.name : "Seleccionar archivo..."}
                                                    </button>

                                                    {/* Botón subir */}
                                                    <Button
                                                        size="sm"
                                                        className="h-7 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                                                        disabled={!state.file || state.uploading}
                                                        onClick={() => handleUpload(tipo.id_tipo_doc)}
                                                    >
                                                        {state.uploading ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            <Upload className="w-3 h-3" />
                                                        )}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="text-[11px] text-primary font-medium flex items-center gap-1">
                                                    <Check className="w-3 h-3" />
                                                    {state.file?.name ?? "Documento subido"}
                                                </p>
                                            )}

                                            {/* Error */}
                                            {state.error && (
                                                <p className="text-[11px] text-destructive mt-1">{state.error}</p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Botón finalizar */}
                        <Button
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={handleFinish}
                        >
                            {obligatoriosPendientes > 0
                                ? `Finalizar (${obligatoriosPendientes} obligatorio${obligatoriosPendientes > 1 ? "s" : ""} pendiente${obligatoriosPendientes > 1 ? "s" : ""})`
                                : "Finalizar"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Helper Field ──────────────────────────────────────────────────────────────

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
            <label className="text-xs font-medium text-foreground">{label}</label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    )
}