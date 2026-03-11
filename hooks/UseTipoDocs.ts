import { useState, useEffect, useCallback } from 'react';
import { TipoDoc, CreateTipoDocDto, UpdateTipoDocDto } from '@/types/TipoDocs';
import {
    getTiposDocs,
    getTipoDocById,
    createTipoDoc,
    updateTipoDoc,
} from '../lib/services/TipoDoc.service';

// ─── useTiposDocs (lista completa) ────────────────────────────────────────────

export function useTiposDocs() {
    const [tiposDocs, setTiposDocs] = useState<TipoDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTiposDocs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTiposDocs();
            setTiposDocs(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTiposDocs();
    }, [fetchTiposDocs]);

    // ─── Crear ──────────────────────────────────────────────────────────────────

    const crear = useCallback(async (dto: CreateTipoDocDto): Promise<TipoDoc> => {
        const nuevo = await createTipoDoc(dto);
        setTiposDocs(prev => [...prev, nuevo].sort((a, b) => a.orden - b.orden));
        return nuevo;
    }, []);

    // ─── Actualizar ─────────────────────────────────────────────────────────────

    const actualizar = useCallback(async (id: number, dto: UpdateTipoDocDto): Promise<TipoDoc> => {
        const actualizado = await updateTipoDoc(id, dto);
        setTiposDocs(prev =>
            prev
                .map(t => (t.id_tipo_doc === id ? actualizado : t))
                .sort((a, b) => a.orden - b.orden)
        );
        return actualizado;
    }, []);

    return {
        tiposDocs,
        loading,
        error,
        refetch: fetchTiposDocs,
        crear,
        actualizar,
    };
}

// ─── useTipoDoc (uno por ID) ──────────────────────────────────────────────────

export function useTipoDoc(id: number | null) {
    const [tipoDoc, setTipoDoc] = useState<TipoDoc | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTipoDoc = useCallback(async () => {
        if (id === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getTipoDocById(id);
            setTipoDoc(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTipoDoc();
    }, [fetchTipoDoc]);

    return { tipoDoc, loading, error, refetch: fetchTipoDoc };
}