"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EmployeeSidebar } from "@/components/employee-sidebar"
import { EmployeesTable } from "@/components/employees-table"
import { AddEmployeeModal } from "@/components/modalAddEmpleado"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEmpleados } from "@/hooks/useEmpleados"
import { Empleado } from "@/types/Empleado"

export default function Page() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [empleadoEditar, setEmpleadoEditar] = useState<Empleado | null>(null)

  const { empleados, loading, error, refetch, desactivar } = useEmpleados('activos')

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.replace('/login')
    } else {
      setAuthChecked(true)
    }
  }, [router])

  const handleAgregar = () => {
    setEmpleadoEditar(null)
    setModalOpen(true)
  }

  const handleEditar = (empleado: Empleado) => {
    setEmpleadoEditar(empleado)
    setModalOpen(true)
  }

  if (!authChecked) return null

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
                  onClick={handleAgregar}
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
              onEditar={handleEditar}
            />
          </div>
        </main>

        <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border bg-white">
          &copy; 2023 UTVCO Sistema de Gestion. Todos los derechos reservados.
        </footer>
      </div>

      <AddEmployeeModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEmpleadoEditar(null)
        }}
        onSuccess={() => {
          setModalOpen(false)
          setEmpleadoEditar(null)
          refetch()
        }}
        empleadoEditar={empleadoEditar}
      />
    </div>
  )
}