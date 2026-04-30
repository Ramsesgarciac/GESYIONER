"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmModalProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    loading?: boolean
}

export function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    loading = false
}: ConfirmModalProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
                <div className="p-6 border-b border-border">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
                <div className="p-6 pt-4 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button
                        className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Procesando..." : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    )
}
