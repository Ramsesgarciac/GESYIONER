import {
    Empleado,
    CreateEmpleadoDto,
    UpdateEmpleadoDto,
} from '../../types/Empleado';

const BASE_URL = 'http://localhost:3000/api/empleados';

// ─── GET todos ─────────────────────────────────────────────────────────────────

export async function getEmpleados(): Promise<Empleado[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener empleados');
    return res.json();
}

// ─── GET activos ───────────────────────────────────────────────────────────────

export async function getEmpleadosActivos(): Promise<Empleado[]> {
    const res = await fetch(`${BASE_URL}/activos`);
    if (!res.ok) throw new Error('Error al obtener empleados activos');
    return res.json();
}

// ─── GET inactivos ─────────────────────────────────────────────────────────────

export async function getEmpleadosInactivos(): Promise<Empleado[]> {
    const res = await fetch(`${BASE_URL}/inactivos`);
    if (!res.ok) throw new Error('Error al obtener empleados inactivos');
    return res.json();
}

// ─── GET por ID ────────────────────────────────────────────────────────────────

export async function getEmpleadoById(id: number): Promise<Empleado> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error(`Error al obtener empleado con ID ${id}`);
    return res.json();
}

// ─── GET por categoría ─────────────────────────────────────────────────────────

export async function getEmpleadosByCategoria(idCategoria: number): Promise<Empleado[]> {
    const res = await fetch(`${BASE_URL}/categoria/${idCategoria}`);
    if (!res.ok) throw new Error(`Error al obtener empleados de categoría ${idCategoria}`);
    return res.json();
}

// ─── POST crear ────────────────────────────────────────────────────────────────

export async function createEmpleado(data: CreateEmpleadoDto): Promise<Empleado> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al crear empleado');
    }
    return res.json();
}

// ─── PATCH actualizar ──────────────────────────────────────────────────────────

export async function updateEmpleado(id: number, data: UpdateEmpleadoDto): Promise<Empleado> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al actualizar empleado');
    }
    return res.json();
}

 // ─── PATCH desactivar ──────────────────────────────────────────────────────────

 export async function deactivateEmpleado(id: number): Promise<Empleado> {
     const res = await fetch(`${BASE_URL}/${id}/desactivar`, {
         method: 'PATCH',
     });
     if (!res.ok) throw new Error(`Error al desactivar empleado con ID ${id}`);
     return res.json();
 }

 // ─── PATCH activar ──────────────────────────────────────────────────────────────

 export async function activateEmpleado(id: number): Promise<Empleado> {
     const res = await fetch(`${BASE_URL}/${id}/activar`, {
         method: 'PATCH',
     });
     if (!res.ok) throw new Error(`Error al activar empleado con ID ${id}`);
     return res.json();
 }