"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Empleado } from "@/types/Empleado"

interface EmployeesTableProps {
  empleados: Empleado[]
  loading: boolean
  error: string | null
  desactivar: (id: number) => Promise<void>
  onEditar: (empleado: Empleado) => void
}

const RESULTS_PER_PAGE = 7

export function EmployeesTable({ empleados, loading, error, desactivar, onEditar }: EmployeesTableProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)

  const listaEmpleados = empleados ?? []
  const totalPages = Math.max(1, Math.ceil(listaEmpleados.length / RESULTS_PER_PAGE))
  const paginated = listaEmpleados.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  )
  const startIndex = listaEmpleados.length === 0 ? 0 : (currentPage - 1) * RESULTS_PER_PAGE + 1
  const endIndex = Math.min(currentPage * RESULTS_PER_PAGE, listaEmpleados.length)

  const handleRowClick = (id: number) => {
    router.push(`/empleado/${id}`)
  }

  const handleEdit = (e: React.MouseEvent, empleado: Empleado) => {
    e.stopPropagation()
    onEditar(empleado)
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    try {
      await desactivar(id)
    } catch (err) {
      console.error("Error al desactivar empleado:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Cargando empleados...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 text-destructive text-sm">
        Error: {error}
      </div>
    )
  }

  if (listaEmpleados.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
        No hay empleados activos.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary hover:bg-primary">
              <TableHead className="text-primary-foreground font-semibold text-xs uppercase tracking-wider py-3 text-center">
                Nombre
              </TableHead>
              <TableHead className="text-primary-foreground font-semibold text-xs uppercase tracking-wider py-3 text-center">
                Cargo
              </TableHead>
              <TableHead className="text-primary-foreground font-semibold text-xs uppercase tracking-wider py-3 text-center">
                Fecha de Ingreso
              </TableHead>
              <TableHead className="text-primary-foreground font-semibold text-xs uppercase tracking-wider py-3 text-center">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((empleado) => (
              <TableRow
                key={empleado.id_empleado}
                className="hover:bg-muted/30 border-b border-border/50 cursor-pointer"
                onClick={() => handleRowClick(empleado.id_empleado)}
              >
                <TableCell className="py-4 text-center">
                  <span className="font-medium text-foreground">{empleado.nombre}</span>
                </TableCell>
                <TableCell className="text-muted-foreground text-center">
                  {empleado.puesto}
                </TableCell>
                <TableCell className="text-muted-foreground text-center">
                  {new Date(empleado.fecha_creacion).toLocaleDateString('es-MX')}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-btn-blue text-btn-blue hover:bg-btn-blue/10 hover:text-btn-blue h-8 px-3 text-xs font-medium bg-btn-edit-bg"
                      onClick={(e) => handleEdit(e, empleado)}
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1.5" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-3 text-xs font-medium bg-btn-delete-bg"
                      onClick={(e) => handleDelete(e, empleado.id_empleado)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium">{startIndex}</span> a{" "}
          <span className="font-medium">{endIndex}</span> de{" "}
          <span className="font-medium">{listaEmpleados.length}</span> resultados
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className={`h-8 w-8 p-0 ${currentPage === page
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : ""
                }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}