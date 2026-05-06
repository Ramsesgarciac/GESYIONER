"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IncidenciasTabla } from "@/components/tableIncidencias";
import { FaltasAdministrativasTabla } from "@/components/tableFaltasAdministrativas";
import { EmployeeHeader } from "./EmployeeHeader";

export function IncidenciasTab({
    empleado,
    loadingEmpleado,
    incidencias,
    loadingIncidencias,
    refetchIncidencias,
    faltas,
    loadingFaltas,
    refetchFaltas,
    esInactivo,
    onAddIncidencia,
    onAddFalta,
}: any) {
    const [activeSubTab, setActiveSubTab] = useState<"incidencias" | "faltas">("incidencias");

    return (
        <div className="space-y-5">
            <div className="flex items-start gap-4">
                <div className="flex-1">
                    <EmployeeHeader empleado={empleado} loading={loadingEmpleado} compact />
                </div>
                {!esInactivo && (
                    <div className="flex flex-col gap-2 shrink-0">
                        <Button className="bg-btn-blue hover:bg-btn-blue-hover text-white" onClick={onAddIncidencia}>
                            <Plus className="w-4 h-4 mr-2" />Agregar Incidencia
                        </Button>
                        <Button className="bg-btn-blue hover:bg-btn-blue-hover text-white" onClick={onAddFalta}>
                            <Plus className="w-4 h-4 mr-2" />Agregar Falta Administrativa
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex gap-1 bg-white border border-border rounded-xl p-1 shadow-sm">
                <button
                    onClick={() => setActiveSubTab("incidencias")}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeSubTab === "incidencias" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                >
                    Incidencias
                </button>
                <button
                    onClick={() => setActiveSubTab("faltas")}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeSubTab === "faltas" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                >
                    Faltas Administrativas
                </button>
            </div>

            {activeSubTab === "incidencias" && (
                <IncidenciasTabla incidencias={incidencias} loading={loadingIncidencias} />
            )}
            {activeSubTab === "faltas" && (
                <FaltasAdministrativasTabla faltas={faltas} loading={loadingFaltas} onRefetch={refetchFaltas} />
            )}
        </div>
    );
}