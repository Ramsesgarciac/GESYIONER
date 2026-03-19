import { TipoDoc, CreateTipoDocDto, UpdateTipoDocDto } from '@/types/TipoDocs';

const BASE_URL = 'http://localhost:3000/api/tipos-documentos';

// ─── GET todos ─────────────────────────────────────────────────────────────────

export async function getTiposDocs(): Promise<TipoDoc[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener tipos de documento');
    return res.json();
}

// ─── GET por ID ────────────────────────────────────────────────────────────────

export async function getTipoDocById(id: number): Promise<TipoDoc> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error(`Error al obtener tipo de documento con ID ${id}`);
    return res.json();
}

// ─── POST crear ────────────────────────────────────────────────────────────────

export async function createTipoDoc(data: CreateTipoDocDto): Promise<TipoDoc> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al crear tipo de documento');
    }
    return res.json();
}

// ─── PATCH actualizar ──────────────────────────────────────────────────────────

export async function updateTipoDoc(id: number, data: UpdateTipoDocDto): Promise<TipoDoc> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al actualizar tipo de documento');
    }
    return res.json();
}