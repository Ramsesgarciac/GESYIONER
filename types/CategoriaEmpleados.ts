import { Empleado } from './Empleado';

// ─── CatActividades (referencia ligera) ────────────────────────────────────────

export interface CatActividades {
    id_cat_actividad: number;
    nombre: string;
    descripcion?: string;
}

// ─── CategoriaEmpleado principal ──────────────────────────────────────────────

export interface CategoriaEmpleado {
    id_cat_empleado: number;
    nombre: string;
    descripcion?: string | null;

    // Relaciones (opcionales según endpoint)
    empleados?: Empleado[];
    actividades?: CatActividades[];
}

// ─── DTOs ──────────────────────────────────────────────────────────────────────

export interface CreateCategoriaEmpleadoDto {
    nombre: string;
    descripcion?: string;
}

export interface UpdateCategoriaEmpleadoDto extends Partial<CreateCategoriaEmpleadoDto> { }