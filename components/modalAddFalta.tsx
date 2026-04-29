"use client"

import React, { useState } from "react" // Asegúrate de importar React
import { X, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AddFaltaModalProps {
    open: boolean
    onClose: () => void
    id_empleado: number
    onSuccess: () => void
}

export function AddFaltaModal({ open, onClose, id_empleado, onSuccess }: AddFaltaModalProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nombre: "",
        fecha: new Date().toISOString().split('T')[0],
        motivo: "",
        sancion: ""
    })

    if (!open) return null

    // Tipamos el evento del formulario como React.FormEvent
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch("http://localhost:3000/api/faltas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, id_empleado })
            })

            if (response.ok) {
                onSuccess()
                onClose()
            } else {
                alert("Error al guardar la falta")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Función genérica para manejar cambios con tipos correctos
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="w-5 h-5" />
                        <h2 className="text-lg font-bold">Registrar Falta</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Nombre / Título</label>
                        <Input
                            name="nombre"
                            required
                            placeholder="Ej. Retardo injustificado"
                            value={formData.nombre}
                            onChange={handleChange} // Usamos la función tipada
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
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
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