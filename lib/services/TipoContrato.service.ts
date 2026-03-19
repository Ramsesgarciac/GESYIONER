import { TipoContrato, CreateTipoContratoDto, UpdateTipoContratoDto } from '@/types/TipoContrato';

const BASE_URL = 'http://localhost:3000/api/tipos-contratos';

export async function getTiposContratos(): Promise<TipoContrato[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener tipos de contrato');
    return res.json();
}

export async function getTipoContratoById(id: number): Promise<TipoContrato> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error(`Error al obtener tipo de contrato con ID ${id}`);
    return res.json();
}

export async function createTipoContrato(data: CreateTipoContratoDto): Promise<TipoContrato> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al crear tipo de contrato');
    }
    return res.json();
}

export async function updateTipoContrato(id: number, data: UpdateTipoContratoDto): Promise<TipoContrato> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al actualizar tipo de contrato');
    }
    return res.json();
}

export async function deleteTipoContrato(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Error al eliminar tipo de contrato con ID ${id}`);
}