import {
    CategoriaEmpleado,
    CreateCategoriaEmpleadoDto,
    UpdateCategoriaEmpleadoDto,
} from '../../types/CategoriaEmpleados';

const BASE_URL = 'http://localhost:3000/api/categorias-empleados';

// ─── GET todas ─────────────────────────────────────────────────────────────────

export async function getCategorias(): Promise<CategoriaEmpleado[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener categorías de empleado');
    return res.json();
}

// ─── POST crear ────────────────────────────────────────────────────────────────

export async function createCategoria(
    data: CreateCategoriaEmpleadoDto,
): Promise<CategoriaEmpleado> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al crear categoría');
    }
    return res.json();
}