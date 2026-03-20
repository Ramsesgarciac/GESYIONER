import { Justificante } from '@/types/justificante';

const BASE_URL = 'http://localhost:3000/api/justificantes';

// ─── POST upload (form-data) ──────────────────────────────────────────────────

export async function uploadJustificante(id_incidencia: number, file: File): Promise<Justificante> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/incidencia/${id_incidencia}`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al subir justificante');
    }
    return res.json();
}

// ─── GET todos ─────────────────────────────────────────────────────────────────

export async function getJustificantes(): Promise<Justificante[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener justificantes');
    return res.json();
}

// ─── GET por incidencia ────────────────────────────────────────────────────────

export async function getJustificantesByIncidencia(id_incidencia: number): Promise<Justificante[]> {
    const res = await fetch(`${BASE_URL}/incidencia/${id_incidencia}`);
    if (!res.ok) throw new Error(`Error al obtener justificantes de incidencia ${id_incidencia}`);
    return res.json();
}

// ─── GET download ─────────────────────────────────────────────────────────────

export async function downloadJustificante(id: number, nombre_archivo: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}/download`);
    if (!res.ok) throw new Error(`Error al descargar justificante ${id}`);

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre_archivo;
    a.click();
    URL.revokeObjectURL(url);
}

// ─── GET preview (blob url para iframe) ──────────────────────────────────────

export async function previewJustificante(id: number): Promise<string> {
    const res = await fetch(`${BASE_URL}/${id}/download`);
    if (!res.ok) throw new Error(`Error al obtener vista previa del justificante ${id}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
}

// ─── PATCH replace ────────────────────────────────────────────────────────────

export async function replaceJustificante(id: number, file: File): Promise<Justificante> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/${id}/replace`, {
        method: 'PATCH',
        body: formData,
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al reemplazar justificante');
    }
    return res.json();
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function deleteJustificante(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Error al eliminar justificante ${id}`);
}