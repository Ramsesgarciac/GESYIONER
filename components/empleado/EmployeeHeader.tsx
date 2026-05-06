"use client";

import { Loader2 } from "lucide-react";
import { formatFecha } from "@/lib/utils"; // o donde prefieras

function getInitials(nombre: string) {
    return nombre.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

export function EmployeeHeader({ empleado, loading, compact = false }: { empleado: any; loading: boolean; compact?: boolean }) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-border p-5 flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Cargando...</span>
            </div>
        );
    }
    if (!empleado) return null;

    return (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="px-5 pb-5 pt-5">
                <div className="flex items-end justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border-2 border-white shadow-md flex items-center justify-center text-primary font-bold text-lg ring-2 ring-primary/20">
                        {getInitials(empleado.nombre)}
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${empleado.activo
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${empleado.activo ? "bg-blue-500" : "bg-red-400"}`} />
                        {empleado.activo ? "Activo" : "Inactivo"}
                    </span>
                </div>
                <h2 className="font-bold text-foreground text-base leading-tight">{empleado.nombre}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{empleado.puesto}</p>
                {!compact && (
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Núm. {empleado.numero_empleado}</span>
                        <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Ingreso: {formatFecha(empleado.fecha_creacion)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}