export interface CatalogoEvento {
    id_tipo_evento: number;
    nombre_evento: string;
    descripcion?: string | null;
}

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
    tipoEvento?: CatalogoEvento;
}

export interface CreateEventoDto {
    id_empleado: number;
    id_tipo_evento: number;
    fecha_evento: string; // 'YYYY-MM-DD'
    cargo_anterior?: string;
    cargo_nuevo?: string;
    salario_anterior?: number;
    salario_nuevo?: number;
}

export interface UpdateEventoDto extends Partial<Omit<CreateEventoDto, 'id_empleado'>> { }