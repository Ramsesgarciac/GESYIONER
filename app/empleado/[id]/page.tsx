"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { EmployeeSidebar } from "@/components/employee-sidebar"
import { FileText, Plus, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const employeesData: Record<string, {
  nombre: string
  cargo: string
  fechaIngreso: string
  curp: string
  rfc: string
  area: string
  categoria: string
  puesto: string
  discapacidad: string
  direccion: string
}> = {
  "1": {
    nombre: "Maria Garcia Lopez",
    cargo: "Director de RH",
    fechaIngreso: "12/01/2018",
    curp: "HOCRE100201IFJA2",
    rfc: "HOCRE100201IFd433",
    area: "Recursos Humanos",
    categoria: "Administrativo",
    puesto: "Director de area",
    discapacidad: "Visual",
    direccion: "Amapolas 21 Allende, Oaxaca",
  },
  "2": {
    nombre: "Sergio Lopez Mata",
    cargo: "Abogado",
    fechaIngreso: "12/01/2013",
    curp: "LOMS850315HDFRG09",
    rfc: "LOMS850315HD4",
    area: "Legal",
    categoria: "Profesional",
    puesto: "Abogado Senior",
    discapacidad: "Ninguna",
    direccion: "Calle Reforma 45, CDMX",
  },
  "3": {
    nombre: "Matias Zalasar Aquino",
    cargo: "Director de Finanzas",
    fechaIngreso: "11/01/2014",
    curp: "ZAAM900520HDFNTS02",
    rfc: "ZAAM900520HDF",
    area: "Finanzas",
    categoria: "Directivo",
    puesto: "Director de area",
    discapacidad: "Ninguna",
    direccion: "Av. Universidad 123, Oaxaca",
  },
}

const documentos = [
  "Curriculum vitae",
  "Titulo y cedula profesional",
  "Certificado de ultimo grado de estudios",
  "Acta de nacimiento",
  "CURP",
  "Credencial de Elector",
  "Comprobante de domicilio",
  "RFC",
]

const incidencias = [
  { tipo: "Permiso no justifiado", fechaInicio: "12/09/2016", fechaFin: "14/09/2016" },
  { tipo: "Permiso", fechaInicio: "12/09/2016", fechaFin: "14/09/2016" },
  { tipo: "Falta", fechaInicio: "12/09/2016", fechaFin: "14/09/2016" },
  { tipo: "Permiso", fechaInicio: "12/09/2016", fechaFin: "14/09/2016" },
  { tipo: "Permiso", fechaInicio: "12/09/2016", fechaFin: "14/09/2016" },
  { tipo: "Permiso", fechaInicio: "12/09/2016", fechaFin: "14/09/2016" },
  { tipo: "Permiso", fechaInicio: "12/09/2016", fechaFin: "14/09/2016" },
  { tipo: "Permiso", fechaInicio: "12/09/2016", fechaFin: "14/09/2016" },
  { tipo: "Permiso", fechaInicio: "12/09/2016", fechaFin: "14/09/2016" },
  { tipo: "Permiso", fechaInicio: "12/09/2016", fechaFin: "14/09/2016" },
]

const hojaDeVida = [
  { evento: "Fecha de ingreso", fecha: "12/07/2015", salario: "$80", cargo: "Secretario" },
  { evento: "Aumento salarial", fecha: "15/12/2015", salario: "$120", cargo: "Secretario" },
  { evento: "Cambio de cargo", fecha: "06/03/2016", salario: "$220", cargo: "Subjefe de vinculacion" },
  { evento: "Aumento salarial", fecha: "15/04/2017", salario: "$340", cargo: "Subjefe de vinculacion" },
  { evento: "Cambio de cargo", fecha: "01/05/2019", salario: "$340", cargo: "Subjefe de vinculacion" },
]

type TabType = "informacion" | "incidencias" | "hoja-de-vida"

export default function EmpleadoPage() {
  const params = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("informacion")

  const employeeId = params.id as string
  const employee = employeesData[employeeId] || employeesData["1"]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployeeSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <div>
            {/* Tabs Navigation */}
            <div className="flex rounded-lg overflow-hidden mb-8">
              <button
                onClick={() => setActiveTab("informacion")}
                className={`flex-1 py-3 px-6 text-center font-medium transition-colors ${activeTab === "informacion"
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/80 text-primary-foreground/80 hover:bg-primary/90"
                  }`}
              >
                Información
              </button>
              <button
                onClick={() => setActiveTab("incidencias")}
                className={`flex-1 py-3 px-6 text-center font-medium transition-colors ${activeTab === "incidencias"
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/80 text-primary-foreground/80 hover:bg-primary/90"
                  }`}
              >
                Incidencias
              </button>
              <button
                onClick={() => setActiveTab("hoja-de-vida")}
                className={`flex-1 py-3 px-6 text-center font-medium transition-colors ${activeTab === "hoja-de-vida"
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/80 text-primary-foreground/80 hover:bg-primary/90"
                  }`}
              >
                Hoja de vida
              </button>
            </div>

            {activeTab === "informacion" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Employee Header Card */}
                  <div className="bg-white rounded-lg border border-border p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p className="text-foreground">
                          <span className="font-medium">Nombre:</span> {employee.nombre}
                        </p>
                        <p className="text-foreground">
                          <span className="font-medium">Cargo:</span> {employee.cargo}
                        </p>
                        <p className="text-foreground">
                          <span className="font-medium">Fecha de ingreso:</span> {employee.fechaIngreso}
                        </p>
                      </div>
                      <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-center">
                        <p className="font-medium text-sm">Status</p>
                        <p className="font-semibold">Activo</p>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information Card */}
                  <div className="bg-white rounded-lg border border-border p-6">
                    <h3 className="text-center font-semibold text-foreground mb-4 pb-2 border-b border-border">
                      Informacion personal
                    </h3>
                    <div className="space-y-4">
                      <p className="text-foreground">
                        <span className="font-medium">CURP:</span> {employee.curp}
                      </p>
                      <p className="text-foreground">
                        <span className="font-medium">RFC:</span> {employee.rfc}
                      </p>
                      <p className="text-foreground">
                        <span className="font-medium">Area:</span> {employee.area}
                      </p>
                      <p className="text-foreground">
                        <span className="font-medium">Categoria de empleo:</span> {employee.categoria}
                      </p>
                      <p className="text-foreground">
                        <span className="font-medium">Puesto:</span> {employee.puesto}
                      </p>
                      <p className="text-foreground">
                        <span className="font-medium">Discapacidad:</span> {employee.discapacidad}
                      </p>
                      <p className="text-foreground">
                        <span className="font-medium">Dirección:</span> {employee.direccion}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Documentation */}
                <div className="bg-white rounded-lg border border-border p-6">
                  <h3 className="text-center font-semibold text-foreground mb-6">
                    Documentación
                  </h3>
                  <div className="space-y-4">
                    {documentos.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-foreground">{doc}</span>
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button className="bg-btn-blue hover:bg-btn-blue-hover text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Contrato
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "incidencias" && (
              <div className="space-y-6">
                {/* Employee Header Card with Button */}
                <div className="flex items-start justify-between gap-6">
                  <div className="bg-white rounded-lg border border-border p-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p className="text-foreground">
                          <span className="font-medium">Nombre:</span> {employee.nombre}
                        </p>
                        <p className="text-foreground">
                          <span className="font-medium">Cargo:</span> {employee.cargo}
                        </p>
                        <p className="text-foreground">
                          <span className="font-medium">Fecha de ingreso:</span> {employee.fechaIngreso}
                        </p>
                      </div>
                      <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-center">
                        <p className="font-medium text-sm">Status</p>
                        <p className="font-semibold">Activo</p>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-btn-blue hover:bg-btn-blue-hover text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Incidencia
                  </Button>
                </div>

                {/* Incidencias Table */}
                <div className="bg-white rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary hover:bg-primary">
                        <TableHead className="text-primary-foreground font-semibold text-center py-3">
                          Incidencia
                        </TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3">
                          Fecha inicio
                        </TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3">
                          Fecha fin
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incidencias.map((incidencia, index) => (
                        <TableRow key={index} className="hover:bg-muted/30 border-b border-border/50">
                          <TableCell className="text-center py-3">{incidencia.tipo}</TableCell>
                          <TableCell className="text-center py-3">{incidencia.fechaInicio}</TableCell>
                          <TableCell className="text-center py-3">{incidencia.fechaFin}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {activeTab === "hoja-de-vida" && (
              <div className="space-y-6">
                {/* Employee Header Card with Buttons */}
                <div className="flex items-start justify-between gap-6">
                  <div className="bg-white rounded-lg border border-border p-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p className="text-foreground">
                          <span className="font-medium">Nombre:</span> {employee.nombre}
                        </p>
                        <p className="text-foreground">
                          <span className="font-medium">Cargo:</span> {employee.cargo}
                        </p>
                        <p className="text-foreground">
                          <span className="font-medium">Fecha de ingreso:</span> {employee.fechaIngreso}
                        </p>
                      </div>
                      <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-center">
                        <p className="font-medium text-sm">Status</p>
                        <p className="font-semibold">Activo</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button className="bg-btn-blue hover:bg-btn-blue-hover text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Evento
                    </Button>
                    <Button className="bg-btn-blue hover:bg-btn-blue-hover text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Bajar Hoja de vida
                    </Button>
                  </div>
                </div>

                {/* Hoja de Vida Table */}
                <div className="bg-white rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary hover:bg-primary">
                        <TableHead className="text-primary-foreground font-semibold text-center py-3">
                          Evento
                        </TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3">
                          Fecha
                        </TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3">
                          Salario
                        </TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center py-3">
                          Cargo
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hojaDeVida.map((evento, index) => (
                        <TableRow key={index} className="hover:bg-muted/30 border-b border-border/50">
                          <TableCell className="text-center py-3">{evento.evento}</TableCell>
                          <TableCell className="text-center py-3">{evento.fecha}</TableCell>
                          <TableCell className="text-center py-3">{evento.salario}</TableCell>
                          <TableCell className="text-center py-3">{evento.cargo}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border bg-white">
          &copy; 2023 UTVCO Sistema de Gestion. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  )
}
