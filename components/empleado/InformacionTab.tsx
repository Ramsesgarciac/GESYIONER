"use client";

import { FileText, Plus, Download, Loader2, Eye, Upload, Clock, ScrollText, CalendarDays, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadDocumento } from "@/lib/services/Document.service";
import { downloadContrato } from "@/lib/services/Contrato.service";
import { EmployeeHeader } from "./EmployeeHeader";
import { formatFecha } from "@/lib/utils";
import { InfoRow } from "./InfoRow"; // lo crearemos aparte

export function InformacionTab({
    empleado,
    loadingEmpleado,
    listado,
    loadingDocs,
    contratoVigente,
    loadingContrato,
    esInactivo,
    onUpdateDoc,
    onHistorialDoc,
    onPreviewDoc,
    onAddContrato,
    onHistorialContratos,
    onPreviewContrato,
}: any) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Columna izquierda */}
            <div className="lg:col-span-2 space-y-4">
                <EmployeeHeader empleado={empleado} loading={loadingEmpleado} compact={false} />
                {!loadingEmpleado && empleado && (
                    <div className="bg-white rounded-2xl border border-border p-5">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Datos personales</h3>
                        <div className="divide-y divide-border/40">
                            <InfoRow icon={require("lucide-react").IdCard} label="CURP" value={empleado.curp} />
                            <InfoRow icon={require("lucide-react").CreditCard} label="NSS" value={empleado.numero_seguridad_social ?? "No especificado"} />
                            <InfoRow icon={require("lucide-react").CreditCard} label="RFC" value={empleado.rfc} />
                            <InfoRow icon={require("lucide-react").MapPin} label="Área" value={empleado.area_asignada} />
                            <InfoRow icon={require("lucide-react").Tag} label="Categoría" value={empleado.categoria?.nombre ?? `ID ${empleado.id_categoria}`} />
                            <InfoRow icon={require("lucide-react").Briefcase} label="Puesto" value={empleado.puesto} />
                            <InfoRow icon={require("lucide-react").AlertCircle} label="Discapacidad" value={empleado.discapacidad ?? "Ninguna"} />
                            <InfoRow icon={require("lucide-react").Hash} label="Salario" value={empleado.salario_actual ? `$${Number(empleado.salario_actual).toLocaleString("es-MX")}` : "No especificado"} />
                        </div>
                    </div>
                )}
            </div>

            {/* Columna derecha */}
            <div className="lg:col-span-3 flex flex-col gap-5">
                {/* Documentación */}
                <div className="bg-white rounded-2xl border border-border p-5 flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Documentación</h3>
                        {listado && (
                            <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                                {listado.estadisticas.porcentaje_completado}% completado
                            </span>
                        )}
                    </div>
                    {listado && (
                        <div className="mb-4">
                            <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5">
                                <span>{listado.estadisticas.documentos_subidos} de {listado.estadisticas.total_documentos} documentos subidos</span>
                                <span>{listado.estadisticas.obligatorios_pendientes} obligatorios pendientes</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${listado.estadisticas.porcentaje_completado}%` }} />
                            </div>
                        </div>
                    )}
                    {loadingDocs ? (
                        <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Cargando documentos...</span>
                        </div>
                    ) : listado?.documentos && listado.documentos.length > 0 ? (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                            {listado.documentos.map((doc: any) => (
                                <div key={doc.id_tipo_doc} className={`rounded-xl border p-3.5 transition-all duration-200 ${doc.subido ? "border-blue-100 bg-blue-50/60" : "border-border bg-gray-50/60"}`}>
                                    <div className="flex items-start gap-3 mb-2.5">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${doc.subido ? "bg-blue-100" : "bg-muted"}`}>
                                            <FileText className={`w-4 h-4 ${doc.subido ? "text-blue-600" : "text-muted-foreground"}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-sm font-medium text-foreground leading-tight">{doc.nombre_doc}</p>
                                                {doc.obligatorio && !doc.subido && (
                                                    <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-medium shrink-0">Obligatorio</span>
                                                )}
                                            </div>
                                            {doc.descripcion && <p className="text-[11px] text-muted-foreground mt-0.5">{doc.descripcion}</p>}
                                            {doc.subido && doc.documento ? (
                                                <p className="text-[11px] text-blue-600/70 mt-0.5 truncate">{doc.documento.nombre_archivo} · v{doc.documento.version} · {formatFecha(doc.documento.fecha_carga)}</p>
                                            ) : (
                                                <p className="text-[11px] text-muted-foreground/50 mt-0.5 italic">Sin documento subido</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap pl-11">
                                        {doc.subido && doc.documento && (
                                            <button onClick={() => onPreviewDoc(doc.documento.id_doc_empleado, doc.documento.nombre_archivo)}
                                                className="flex items-center gap-1 text-[11px] text-primary font-medium bg-primary/8 hover:bg-primary/15 px-2.5 py-1.5 rounded-lg transition-colors">
                                                <Eye className="w-3 h-3" />Ver
                                            </button>
                                        )}
                                        {doc.subido && doc.documento && (
                                            <button onClick={() => downloadDocumento(doc.documento.id_doc_empleado)}
                                                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium bg-muted hover:bg-muted/80 px-2.5 py-1.5 rounded-lg transition-colors">
                                                <Download className="w-3 h-3" />Descargar
                                            </button>
                                        )}
                                        {!esInactivo && (
                                            <>
                                                <button onClick={() => onUpdateDoc(doc.id_tipo_doc, doc.nombre_doc)}
                                                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium bg-muted hover:bg-muted/80 px-2.5 py-1.5 rounded-lg transition-colors">
                                                    <Upload className="w-3 h-3" />{doc.subido ? "Actualizar" : "Subir"}
                                                </button>
                                                {doc.subido && (
                                                    <button onClick={() => onHistorialDoc(doc.id_tipo_doc, doc.nombre_doc)}
                                                        className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium bg-muted hover:bg-muted/80 px-2.5 py-1.5 rounded-lg transition-colors">
                                                        <Clock className="w-3 h-3" />Historial
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground">
                            <FileText className="w-8 h-8 opacity-30" />
                            <p className="text-sm">No hay documentos registrados</p>
                        </div>
                    )}
                </div>

                {/* Contrato vigente */}
                <div className="bg-white rounded-2xl border border-border p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Contrato</h3>
                        {!esInactivo && (
                            <Button size="sm" className="bg-btn-blue hover:bg-btn-blue-hover text-white h-8" onClick={onAddContrato}>
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                {contratoVigente ? "Actualizar contrato" : "Agregar contrato"}
                            </Button>
                        )}
                    </div>
                    {loadingContrato ? (
                        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Cargando...</span></div>
                    ) : contratoVigente ? (
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                    <ScrollText className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-semibold text-foreground truncate">{contratoVigente.tipoContrato?.nombre ?? `Contrato #${contratoVigente.id_contrato}`}</p>
                                        <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium shrink-0"><CheckCircle2 className="w-2.5 h-2.5" />Vigente</span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground truncate mb-2">{contratoVigente.nombre_archivo}</p>
                                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                                        <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{formatFecha(contratoVigente.fecha_inicio)} — {formatFecha(contratoVigente.fecha_fin)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => onPreviewContrato(contratoVigente.id_contrato, contratoVigente.nombre_archivo)}
                                            className="flex items-center gap-1 text-[11px] text-primary font-medium bg-primary/8 hover:bg-primary/15 px-2.5 py-1.5 rounded-lg transition-colors"><Eye className="w-3 h-3" />Ver</button>
                                        <button onClick={() => downloadContrato(contratoVigente.id_contrato, contratoVigente.nombre_archivo)}
                                            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium bg-muted hover:bg-muted/80 px-2.5 py-1.5 rounded-lg transition-colors"><Download className="w-3 h-3" />Descargar</button>
                                        <button onClick={onHistorialContratos}
                                            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium bg-muted hover:bg-muted/80 px-2.5 py-1.5 rounded-lg transition-colors"><Clock className="w-3 h-3" />Historial</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground">
                            <ScrollText className="w-7 h-7 opacity-30" /><p className="text-sm">No hay contrato vigente</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}