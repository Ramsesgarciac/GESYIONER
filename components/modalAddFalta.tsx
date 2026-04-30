"use client"

import { useState, useEffect } from "react"
import { X, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createFaltaAdministrativa } from "@/lib/services/FaltaAdministrativa.service"

interface AddFaltaModalProps {
    open: boolean
    onClose: () => void
    id_empleado: number
    onSuccess: () => void
}

type FormData = {
    nombre: string
    fecha: string
    motivo: string
    sancion: string
}

const initialFormData: FormData = {
    nombre: "",
    fecha: new Date().toISOString().split('T')[0],
    motivo: "",
    sancion: ""
}

export function AddFaltaModal({ open, onClose, id_empleado, onSuccess }: AddFaltaModalProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<FormData>(initialFormData)

    // Resetear formulario cuando el modal se abre
    useEffect(() => {
        if (open) {
            setFormData(initialFormData)
        }
    }, [open])

    const handleClose = () => {
        setFormData(initialFormData)
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            await createFaltaAdministrativa({
                nombre: formData.nombre,
                fecha: formData.fecha,
                motivo: formData.motivo,
                sancion: formData.sancion || undefined,
                id_empleado
            })
            onSuccess()
            handleClose()
        } catch (error) {
            console.error(error)
            alert("Error al guardar la falta")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="w-5 h-5" />
                        <h2 className="text-lg font-bold">Registrar Falta</h2>
                    </div>
                    <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Nombre / Título</label>
                        <Input
                            name="nombre"
                            required
                            placeholder="Ej. Comportamiento indebido"
                            value={formData.nombre}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Fecha</label>
                        <Input
                            name="fecha"
                            type="date"
                            required
                            value={formData.fecha}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Motivo</label>
                        <Textarea
                            name="motivo"
                            required
                            placeholder="Explique lo sucedido..."
                            className="resize-none h-24"
                            value={formData.motivo}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Sanción</label>
                        <Input
                            name="sancion"
                            placeholder="Ej. Suspensión de 1 día"
                            value={formData.sancion}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Registro"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
