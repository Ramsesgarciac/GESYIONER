// ─── Relaciones ───────────────────────────────────────────────────────────────


export interface CategoriaEmpleado {
    id_categoria: number;
    nombre: string;
}

export interface Incidencia {
    id_incidencia: number;
    descripcion: string;
    fecha: string;
}

export interface DocEmpleado {
    id_documento: number;
    nombre: string;
    url: string;
}

export interface Contrato {
    id_contrato: number;
    tipo: string;
    fecha_inicio: string;
    fecha_fin?: string;
}

export interface HojaVida {
    id_hoja_vida: number;
    id_empleado: number;
    empleado?: Empleado;
}


// ─── Empleado principal ────────────────────────────────────────────────────────

export interface Empleado {
    id_empleado: number;
    nombre: string;
    curp: string;
    rfc: string;
    numero_seguridad_social: string;
    discapacidad?: string | null;
    puesto: string;
    area_asignada: string;
    numero_empleado: number;
    activo: boolean;
    id_categoria: number;
    salario_actual?: number | null;
    fecha_creacion: string;

    // Relaciones (opcionales según endpoint)
    categoria?: CategoriaEmpleado;
    incidencias?: Incidencia[];
    documentos?: DocEmpleado[];
    hojaVida?: HojaVida | null;
    contratos?: Contrato[];
}

// ─── DTOs ──────────────────────────────────────────────────────────────────────

export interface CreateEmpleadoDto {
    nombre: string;
    curp: string;
    rfc: string;
    numero_seguridad_social?: string
    discapacidad?: string;
    puesto: string;
    area_asignada: string;
    numero_empleado: number;
    id_categoria: number;
    salario_actual?: number;
}

export interface UpdateEmpleadoDto extends Partial<CreateEmpleadoDto> { }

// ─── Filtros ───────────────────────────────────────────────────────────────────

export type EmpleadoEstado = 'todos' | 'activos' | 'inactivos';