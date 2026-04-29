"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { EmployeeSidebar } from "@/components/employee-sidebar"
import {
  FileText, Plus, Download, Loader2,
  Hash, Briefcase, MapPin, Tag,
  CreditCard, IdCard, AlertCircle, TrendingUp,
  Upload, Clock, Eye, ScrollText, CalendarDays, CheckCircle2, X
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEmpleado } from "@/hooks/useEmpleados"
import { useListadoDocumentos } from "@/hooks/UseDocument"
import { useIncidenciasByEmpleado } from "@/hooks/useIncidencias"
import { useEventosByEmpleado } from "@/hooks/useEventos"
import { useHojaVida } from "@/hooks/useHojaVida"
import { useContratosByEmpleado } from "@/hooks/useConratos"
import { downloadDocumento } from "@/lib/services/Document.service"
import { downloadContrato } from "@/lib/services/Contrato.service"
import { AddIncidenciaModal } from "@/components/modalAddIncidencia"
import { AddEventoModal } from "@/components/modalAddEvento"
import { UpdateDocModal, HistorialDocModal, PreviewDocModal } from "@/components/modalDocuments"
import { AddContratoModal } from "@/components/modalAddContrato"
import { IncidenciasTabla } from "@/components/tableIncidencias"
import { Contrato } from "@/types/Contrato"

function formatFecha(fecha: string): string {
  if (!fecha) return "—"
  const [year, month, day] = fecha.split("T")[0].split("-")
  return `${day}/${month}/${year}`
}

type TabType = "informacion" | "incidencias" | "hoja-de-vida"

const tabs: { id: TabType; label: string }[] = [
  { id: "informacion", label: "Información" },
  { id: "incidencias", label: "Incidencias" },
  { id: "hoja-de-vida", label: "Hoja de vida" },
]


function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="mt-0.5 w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium mb-0.5">{label}</p>
        <p className="text-sm text-foreground font-medium truncate">{value}</p>
      </div>
    </div>
  )
}

// ─── Modal historial de contratos ─────────────────────────────────────────────

