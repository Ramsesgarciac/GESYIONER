import { Incidencia, CreateIncidenciaDto, UpdateIncidenciaDto } from '@/types/Incidencias';

const BASE_URL = 'http://localhost:3000/api/incidencias';
const incidenciaUrl = (id: number) => `${BASE_URL}/${id}`;

// ─── GET todas ─────────────────────────────────────────────────────────────────

export async function getIncidencias(): Promise<Incidencia[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener incidencias');
    return res.json();
}

// ─── GET por ID ────────────────────────────────────────────────────────────────

export async function getIncidenciaById(id: number): Promise<Incidencia> {
    const res = await fetch(incidenciaUrl(id));
    if (!res.ok) throw new Error(`Error al obtener incidencia con ID ${id}`);
    return res.json();
}

// ─── GET por empleado ──────────────────────────────────────────────────────────

export async function getIncidenciasByEmpleado(id_empleado: number): Promise<Incidencia[]> {
    const res = await fetch(`${BASE_URL}/empleado/${id_empleado}`);
    if (!res.ok) throw new Error(`Error al obtener incidencias del empleado ${id_empleado}`);
    return res.json();
}

// ─── POST crear ────────────────────────────────────────────────────────────────

export async function createIncidencia(data: CreateIncidenciaDto): Promise<Incidencia> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al crear incidencia');
    }
    return res.json();
}

// ─── PATCH actualizar ──────────────────────────────────────────────────────────

export async function updateIncidencia(id: number, data: UpdateIncidenciaDto): Promise<Incidencia> {
    const payload = {
        ...data,
        ...(data.id_empleado !== undefined ? { id_empleado: Number(data.id_empleado) } : {}),
        ...(data.id_tipo_incidencia !== undefined ? { id_tipo_incidencia: Number(data.id_tipo_incidencia) } : {}),
    };

    const res = await fetch(incidenciaUrl(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al actualizar incidencia');
    }
    return res.json();
}

// ─── DELETE eliminar ───────────────────────────────────────────────────────────

export async function deleteIncidencia(id: number): Promise<void> {
    const res = await fetch(incidenciaUrl(id), { method: 'DELETE' });
    if (!res.ok) throw new Error(`Error al eliminar incidencia con ID ${id}`);
}
