import { Incidencia } from './Incidencias';

export interface Justificante {
    id_justificante: number;
    id_incidencia: number;
    nombre_archivo: string;
    ruta_archivo: string;
    fecha_subida: string;

    // Relación opcional
    incidencia?: Incidencia;
}

export interface UploadJustificanteDto {
    id_incidencia: number;
    file: File;
}