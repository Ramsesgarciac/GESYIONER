import { Empleado } from '../empleado/empleado.types';

// ─── Relaciones ────────────────────────────────────────────────────────────────

export interface TipoIncidencia {
    id_tipo_incidencia: number;
    nombre: string;
    descripcion?: string | null;
}

export interface Justificante {
    id_justificante: number;
    id_incidencia: number;
    nombre_archivo: string;
    ruta_archivo: string;
}

// ─── Incidencia principal ──────────────────────────────────────────────────────

export interface Incidencia {
    id_incidencia: number;
    id_empleado: number;
    id_tipo_incidencia: number;
    fecha_inicio: string;
    fecha_fin: string;
    observaciones?: string | null;
    fecha_registro: string;

    // Relaciones opcionales
    empleado?: Empleado;
    tipoIncidencia?: TipoIncidencia;
    justificantes?: Justificante[];
}

// ─── DTOs ──────────────────────────────────────────────────────────────────────

export interface CreateIncidenciaDto {
    id_empleado: number;
    id_tipo_incidencia: number;
    fecha_inicio: string; // 'YYYY-MM-DD'
    fecha_fin: string;    // 'YYYY-MM-DD'
    observaciones?: string;
}

export interface UpdateIncidenciaDto extends Partial<CreateIncidenciaDto> { }