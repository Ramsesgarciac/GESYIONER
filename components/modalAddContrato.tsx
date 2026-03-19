"use client"

import { useState, useRef } from "react"
import { X, ChevronDown, Upload, Loader2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTiposContratos } from "@/hooks/useTipoContratos"
import { uploadContrato } from "../lib/services/Contrato.service"

interface AddContratoModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    id_empleado: number
    contratoVigenteId?: number | null // si existe, se hace replace en vez de upload
}

const INITIAL_FORM = {
    id_tipo_contrato: 0,
    fecha_inicio: "",
    fecha_fin: "",
}

type FormErrors = Partial<Record<keyof typeof INITIAL_FORM | 'file', string>>

export function AddContratoModal({ open, onClose, onSuccess, id_empleado, contratoVigenteId }: AddContratoModalProps) {
    const [form, setForm] = useState(INITIAL_FORM)
    const [file, setFile] = useState<File | null>(null)
    const [tipoOpen, setTipoOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [submitError, setSubmitError] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const { tiposContratos, loading: loadingTipos } = useTiposContratos()

    if (!open) return null

    const selectedTipo = tiposContratos.find(t => t.id_tipo_contrato === form.id_tipo_contrato)
    const isReplace = !!contratoVigenteId

    const handleChange = (field: keyof typeof INITIAL_FORM, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }))
        setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    const validate = (): boolean => {
        const newErrors: FormErrors = {}
        if (!form.id_tipo_contrato) newErrors.id_tipo_contrato = "Selecciona un tipo de contrato"
        if (!form.fecha_inicio) newErrors.fecha_inicio = "La fecha de inicio es requerida"
        if (!form.fecha_fin) newErrors.fecha_fin = "La fecha fin es requerida"
        if (form.fecha_inicio && form.fecha_fin && form.fecha_fin <= form.fecha_inicio)
            newErrors.fecha_fin = "La fecha fin debe ser mayor a la fecha inicio"
        if (!file) newErrors.file = "Selecciona un archivo PDF"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return
        setSubmitting(true)
        setSubmitError(null)
        try {
            await uploadContrato({
                id_empleado,
                id_tipo_contrato: form.id_tipo_contrato,
                fecha_inicio: form.fecha_inicio,
                fecha_fin: form.fecha_fin,
                file: file!,
            })
            onSuccess()
            handleClose()
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Error al subir contrato")
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        setForm(INITIAL_FORM)
        setFile(null)
        setErrors({})
        setSubmitError(null)
        setTipoOpen(false)
        onClose()
    }

    return (
        <div className= "fixed inset-0 z-50 flex items-center justify-center" >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick = { handleClose } />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4" >
                <div className = "px-6 pt-6 pb-4 border-b border-border" >
                    <button onClick={ handleClose } className = "absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors" >
                        <X className="w-4 h-4" />
                            </button>
                            < h2 className = "text-base font-semibold text-foreground" >
                                { isReplace? "Actualizar contrato": "Agregar contrato" }
                                </h2>
                                < p className = "text-xs text-muted-foreground mt-0.5" >
                                    { isReplace? "El contrato vigente actual será reemplazado": "Sube el contrato del empleado" }
                                    </p>
                                    </div>

    {/* Body */ }
    <div className="px-6 py-5 space-y-4" >
        { submitError && (
            <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg" > { submitError } </div>
          )
}

{/* Tipo contrato */ }
<Field label="Tipo de contrato" error = { errors.id_tipo_contrato } >
    <div className="relative" >
        <button
                type="button"
onClick = {() => setTipoOpen(p => !p)}
className = {`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg bg-white text-left hover:bg-muted/20 transition-colors ${errors.id_tipo_contrato ? "border-destructive" : "border-input"
    }`}
              >
    <span className={ selectedTipo ? "text-foreground" : "text-muted-foreground" }>
        { loadingTipos? "Cargando tipos...": selectedTipo?.nombre ?? "Selecciona el tipo de contrato" }
        </span>
        < ChevronDown className = {`w-4 h-4 text-muted-foreground transition-transform ${tipoOpen ? "rotate-180" : ""}`} />
            </button>
{
    tipoOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-44 overflow-y-auto" >
            {
                tiposContratos.length === 0 ? (
                    <p className= "px-3 py-2 text-sm text-muted-foreground" > Sin tipos disponibles</ p >
                  ) : (
        tiposContratos.map(tipo => (
            <button
                        key= { tipo.id_tipo_contrato }
                        type = "button"
                        onClick = {() => { handleChange("id_tipo_contrato", tipo.id_tipo_contrato); setTipoOpen(false)
}}
className = {`w-full text-left px-3 py-2.5 text-sm hover:bg-muted/40 transition-colors ${form.id_tipo_contrato === tipo.id_tipo_contrato ? "bg-primary/10 text-primary font-medium" : "text-foreground"
    }`}
                      >
    <p className="font-medium" > { tipo.nombre } </p>
{ tipo.descripcion && <p className="text-[11px] text-muted-foreground mt-0.5" > { tipo.descripcion } </p> }
</button>
                    ))
                  )}
</div>
              )}
</div>
    </Field>

{/* Fechas */ }
<div className="grid grid-cols-2 gap-3" >
    <Field label="Fecha inicio" error = { errors.fecha_inicio } >
        <Input
                type="date"
value = { form.fecha_inicio }
onChange = { e => handleChange("fecha_inicio", e.target.value) }
className = { errors.fecha_inicio ? "border-destructive" : "" }
    />
    </Field>
    < Field label = "Fecha fin" error = { errors.fecha_fin } >
        <Input
                type="date"
value = { form.fecha_fin }
onChange = { e => handleChange("fecha_fin", e.target.value) }
className = { errors.fecha_fin ? "border-destructive" : "" }
    />
    </Field>
    </div>

{/* Archivo */ }
<Field label="Archivo PDF" error = { errors.file } >
    <div
              onClick={ () => fileRef.current?.click() }
className = {`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${errors.file ? "border-destructive" : "border-border hover:border-primary/50 hover:bg-muted/20"
    }`}
            >
    {
        file?(
                <div className = "flex items-center gap-2 justify-center" >
                <FileText className="w-4 h-4 text-primary shrink-0" />
    <p className="text-sm font-medium text-foreground truncate" > { file.name } </p>
        </div>
              ) : (
    <>
    <Upload className= "w-6 h-6 text-muted-foreground mx-auto mb-1" />
    <p className="text-sm text-muted-foreground" > Haz clic para seleccionar PDF </p>
        < p className = "text-[11px] text-muted-foreground/60 mt-0.5" > máx 10MB </p>
            </>
              )}
</div>
    < input ref = { fileRef } type = "file" accept = ".pdf" className = "hidden" onChange = { e => { setFile(e.target.files?.[0] ?? null); setErrors(p => ({ ...p, file: undefined })) }} />
        </Field>
        </div>

{/* Footer */ }
<div className="px-6 pb-6 flex gap-3" >
    <Button variant="outline" className = "flex-1" onClick = { handleClose } disabled = { submitting } > Cancelar </Button>
        < Button className = "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick = { handleSubmit } disabled = { submitting } >
            { submitting?<>< Loader2 className = "w-3.5 h-3.5 mr-1.5 animate-spin" /> Subiendo...</> : isReplace ? "Actualizar" : "Guardar"}
</Button>
    </div>
    </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className= "space-y-1" >
        <label className="text-xs font-medium text-foreground" > { label } </label>
    { children }
    { error && <p className="text-xs text-destructive" > { error } </p> }
    </div>
  )
}