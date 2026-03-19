import { Evento, CreateEventoDto, UpdateEventoDto } from '@/types/Evento';

const BASE_URL = 'http://localhost:3000/api/eventos';

export async function getEventosByEmpleado(id_empleado: number): Promise<Evento[]> {
    const res = await fetch(`${BASE_URL}/empleado/${id_empleado}`);
    if (!res.ok) throw new Error(`Error al obtener eventos del empleado ${id_empleado}`);
    return res.json();
}

export async function getEventoById(id: number): Promise<Evento> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error(`Error al obtener evento con ID ${id}`);
    return res.json();
}

export async function createEvento(data: CreateEventoDto): Promise<Evento> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al crear evento');
    }
    return res.json();
}

export async function updateEvento(id: number, data: UpdateEventoDto): Promise<Evento> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al actualizar evento');
    }
    return res.json();
}

export async function deleteEvento(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Error al eliminar evento con ID ${id}`);
}