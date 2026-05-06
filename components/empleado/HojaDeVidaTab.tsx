"use client";

import { Plus, Download, Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmployeeHeader } from "./EmployeeHeader";
import { formatFecha } from "@/lib/utils";

export function HojaDeVidaTab({
    empleado,
    loadingEmpleado,
    eventos,
    loadingEventos,
    esInactivo,
    onAddEvento,
    descargarPdf,
    loadingPdf,
}: any) {
    return (
        <div className="space-y-5">
            <div className="flex items-start gap-4">
                <div className="flex-1">
                    <EmployeeHeader empleado={empleado} loading={loadingEmpleado} compact />
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                    {!esInactivo && (
                        <Button className="bg-btn-blue hover:bg-btn-blue-hover text-white" onClick={onAddEvento}>
                            <Plus className="w-4 h-4 mr-2" />Agregar Evento
                        </Button>
                    )}
                    <Button className="bg-btn-blue hover:bg-btn-blue-hover text-white" onClick={descargarPdf} disabled={loadingPdf}>
                        {loadingPdf ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Descargando...</> : <><Download className="w-4 h-4 mr-2" />Bajar Hoja de vida</>}
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                {loadingEventos ? (
                    <div className="flex items-center justify-center py-14 gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Cargando eventos...</span>
                    </div>
                ) : eventos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 gap-2 text-muted-foreground">
                        <TrendingUp className="w-8 h-8 opacity-30" /><p className="text-sm">No hay eventos registrados</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-primary hover:bg-primary">
                                <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Evento</TableHead>
                                <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Fecha</TableHead>
                                <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Cargo anterior</TableHead>
                                <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Cargo nuevo</TableHead>
                                <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Salario</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {eventos.map((ev: any) => (
                                <TableRow key={ev.id_evento} className="hover:bg-muted/30 border-b border-border/50">
                                    <TableCell className="text-center py-3.5 text-sm font-medium">{ev.tipoEvento?.nombre_evento ?? `Tipo ${ev.id_tipo_evento}`}</TableCell>
                                    <TableCell className="text-center py-3.5 text-sm text-muted-foreground">{formatFecha(ev.fecha_evento)}</TableCell>
                                    <TableCell className="text-center py-3.5 text-sm text-muted-foreground">{ev.cargo_anterior ?? "—"}</TableCell>
                                    <TableCell className="text-center py-3.5 text-sm text-muted-foreground">{ev.cargo_nuevo ?? "—"}</TableCell>
                                    <TableCell className="text-center py-3.5 text-sm text-primary font-medium">{ev.salario_nuevo ? `$${Number(ev.salario_nuevo).toLocaleString("es-MX")}` : "—"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}