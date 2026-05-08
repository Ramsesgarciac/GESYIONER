import { TipoContrato } from './TipoContrato';

export interface Contrato {
    id_contrato: number;
    id_empleado: number;
    id_tipo_contrato: number;
    nombre_archivo: string;
    ruta_archivo: string;
    fecha_inicio: string;
    fecha_fin: string;
    fecha_carga: string;
    vigente: boolean;
    empleado?: { id_empleado: number; nombre: string };
    tipoContrato?: TipoContrato;
}

export interface UploadContratoDto {
    id_empleado: number;
    id_tipo_contrato: number;
    fecha_inicio: string; // 'YYYY-MM-DD'
    fecha_fin: string;    // 'YYYY-MM-DD'
    file: File;
}

export interface UpdateContratoDto {
    fecha_inicio?: string;
    fecha_fin?: string;
    vigente?: boolean;
}