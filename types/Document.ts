import { Empleado } from '../empleado/empleado.types';
import { TipoDoc } from '../tipo-doc/tipo-doc.types';

// ─── DocEmpleado principal ────────────────────────────────────────────────────

export interface DocEmpleado {
    id_doc_empleado: number;
    id_empleado: number;
    id_tipo_doc: number;
    nombre_archivo: string;
    ruta_archivo: string;
    fecha_carga: string;
    activo: boolean;
    fecha_actualizacion: string;
    version: number;

    // Relaciones opcionales
    empleado?: Empleado;
    tipoDoc?: TipoDoc;
}

// ─── Listado de documentos (respuesta de /listado/:id_empleado) ───────────────

export interface DocumentoListadoItem {
    id_tipo_doc: number;
    nombre_doc: string;
    descripcion?: string | null;
    obligatorio: boolean;
    orden: number;
    subido: boolean;
    documento: {
        id_doc_empleado: number;
        nombre_archivo: string;
        fecha_carga: string;
        version: number;
        fecha_actualizacion: string;
    } | null;
}

export interface EstadisticasDocumentos {
    total_documentos: number;
    documentos_obligatorios: number;
    documentos_subidos: number;
    obligatorios_subidos: number;
    obligatorios_pendientes: number;
    porcentaje_completado: number;
}

export interface ListadoDocumentosResponse {
    empleado: {
        id_empleado: number;
        nombre: string;
        numero_empleado: number;
    };
    estadisticas: EstadisticasDocumentos;
    documentos: DocumentoListadoItem[];
}

// ─── Historial de documento ───────────────────────────────────────────────────

export interface VersionDocumento {
    id_doc_empleado: number;
    nombre_archivo: string;
    version: number;
    activo: boolean;
    fecha_carga: string;
    fecha_actualizacion: string;
}

export interface HistorialDocumentoResponse {
    tipo_documento: {
        id_tipo_doc: number;
        nombre_doc: string;
        descripcion?: string | null;
    };
    total_versiones: number;
    versiones: VersionDocumento[];
}

// ─── DTO upload (form-data) ───────────────────────────────────────────────────

export interface UploadDocumentoDto {
    id_empleado: number;
    id_tipo_doc: number;
    file: File;
}