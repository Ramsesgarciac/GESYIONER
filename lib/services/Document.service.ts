import {
    DocEmpleado,
    ListadoDocumentosResponse,
    HistorialDocumentoResponse,
    UploadDocumentoDto,
} from '@/types/Document';

const BASE_URL = 'http://localhost:3000/api/documentos-empleados';

// ─── POST upload (form-data) ──────────────────────────────────────────────────

export async function uploadDocumento(dto: UploadDocumentoDto): Promise<DocEmpleado> {
    const formData = new FormData();
    formData.append('id_empleado', String(dto.id_empleado));
    formData.append('id_tipo_doc', String(dto.id_tipo_doc));
    formData.append('file', dto.file);

    const res = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        // NO establecer Content-Type, el browser lo pone con el boundary automáticamente
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? 'Error al subir documento');
    }
    return res.json();
}

// ─── GET listado completo del empleado ────────────────────────────────────────

export async function getListadoDocumentos(id_empleado: number): Promise<ListadoDocumentosResponse> {
    const res = await fetch(`${BASE_URL}/listado/${id_empleado}`);
    if (!res.ok) throw new Error(`Error al obtener listado de documentos del empleado ${id_empleado}`);
    return res.json();
}

// ─── GET documentos activos del empleado ─────────────────────────────────────

export async function getDocumentosByEmpleado(id_empleado: number): Promise<DocEmpleado[]> {
    const res = await fetch(`${BASE_URL}/empleado/${id_empleado}`);
    if (!res.ok) throw new Error(`Error al obtener documentos del empleado ${id_empleado}`);
    return res.json();
}

// ─── GET por ID ───────────────────────────────────────────────────────────────

export async function getDocumentoById(id: number): Promise<DocEmpleado> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error(`Error al obtener documento con ID ${id}`);
    return res.json();
}

// ─── GET historial de versiones ───────────────────────────────────────────────

export async function getHistorialDocumento(
    id_empleado: number,
    id_tipo_doc: number
): Promise<HistorialDocumentoResponse> {
    const res = await fetch(`${BASE_URL}/historial/${id_empleado}/${id_tipo_doc}`);
    if (!res.ok) throw new Error('Error al obtener historial del documento');
    return res.json();
}

// ─── GET download (descarga de archivo) ──────────────────────────────────────

export async function downloadDocumento(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}/download`);
    if (!res.ok) throw new Error(`Error al descargar documento con ID ${id}`);

    const disposition = res.headers.get('Content-Disposition') ?? '';
    const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    const filename = match ? match[1].replace(/['"]/g, '') : `documento_${id}`;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ─── PATCH activar versión ────────────────────────────────────────────────────

export async function activarVersion(id: number): Promise<DocEmpleado> {
    const res = await fetch(`${BASE_URL}/${id}/activar`, {
        method: 'PATCH',
    });
    if (!res.ok) throw new Error(`Error al activar versión del documento ${id}`);
    return res.json();
}