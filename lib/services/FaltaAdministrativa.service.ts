import {
    FaltaAdministrativa,
    CreateFaltaAdministrativaDto,
    UpdateFaltaAdministrativaDto,
} from '../../types/falta-administrativa';

const BASE_URL = 'http://localhost:3000/api/faltas-administrativas';

// ─── POST crear ────────────────────────────────────────────────────────────────

export async function createFaltaAdministrativa(
    data: CreateFaltaAdministrativaDto
): Promise<FaltaAdministrativa> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al crear falta administrativa');
    }
    return res.json();
}

// ─── GET por empleado ──────────────────────────────────────────────────────────

export async function getFaltasByEmpleado(
    id_empleado: number
): Promise<FaltaAdministrativa[]> {
    const res = await fetch(`${BASE_URL}/empleado/${id_empleado}`);
    if (!res.ok)
        throw new Error(`Error al obtener faltas del empleado ${id_empleado}`);
    return res.json();
}

// ─── PATCH actualizar ──────────────────────────────────────────────────────────

export async function updateFaltaAdministrativa(
    id: number,
    data: UpdateFaltaAdministrativaDto
): Promise<FaltaAdministrativa> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al actualizar falta administrativa');
    }
    return res.json();
}

// ─── DELETE eliminar ───────────────────────────────────────────────────────────

export async function deleteFaltaAdministrativa(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok)
        throw new Error(`Error al eliminar falta administrativa con ID ${id}`);
}