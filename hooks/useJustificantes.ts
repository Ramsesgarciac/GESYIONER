import { useState, useEffect, useCallback } from 'react';
import { Justificante } from '@/types/justificante';
import {
    uploadJustificante,
    getJustificantesByIncidencia,
    downloadJustificante,
    replaceJustificante,
    deleteJustificante,
} from '../lib/services/Justificante.service';

// ─── useJustificantesByIncidencia ─────────────────────────────────────────────

export function useJustificantesByIncidencia(id_incidencia: number | null) {
    const [justificantes, setJustificantes] = useState<Justificante[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchJustificantes = useCallback(async () => {
        if (id_incidencia === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getJustificantesByIncidencia(id_incidencia);
            setJustificantes(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id_incidencia]);

    useEffect(() => { fetchJustificantes(); }, [fetchJustificantes]);

    // ─── Subir ──────────────────────────────────────────────────────────────────

    const subir = useCallback(async (file: File): Promise<Justificante> => {
        if (!id_incidencia) throw new Error('id_incidencia requerido');
        const nuevo = await uploadJustificante(id_incidencia, file);
        setJustificantes(prev => [nuevo, ...prev]);
        return nuevo;
    }, [id_incidencia]);

    // ─── Reemplazar ─────────────────────────────────────────────────────────────

    const reemplazar = useCallback(async (id: number, file: File): Promise<Justificante> => {
        const actualizado = await replaceJustificante(id, file);
        setJustificantes(prev => prev.map(j => j.id_justificante === id ? actualizado : j));
        return actualizado;
    }, []);

    // ─── Descargar ──────────────────────────────────────────────────────────────

    const descargar = useCallback(async (id: number, nombre: string): Promise<void> => {
        await downloadJustificante(id, nombre);
    }, []);

    // ─── Eliminar ───────────────────────────────────────────────────────────────

    const eliminar = useCallback(async (id: number): Promise<void> => {
        await deleteJustificante(id);
        setJustificantes(prev => prev.filter(j => j.id_justificante !== id));
    }, []);

    return {
        justificantes,
        loading,
        error,
        refetch: fetchJustificantes,
        subir,
        reemplazar,
        descargar,
        eliminar,
    };
}