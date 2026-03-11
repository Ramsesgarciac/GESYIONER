import { Users, UserX, Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EmployeeSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function EmployeeSidebar({ isOpen, onToggle }: EmployeeSidebarProps) {
  return (
    <aside
      className={`h-screen bg-sidebar transition-all duration-300 ease-in-out flex flex-col ${
        isOpen ? "w-56" : "w-14"
      }`}
    >
      <div className={`flex items-center p-4 ${isOpen ? "justify-between" : "justify-center"}`}>
        {isOpen && (
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">UTVCO</h1>
            <p className="text-xs text-sidebar-foreground/70">Gestion de Empleados</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={onToggle}
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      <nav className="px-2 space-y-1 mt-4">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md bg-sidebar-accent text-sidebar-accent-foreground font-medium transition-colors hover:bg-[#067a62] ${
            !isOpen && "justify-center"
          }`}
        >
          <Users className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span>Activos</span>}
        </Link>

        <Link
          href="#"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sidebar-foreground/80 font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
            !isOpen && "justify-center"
          }`}
        >
          <UserX className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span>Inactivos</span>}
        </Link>
      </nav>
    </aside>
  )
}
