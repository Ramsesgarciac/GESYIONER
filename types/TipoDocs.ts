// ─── Relaciones ────────────────────────────────────────────────────────────────

export interface DocEmpleado {
    id_doc_empleado: number;
    id_empleado: number;
    id_tipo_doc: number;
    url: string;
    fecha_subida: string;
}

// ─── TipoDoc principal ─────────────────────────────────────────────────────────

export interface TipoDoc {
    id_tipo_doc: number;
    nombre_doc: string;
    descripcion?: string | null;
    obligatorio: boolean;
    orden: number;
    activo: boolean;

    // Relación (opcional según endpoint)
    documentos?: DocEmpleado[];
}

// ─── DTOs ──────────────────────────────────────────────────────────────────────

export interface CreateTipoDocDto {
    nombre_doc: string;
    descripcion?: string;
    obligatorio: boolean;
    orden: number;
    activo: boolean;
}

export interface UpdateTipoDocDto extends Partial<CreateTipoDocDto> { }