import { Empleado } from './Empleado';

// ─── FaltaAdministrativa principal ────────────────────────────────────────────

export interface FaltaAdministrativa {
    id_falta_administrativa: number;
    nombre: string;
    fecha: string; // 'YYYY-MM-DD'
    motivo: string;
    sancion?: string | null;
    id_empleado: number;
    fecha_creacion: string;

    // Relación opcional
    empleado?: Empleado;
}

// ─── DTOs ──────────────────────────────────────────────────────────────────────

export interface CreateFaltaAdministrativaDto {
    nombre: string;
    fecha: string; // 'YYYY-MM-DD'
    motivo: string;
    sancion?: string;
    id_empleado: number;
}

export interface UpdateFaltaAdministrativaDto extends Partial<Omit<CreateFaltaAdministrativaDto, 'id_empleado'>> { }