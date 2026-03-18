import { Incidencia } from './Incidencias';

export interface TipoIncidencia {
    id_tipo_incidencia: number;
    nombre: string;
    descripcion?: string | null;

    // Relación opcional
    incidencias?: Incidencia[];
}

export interface CreateTipoIncidenciaDto {
    nombre: string;
    descripcion?: string;
}

export interface UpdateTipoIncidenciaDto extends Partial<CreateTipoIncidenciaDto> { }