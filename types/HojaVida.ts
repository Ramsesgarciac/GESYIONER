import { Empleado } from './Empleado';

export interface Evento {
    id_evento: number;
    id_hoja_vida: number;
    id_tipo_evento: number;
    fecha_evento: string;
    cargo_anterior?: string | null;
    cargo_nuevo?: string | null;
    salario_anterior?: number | null;
    salario_nuevo?: number | null;
    fecha_registro: string;
    tipoEvento?: { id_tipo_evento: number; nombre_evento: string; descripcion?: string | null };
}

export interface HojaVida {
    id_hoja_vida: number;
    id_empleado: number;
    empleado?: Empleado;
    eventos?: Evento[];
}

export interface ResumenHojaVida {
    id_empleado: number;
    nombre?: string;
    total_eventos?: number;
    salario_actual?: number | null;
    cargo_actual?: string | null;
    fecha_ingreso?: string | null;
    [key: string]: unknown;
}