import { Contrato, UploadContratoDto, UpdateContratoDto } from '@/types/Contrato';

const BASE_URL = 'http://localhost:3000/api/contratos';

// ─── GET todos ────────────────────────────────────────────────────────────────
export async function getContratos(): Promise<Contrato[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener contratos');
    return res.json();
}

// ─── GET por ID ───────────────────────────────────────────────────────────────
export async function getContratoById(id: number): Promise<Contrato> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error(`Error al obtener contrato con ID ${id}`);
    return res.json();
}

// ─── GET por empleado ─────────────────────────────────────────────────────────
export async function getContratosByEmpleado(id_empleado: number): Promise<Contrato[]> {
    const res = await fetch(`${BASE_URL}/empleado/${id_empleado}`);
    if (!res.ok) throw new Error(`Error al obtener contratos del empleado ${id_empleado}`);
    return res.json();
}

// ─── GET vigentes por empleado ────────────────────────────────────────────────
export async function getContratosVigentes(id_empleado: number): Promise<Contrato[]> {
    const res = await fetch(`${BASE_URL}/vigentes/${id_empleado}`);
    if (!res.ok) throw new Error(`Error al obtener contratos vigentes del empleado ${id_empleado}`);
    return res.json();
}

// ─── POST upload (form-data) ──────────────────────────────────────────────────
export async function uploadContrato(dto: UploadContratoDto): Promise<Contrato> {
    const formData = new FormData();
    formData.append('id_empleado', String(dto.id_empleado));
    formData.append('id_tipo_contrato', String(dto.id_tipo_contrato));
    formData.append('fecha_inicio', dto.fecha_inicio);
    formData.append('fecha_fin', dto.fecha_fin);
    formData.append('file', dto.file);

    const res = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al subir contrato');
    }
    return res.json();
}

// ─── PATCH actualizar datos ───────────────────────────────────────────────────
export async function updateContrato(id: number, data: UpdateContratoDto): Promise<Contrato> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al actualizar contrato');
    }
    return res.json();
}

// ─── PATCH replace archivo ────────────────────────────────────────────────────
export async function replaceContratoFile(id: number, file: File): Promise<Contrato> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/${id}/replace`, {
        method: 'PATCH',
        body: formData,
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al reemplazar archivo del contrato');
    }
    return res.json();
}

// ─── PATCH marcar no vigente ──────────────────────────────────────────────────
export async function marcarContratoNoVigente(id: number): Promise<Contrato> {
    const res = await fetch(`${BASE_URL}/${id}/no-vigente`, { method: 'PATCH' });
    if (!res.ok) throw new Error(`Error al marcar contrato ${id} como no vigente`);
    return res.json();
}

// ─── GET download ─────────────────────────────────────────────────────────────
export async function downloadContrato(id: number, nombre_archivo: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}/download`);
    if (!res.ok) throw new Error(`Error al descargar contrato con ID ${id}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre_archivo;
    a.click();
    URL.revokeObjectURL(url);
}