import { CatalogoEvento, CreateCatalogoEventoDto } from '@/types/CatalogoEventos';

const BASE_URL = 'http://localhost:3000/api/catalogo-eventos';

export async function getCatalogoEventos(): Promise<CatalogoEvento[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener catálogo de eventos');
    return res.json();
}

export async function createCatalogoEvento(data: CreateCatalogoEventoDto): Promise<CatalogoEvento> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al crear evento en catálogo');
    }
    return res.json();
}