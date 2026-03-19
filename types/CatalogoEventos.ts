export interface CatalogoEvento {
    id_tipo_evento: number;
    nombre_evento: string;
    descripcion?: string | null;
}

export interface CreateCatalogoEventoDto {
    nombre_evento: string;
    descripcion?: string;
}

export interface UpdateCatalogoEventoDto extends Partial<CreateCatalogoEventoDto> { }