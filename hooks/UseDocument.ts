import { useState, useEffect, useCallback } from 'react';
import {
    DocEmpleado,
    ListadoDocumentosResponse,
    HistorialDocumentoResponse,
    UploadDocumentoDto,
} from '@/types/Document';
import {
    uploadDocumento,
    getListadoDocumentos,
    getDocumentosByEmpleado,
    getDocumentoById,
    getHistorialDocumento,
    downloadDocumento,
    activarVersion,
    replaceDocumento,
} from '../lib/services/Document.service';

// ─── useListadoDocumentos ─────────────────────────────────────────────────────
// Listado completo con estadísticas (para la vista de documentos del empleado)

export function useListadoDocumentos(id_empleado: number | null) {
    const [listado, setListado] = useState<ListadoDocumentosResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const fetchListado = useCallback(async () => {
        if (id_empleado === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getListadoDocumentos(id_empleado);
            setListado(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id_empleado]);

    useEffect(() => {
        fetchListado();
    }, [fetchListado]);

    // ─── Subir documento ────────────────────────────────────────────────────────

    const subir = useCallback(async (dto: UploadDocumentoDto): Promise<DocEmpleado> => {
        setUploading(true);
        try {
            const nuevo = await uploadDocumento(dto);
            await fetchListado(); // Refresca el listado con las estadísticas actualizadas
            return nuevo;
        } finally {
            setUploading(false);
        }
    }, [fetchListado]);

    const reemplazar = useCallback(async (id_doc_empleado: number, file: File): Promise<DocEmpleado> => {
        setUploading(true);
        try {
            const actualizado = await replaceDocumento(id_doc_empleado, file);
            await fetchListado();
            return actualizado;
        } finally {
            setUploading(false);
        }
    }, [fetchListado]);

    // ─── Descargar documento ────────────────────────────────────────────────────

    const descargar = useCallback(async (id: number): Promise<void> => {
        await downloadDocumento(id);
    }, []);

    return {
        listado,
        loading,
        error,
        uploading,
        refetch: fetchListado,
        subir,
        reemplazar,
        descargar,
    };
}

// ─── useDocumentosByEmpleado ──────────────────────────────────────────────────
// Solo los documentos activos del empleado (sin estadísticas)

export function useDocumentosByEmpleado(id_empleado: number | null) {
    const [documentos, setDocumentos] = useState<DocEmpleado[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDocumentos = useCallback(async () => {
        if (id_empleado === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getDocumentosByEmpleado(id_empleado);
            setDocumentos(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id_empleado]);

    useEffect(() => {
        fetchDocumentos();
    }, [fetchDocumentos]);

    return { documentos, loading, error, refetch: fetchDocumentos };
}

// ─── useHistorialDocumento ────────────────────────────────────────────────────
// Historial de versiones de un tipo de documento para un empleado

export function useHistorialDocumento(
    id_empleado: number | null,
    id_tipo_doc: number | null
) {
    const [historial, setHistorial] = useState<HistorialDocumentoResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistorial = useCallback(async () => {
        if (id_empleado === null || id_tipo_doc === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getHistorialDocumento(id_empleado, id_tipo_doc);
            setHistorial(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id_empleado, id_tipo_doc]);

    useEffect(() => {
        fetchHistorial();
    }, [fetchHistorial]);

    // ─── Activar versión ────────────────────────────────────────────────────────

    const activar = useCallback(async (id: number): Promise<void> => {
        await activarVersion(id);
        await fetchHistorial();
    }, [fetchHistorial]);

    return { historial, loading, error, refetch: fetchHistorial, activar };
}

// ─── useDocumento ─────────────────────────────────────────────────────────────
// Un documento por ID

export function useDocumento(id: number | null) {
    const [documento, setDocumento] = useState<DocEmpleado | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDocumento = useCallback(async () => {
        if (id === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getDocumentoById(id);
            setDocumento(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDocumento();
    }, [fetchDocumento]);

    return { documento, loading, error, refetch: fetchDocumento };
}
