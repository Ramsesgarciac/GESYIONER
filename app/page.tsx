"use client"

import { useState } from "react"
import { EmployeeSidebar } from "@/components/employee-sidebar"
import { EmployeesTable } from "@/components/employees-table"
import { AddEmployeeModal } from "@/components/modalAddEmpleado"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEmpleados } from "@/hooks/useEmpleados"

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const { empleados, loading, error, refetch, desactivar } = useEmpleados('activos')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployeeSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <div>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">Gestion de empleados</h1>
                <p className="text-muted-foreground text-sm">Gestion de todos los empleados de la UTVCO</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar empleado"
                    className="pl-9 w-56 bg-white border-border"
                  />
                </div>
                <Button
                  className="bg-btn-blue hover:bg-btn-blue-hover text-white"
                  onClick={() => setModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar empleado
                </Button>
              </div>
            </div>

            <EmployeesTable
              empleados={empleados}
              loading={loading}
              error={error}
              desactivar={desactivar}
            />
          </div>
        </main>

        <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border bg-white">
          &copy; 2023 UTVCO Sistema de Gestion. Todos los derechos reservados.
        </footer>
      </div>

      <AddEmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false)
          refetch()
        }}
      />
    </div>
  )
}