function HistorialContratosModal({ open, onClose, id_empleado }: {
  open: boolean; onClose: () => void; id_empleado: number
}) {
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<{ id: number; nombre: string } | null>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    fetch(`http://localhost:3000/api/contratos/empleado/${id_empleado}`)
      .then(res => { if (!res.ok) throw new Error("Error al obtener historial"); return res.json() })
      .then(data => setContratos(data ?? []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [open, id_empleado])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"><X className="w-4 h-4" /></button>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Historial de contratos</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Todos los contratos del empleado</p>
          </div>
          <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Cargando...</span></div>
            ) : error ? (
              <div className="text-sm text-destructive py-6 text-center">{error}</div>
            ) : contratos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground"><ScrollText className="w-8 h-8 opacity-30" /><p className="text-sm">Sin contratos</p></div>
            ) : (
              <div className="space-y-2">
                {contratos.map((contrato) => (
                  <div key={contrato.id_contrato} className={`rounded-xl border p-3.5 ${contrato.vigente ? "border-emerald-100 bg-emerald-50/50" : "border-border bg-gray-50/60"}`}>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${contrato.vigente ? "bg-emerald-100" : "bg-muted"}`}>
                        <ScrollText className={`w-3.5 h-3.5 ${contrato.vigente ? "text-emerald-600" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-medium text-foreground truncate">{contrato.tipoContrato?.nombre ?? `Contrato #${contrato.id_contrato}`}</p>
                          {contrato.vigente && <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium shrink-0"><CheckCircle2 className="w-2.5 h-2.5" />Vigente</span>}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{contrato.nombre_archivo}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1"><CalendarDays className="w-2.5 h-2.5" />{formatFecha(contrato.fecha_inicio)} — {formatFecha(contrato.fecha_fin)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 pl-9">
                      <button onClick={() => setPreviewId({ id: contrato.id_contrato, nombre: contrato.nombre_archivo })} className="flex items-center gap-1 text-[11px] text-primary font-medium bg-primary/8 hover:bg-primary/15 px-2.5 py-1.5 rounded-lg transition-colors"><Eye className="w-3 h-3" />Ver</button>
                      <button onClick={() => downloadContrato(contrato.id_contrato, contrato.nombre_archivo)} className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium bg-muted hover:bg-muted/80 px-2.5 py-1.5 rounded-lg transition-colors"><Download className="w-3 h-3" />Descargar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="px-6 pb-5 pt-2 border-t border-border">
            <p className="text-[11px] text-muted-foreground">{contratos.length} contrato{contratos.length !== 1 ? "s" : ""} en total</p>
          </div>
        </div>
      </div>
      {previewId && <PreviewContratoModal open={!!previewId} onClose={() => setPreviewId(null)} id_contrato={previewId.id} nombre_archivo={previewId.nombre} zIndex={60} />}
    </>
  )
}

// ─── Modal vista previa contrato ──────────────────────────────────────────────

function PreviewContratoModal({ open, onClose, id_contrato, nombre_archivo, zIndex = 50 }: {
  open: boolean; onClose: () => void; id_contrato: number; nombre_archivo: string; zIndex?: number
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isPdf = nombre_archivo.toLowerCase().endsWith(".pdf")

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError(null)
    fetch(`http://localhost:3000/api/contratos/${id_contrato}/download`)
      .then(res => { if (!res.ok) throw new Error("Error al obtener el archivo"); return res.blob() })
      .then(blob => setBlobUrl(URL.createObjectURL(blob)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) }
  }, [open, id_contrato])

  const handleClose = () => { if (blobUrl) URL.revokeObjectURL(blobUrl); setBlobUrl(null); onClose() }
  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 flex flex-col" style={{ maxHeight: "90vh" }}>
        <div className="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0"><Eye className="w-4 h-4 text-primary shrink-0" /><p className="text-sm font-medium text-foreground truncate">{nombre_archivo}</p></div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <button onClick={() => downloadContrato(id_contrato, nombre_archivo)} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium bg-primary/8 hover:bg-primary/15 px-3 py-1.5 rounded-lg transition-colors"><Download className="w-3.5 h-3.5" />Descargar</button>
            <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden p-4 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Cargando vista previa...</span></div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground"><FileText className="w-10 h-10 opacity-30" /><p className="text-sm">{error}</p></div>
          ) : blobUrl && isPdf ? (
            <iframe src={blobUrl} className="w-full h-full rounded-lg border border-border" style={{ minHeight: "60vh" }} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
              <FileText className="w-10 h-10 opacity-30" /><p className="text-sm">Vista previa no disponible</p>
              <button onClick={() => downloadContrato(id_contrato, nombre_archivo)} className="text-xs text-primary font-medium underline">Descargar archivo</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page principal ───────────────────────────────────────────────────────────

export default function EmpleadoPage() {
  const params = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("informacion")
  const [incidenciaModalOpen, setIncidenciaModalOpen] = useState(false)
  const [eventoModalOpen, setEventoModalOpen] = useState(false)
  const [contratoModalOpen, setContratoModalOpen] = useState(false)
  const [historialContratosOpen, setHistorialContratosOpen] = useState(false)

  const [updateDoc, setUpdateDoc] = useState<{ id_tipo_doc: number; nombre_doc: string } | null>(null)
  const [historialDoc, setHistorialDoc] = useState<{ id_tipo_doc: number; nombre_doc: string } | null>(null)
  const [previewDoc, setPreviewDoc] = useState<{ id_doc_empleado: number; nombre_archivo: string } | null>(null)
  const [previewContrato, setPreviewContrato] = useState<{ id: number; nombre_archivo: string } | null>(null)

  const empleadoId = Number(params.id)

  const { empleado, loading: loadingEmpleado } = useEmpleado(empleadoId)
  const { listado, loading: loadingDocs, refetch: refetchDocs } = useListadoDocumentos(empleadoId)
  const { incidencias, loading: loadingIncidencias, refetch: refetchIncidencias } = useIncidenciasByEmpleado(empleadoId)
  const { eventos, loading: loadingEventos, refetch: refetchEventos } = useEventosByEmpleado(empleadoId)
  const { descargarPdf, loading: loadingPdf } = useHojaVida(empleadoId)
  const { contratoVigente, loading: loadingContrato, refetch: refetchContratos } = useContratosByEmpleado(empleadoId)

  // ─── Derivado: es inactivo ─────────────────────────────────────────────────
  const esInactivo = empleado?.activo === false

  const getInitials = (nombre: string) =>
    nombre.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()

  const EmployeeHeader = ({ compact = false }: { compact?: boolean }) => {
    if (loadingEmpleado) return (
      <div className="bg-white rounded-2xl border border-border p-5 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Cargando...</span>
      </div>
    )
    if (!empleado) return null
    return (
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-5 pb-5 pt-5">
          <div className="flex items-end justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-white shadow-md flex items-center justify-center text-primary font-bold text-lg ring-2 ring-primary/20">
              {getInitials(empleado.nombre)}
            </div>
            {/* ─── Badge status ─── */}
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
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50/80">
      <EmployeeSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-border rounded-xl p-1 mb-6 shadow-sm">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─── Tab: Información ─────────────────────────────────────── */}
          {activeTab === "informacion" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-2 space-y-4">
                <EmployeeHeader />
                {!loadingEmpleado && empleado && (
                  <div className="bg-white rounded-2xl border border-border p-5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Datos personales</h3>
                    <div className="divide-y divide-border/40">
                      <InfoRow icon={IdCard} label="CURP" value={empleado.curp} />
                      <InfoRow icon={CreditCard} label="NSS" value={empleado.numero_seguridad_social ?? "No especificado"} />
                      <InfoRow icon={CreditCard} label="RFC" value={empleado.rfc} />
                      <InfoRow icon={MapPin} label="Área" value={empleado.area_asignada} />
                      <InfoRow icon={Tag} label="Categoría" value={empleado.categoria?.nombre ?? `ID ${empleado.id_categoria}`} />
                      <InfoRow icon={Briefcase} label="Puesto" value={empleado.puesto} />
                      <InfoRow icon={AlertCircle} label="Discapacidad" value={empleado.discapacidad ?? "Ninguna"} />
                      <InfoRow icon={Hash} label="Salario" value={empleado.salario_actual ? `$${Number(empleado.salario_actual).toLocaleString("es-MX")}` : "No especificado"} />
                    </div>
                  </div>
                )}
              </div>

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
                      {listado.documentos.map((doc) => (
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
                              <button onClick={() => setPreviewDoc({ id_doc_empleado: doc.documento!.id_doc_empleado, nombre_archivo: doc.documento!.nombre_archivo })}
                                className="flex items-center gap-1 text-[11px] text-primary font-medium bg-primary/8 hover:bg-primary/15 px-2.5 py-1.5 rounded-lg transition-colors">
                                <Eye className="w-3 h-3" />Ver
                              </button>
                            )}
                            {doc.subido && doc.documento && (
                              <button onClick={() => downloadDocumento(doc.documento!.id_doc_empleado)}
                                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium bg-muted hover:bg-muted/80 px-2.5 py-1.5 rounded-lg transition-colors">
                                <Download className="w-3 h-3" />Descargar
                              </button>
                            )}
                            {/* Botones de edición solo si está activo */}
                            {!esInactivo && (
                              <>
                                <button onClick={() => setUpdateDoc({ id_tipo_doc: doc.id_tipo_doc, nombre_doc: doc.nombre_doc })}
                                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium bg-muted hover:bg-muted/80 px-2.5 py-1.5 rounded-lg transition-colors">
                                  <Upload className="w-3 h-3" />{doc.subido ? "Actualizar" : "Subir"}
                                </button>
                                {doc.subido && (
                                  <button onClick={() => setHistorialDoc({ id_tipo_doc: doc.id_tipo_doc, nombre_doc: doc.nombre_doc })}
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
                    {/* Botón agregar/actualizar contrato solo si activo */}
                    {!esInactivo && (
                      <Button size="sm" className="bg-btn-blue hover:bg-btn-blue-hover text-white h-8" onClick={() => setContratoModalOpen(true)}>
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
                            <button onClick={() => setPreviewContrato({ id: contratoVigente.id_contrato, nombre_archivo: contratoVigente.nombre_archivo })}
                              className="flex items-center gap-1 text-[11px] text-primary font-medium bg-primary/8 hover:bg-primary/15 px-2.5 py-1.5 rounded-lg transition-colors"><Eye className="w-3 h-3" />Ver</button>
                            <button onClick={() => downloadContrato(contratoVigente.id_contrato, contratoVigente.nombre_archivo)}
                              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium bg-muted hover:bg-muted/80 px-2.5 py-1.5 rounded-lg transition-colors"><Download className="w-3 h-3" />Descargar</button>
                            <button onClick={() => setHistorialContratosOpen(true)}
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
          )}

          {/* ─── Tab: Incidencias ─────────────────────────────────────── */}
          {activeTab === "incidencias" && (
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex-1"><EmployeeHeader compact /></div>
                {/* Botón agregar incidencia solo si activo */}
                {!esInactivo && (
                  <Button className="bg-btn-blue hover:bg-btn-blue-hover text-white shrink-0" onClick={() => setIncidenciaModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />Agregar Incidencia
                  </Button>
                )}
              </div>
              <IncidenciasTabla incidencias={incidencias} loading={loadingIncidencias} />
            </div>
          )}

          {/* ─── Tab: Hoja de vida ────────────────────────────────────── */}
          {activeTab === "hoja-de-vida" && (
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex-1"><EmployeeHeader compact /></div>
                <div className="flex flex-col gap-2 shrink-0">
                  {/* Botón agregar evento solo si activo */}
                  {!esInactivo && (
                    <Button className="bg-btn-blue hover:bg-btn-blue-hover text-white" onClick={() => setEventoModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />Agregar Evento
                    </Button>
                  )}
                  {/* Bajar hoja de vida siempre visible */}
                  <Button className="bg-btn-blue hover:bg-btn-blue-hover text-white" onClick={descargarPdf} disabled={loadingPdf}>
                    {loadingPdf ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Descargando...</> : <><Download className="w-4 h-4 mr-2" />Bajar Hoja de vida</>}
                  </Button>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                {loadingEventos ? (
                  <div className="flex items-center justify-center py-14 gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Cargando eventos...</span></div>
                ) : eventos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 gap-2 text-muted-foreground"><TrendingUp className="w-8 h-8 opacity-30" /><p className="text-sm">No hay eventos registrados</p></div>
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
                      {eventos.map((ev) => (
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
          )}
        </main>

        <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border bg-white">
          &copy; 2023 UTVCO Sistema de Gestion. Todos los derechos reservados.
        </footer>
      </div>

      {/* Modales — solo se montan si activo */}
      {!esInactivo && (
        <>
          <AddIncidenciaModal open={incidenciaModalOpen} onClose={() => setIncidenciaModalOpen(false)} onSuccess={() => { setIncidenciaModalOpen(false); refetchIncidencias() }} id_empleado={empleadoId} />
          <AddEventoModal
            key={`evento-modal-${empleado?.puesto ?? ''}-${empleado?.salario_actual ?? ''}`}
            open={eventoModalOpen}
            onClose={() => setEventoModalOpen(false)}
            onSuccess={() => { setEventoModalOpen(false); refetchEventos() }}
            id_empleado={empleadoId}
            cargoActual={empleado?.puesto ?? ""}
            salarioActual={empleado?.salario_actual ? Number(empleado.salario_actual) : undefined}
          />
          <AddContratoModal open={contratoModalOpen} onClose={() => setContratoModalOpen(false)} onSuccess={() => { setContratoModalOpen(false); refetchContratos() }} id_empleado={empleadoId} contratoVigenteId={contratoVigente?.id_contrato} />
          <UpdateDocModal open={!!updateDoc} onClose={() => setUpdateDoc(null)} onSuccess={() => { setUpdateDoc(null); refetchDocs() }} id_empleado={empleadoId} id_tipo_doc={updateDoc?.id_tipo_doc ?? 0} nombre_doc={updateDoc?.nombre_doc ?? ""} />
          <HistorialDocModal open={!!historialDoc} onClose={() => setHistorialDoc(null)} id_empleado={empleadoId} id_tipo_doc={historialDoc?.id_tipo_doc ?? 0} nombre_doc={historialDoc?.nombre_doc ?? ""} />
        </>
      )}
      <PreviewDocModal open={!!previewDoc} onClose={() => setPreviewDoc(null)} id_doc_empleado={previewDoc?.id_doc_empleado ?? 0} nombre_archivo={previewDoc?.nombre_archivo ?? ""} />
      <HistorialContratosModal open={historialContratosOpen} onClose={() => setHistorialContratosOpen(false)} id_empleado={empleadoId} />
      {previewContrato && <PreviewContratoModal open={!!previewContrato} onClose={() => setPreviewContrato(null)} id_contrato={previewContrato.id} nombre_archivo={previewContrato.nombre_archivo} />}
    </div>
  )
}