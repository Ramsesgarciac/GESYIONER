export interface TipoContrato {
    id_tipo_contrato: number;
    nombre: string;
    descripcion?: string | null;
}

export interface CreateTipoContratoDto {
    nombre: string;
    descripcion?: string;
}

export interface UpdateTipoContratoDto extends Partial<CreateTipoContratoDto> { }