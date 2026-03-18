"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { EmployeeSidebar } from "@/components/employee-sidebar"
import {
  FileText, Plus, Download, Loader2,
  XCircle, Hash, Briefcase, MapPin, Tag,
  CreditCard, IdCard, AlertCircle
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEmpleado } from "@/hooks/useEmpleados"
import { useListadoDocumentos } from "@/hooks/UseDocument"
import { useIncidenciasByEmpleado } from "@/hooks/useIncidencias"
import { downloadDocumento } from "../../../lib/services/Document.service"
import { AddIncidenciaModal } from "@/components/modalAddIncidencia"

const hojaDeVida = [
  { evento: "Fecha de ingreso", fecha: "12/07/2015", salario: "$80", cargo: "Secretario" },
  { evento: "Aumento salarial", fecha: "15/12/2015", salario: "$120", cargo: "Secretario" },
  { evento: "Cambio de cargo", fecha: "06/03/2016", salario: "$220", cargo: "Subjefe de vinculacion" },
  { evento: "Aumento salarial", fecha: "15/04/2017", salario: "$340", cargo: "Subjefe de vinculacion" },
  { evento: "Cambio de cargo", fecha: "01/05/2019", salario: "$340", cargo: "Subjefe de vinculacion" },
]

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

export default function EmpleadoPage() {
  const params = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("informacion")
  const [incidenciaModalOpen, setIncidenciaModalOpen] = useState(false)

  const empleadoId = Number(params.id)
  const { empleado, loading: loadingEmpleado } = useEmpleado(empleadoId)
  const { listado, loading: loadingDocs } = useListadoDocumentos(empleadoId)
  const { incidencias, loading: loadingIncidencias, refetch: refetchIncidencias } = useIncidenciasByEmpleado(empleadoId)

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
        <div className="h-14 bg-primary relative" />
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-7 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-white shadow-md flex items-center justify-center text-primary font-bold text-lg ring-2 ring-primary/20">
              {getInitials(empleado.nombre)}
            </div>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${empleado.activo
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
              }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${empleado.activo ? "bg-emerald-500" : "bg-red-500"}`} />
              {empleado.activo ? "Activo" : "Inactivo"}
            </span>
          </div>
          <h2 className="font-bold text-foreground text-base leading-tight">{empleado.nombre}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{empleado.puesto}</p>
          {!compact && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                Núm. {empleado.numero_empleado}
              </span>
              <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                Ingreso: {new Date(empleado.fecha_creacion).toLocaleDateString("es-MX")}
              </span>
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
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─── Tab: Información ──────────────────────────────────────────── */}
          {activeTab === "informacion" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-2 space-y-4">
                <EmployeeHeader />
                {!loadingEmpleado && empleado && (
                  <div className="bg-white rounded-2xl border border-border p-5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                      Datos personales
                    </h3>
                    <div className="divide-y divide-border/40">
                      <InfoRow icon={IdCard} label="CURP" value={empleado.curp} />
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

              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl border border-border p-5 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Documentación</h3>
                    {listado && (
                      <span className="text-xs font-medium text-primary bg-primary/8 px-2.5 py-1 rounded-full">
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
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${listado.estadisticas.porcentaje_completado}%` }} />
                      </div>
                    </div>
                  )}
                  {loadingDocs ? (
                    <div className="flex items-center justify-center py-14 gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Cargando documentos...</span>
                    </div>
                  ) : listado?.documentos && listado.documentos.length > 0 ? (
                    <div className="space-y-2 max-h-[calc(100vh-360px)] overflow-y-auto pr-0.5">
                      {listado.documentos.map((doc) => (
                        <div key={doc.id_tipo_doc} className={`group rounded-xl border p-3.5 transition-all duration-200 ${doc.subido ? "border-primary/20 bg-primary/4 hover:border-primary/30" : "border-border bg-gray-50/60 hover:bg-gray-50"}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${doc.subido ? "bg-primary/10" : "bg-muted"}`}>
                              <FileText className={`w-4 h-4 ${doc.subido ? "text-primary" : "text-muted-foreground"}`} />
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
                                <p className="text-[11px] text-primary/70 mt-0.5 truncate">{doc.documento.nombre_archivo} · v{doc.documento.version} · {new Date(doc.documento.fecha_carga).toLocaleDateString("es-MX")}</p>
                              ) : (
                                <p className="text-[11px] text-muted-foreground/50 mt-0.5 italic">Sin documento subido</p>
                              )}
                            </div>
                            <div className="shrink-0">
                              {doc.subido && doc.documento ? (
                                <button onClick={() => downloadDocumento(doc.documento!.id_doc_empleado)} className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 font-medium transition-colors bg-primary/8 hover:bg-primary/15 px-2.5 py-1.5 rounded-lg">
                                  <Download className="w-3 h-3" />Descargar
                                </button>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                  <XCircle className="w-3.5 h-3.5 text-muted-foreground/40" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-14 gap-3 text-muted-foreground">
                      <FileText className="w-8 h-8 opacity-30" />
                      <p className="text-sm">No hay documentos registrados</p>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button size="sm" className="bg-btn-blue hover:bg-btn-blue-hover text-white">
                      <Plus className="w-3.5 h-3.5 mr-1.5" />Agregar Contrato
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Tab: Incidencias ──────────────────────────────────────────── */}
          {activeTab === "incidencias" && (
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex-1"><EmployeeHeader compact /></div>
                <Button
                  className="bg-btn-blue hover:bg-btn-blue-hover text-white shrink-0"
                  onClick={() => setIncidenciaModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Incidencia
                </Button>
              </div>

              <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                {loadingIncidencias ? (
                  <div className="flex items-center justify-center py-14 gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Cargando incidencias...</span>
                  </div>
                ) : incidencias.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 gap-2 text-muted-foreground">
                    <AlertCircle className="w-8 h-8 opacity-30" />
                    <p className="text-sm">No hay incidencias registradas</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary hover:bg-primary">
                        <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Incidencia</TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Fecha inicio</TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Fecha fin</TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Observaciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incidencias.map((incidencia) => (
                        <TableRow key={incidencia.id_incidencia} className="hover:bg-muted/30 border-b border-border/50">
                          <TableCell className="text-center py-3.5 text-sm font-medium">
                            {incidencia.tipoIncidencia?.nombre ?? `Tipo ${incidencia.id_tipo_incidencia}`}
                          </TableCell>
                          <TableCell className="text-center py-3.5 text-sm text-muted-foreground">
                            {new Date(incidencia.fecha_inicio).toLocaleDateString("es-MX")}
                          </TableCell>
                          <TableCell className="text-center py-3.5 text-sm text-muted-foreground">
                            {new Date(incidencia.fecha_fin).toLocaleDateString("es-MX")}
                          </TableCell>
                          <TableCell className="text-center py-3.5 text-sm text-muted-foreground max-w-[200px] truncate">
                            {incidencia.observaciones ?? "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          )}

          {/* ─── Tab: Hoja de vida ─────────────────────────────────────────── */}
          {activeTab === "hoja-de-vida" && (
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex-1"><EmployeeHeader compact /></div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button className="bg-btn-blue hover:bg-btn-blue-hover text-white">
                    <Plus className="w-4 h-4 mr-2" />Agregar Evento
                  </Button>
                  <Button className="bg-btn-blue hover:bg-btn-blue-hover text-white">
                    <Download className="w-4 h-4 mr-2" />Bajar Hoja de vida
                  </Button>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary">
                      <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Evento</TableHead>
                      <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Fecha</TableHead>
                      <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Salario</TableHead>
                      <TableHead className="text-primary-foreground font-semibold text-center py-3 text-xs uppercase tracking-wider">Cargo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hojaDeVida.map((evento, index) => (
                      <TableRow key={index} className="hover:bg-muted/30 border-b border-border/50">
                        <TableCell className="text-center py-3.5 text-sm font-medium">{evento.evento}</TableCell>
                        <TableCell className="text-center py-3.5 text-sm text-muted-foreground">{evento.fecha}</TableCell>
                        <TableCell className="text-center py-3.5 text-sm text-primary font-medium">{evento.salario}</TableCell>
                        <TableCell className="text-center py-3.5 text-sm text-muted-foreground">{evento.cargo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

        </main>

        <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border bg-white">
          &copy; 2023 UTVCO Sistema de Gestion. Todos los derechos reservados.
        </footer>
      </div>

      {/* Modal incidencia */}
      <AddIncidenciaModal
        open={incidenciaModalOpen}
        onClose={() => setIncidenciaModalOpen(false)}
        onSuccess={() => {
          setIncidenciaModalOpen(false)
          refetchIncidencias()
        }}
        id_empleado={empleadoId}
      />
    </div>
  )
}