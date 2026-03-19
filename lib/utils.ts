import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFecha(fecha: string): string {
  if (!fecha) return "—"
  const [year, month, day] = fecha.split("T")[0].split("-")
  return `${day}/${month}/${year}`
}