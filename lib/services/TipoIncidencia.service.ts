import { TipoIncidencia, CreateTipoIncidenciaDto, UpdateTipoIncidenciaDto } from './tipo-incidencia.types';

const BASE_URL = 'http://localhost:3000/api/tipos-incidencias';

export async function getTiposIncidencias(): Promise<TipoIncidencia[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener tipos de incidencia');
    return res.json();
}

export async function getTipoIncidenciaById(id: number): Promise<TipoIncidencia> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error(`Error al obtener tipo de incidencia con ID ${id}`);
    return res.json();
}

export async function createTipoIncidencia(data: CreateTipoIncidenciaDto): Promise<TipoIncidencia> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al crear tipo de incidencia');
    }
    return res.json();
}

export async function updateTipoIncidencia(id: number, data: UpdateTipoIncidenciaDto): Promise<TipoIncidencia> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al actualizar tipo de incidencia');
    }
    return res.json();
}

export async function deleteTipoIncidencia(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Error al eliminar tipo de incidencia con ID ${id}`);
}