import { useState, useEffect, useCallback } from 'react';
import { Incidencia, CreateIncidenciaDto, UpdateIncidenciaDto } from './incidencia.types';
import {
    getIncidencias,
    getIncidenciaById,
    getIncidenciasByEmpleado,
    createIncidencia,
    updateIncidencia,
    deleteIncidencia,
} from './incidencia.service';

// ─── useIncidencias (lista global) ────────────────────────────────────────────

export function useIncidencias() {
    const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchIncidencias = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getIncidencias();
            setIncidencias(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchIncidencias(); }, [fetchIncidencias]);

    // ─── Crear ──────────────────────────────────────────────────────────────────

    const crear = useCallback(async (dto: CreateIncidenciaDto): Promise<Incidencia> => {
        const nueva = await createIncidencia(dto);
        setIncidencias(prev => [nueva, ...prev]);
        return nueva;
    }, []);

    // ─── Actualizar ─────────────────────────────────────────────────────────────

    const actualizar = useCallback(async (id: number, dto: UpdateIncidenciaDto): Promise<Incidencia> => {
        const actualizada = await updateIncidencia(id, dto);
        setIncidencias(prev => prev.map(i => i.id_incidencia === id ? actualizada : i));
        return actualizada;
    }, []);

    // ─── Eliminar ───────────────────────────────────────────────────────────────

    const eliminar = useCallback(async (id: number): Promise<void> => {
        await deleteIncidencia(id);
        setIncidencias(prev => prev.filter(i => i.id_incidencia !== id));
    }, []);

    return {
        incidencias,
        loading,
        error,
        refetch: fetchIncidencias,
        crear,
        actualizar,
        eliminar,
    };
}

// ─── useIncidenciasByEmpleado ─────────────────────────────────────────────────

export function useIncidenciasByEmpleado(id_empleado: number | null) {
    const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIncidencias = useCallback(async () => {
        if (id_empleado === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getIncidenciasByEmpleado(id_empleado);
            setIncidencias(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id_empleado]);

    useEffect(() => { fetchIncidencias(); }, [fetchIncidencias]);

    // ─── Crear (dentro del contexto del empleado) ────────────────────────────

    const crear = useCallback(async (dto: CreateIncidenciaDto): Promise<Incidencia> => {
        const nueva = await createIncidencia(dto);
        setIncidencias(prev => [nueva, ...prev]);
        return nueva;
    }, []);

    // ─── Actualizar ─────────────────────────────────────────────────────────────

    const actualizar = useCallback(async (id: number, dto: UpdateIncidenciaDto): Promise<Incidencia> => {
        const actualizada = await updateIncidencia(id, dto);
        setIncidencias(prev => prev.map(i => i.id_incidencia === id ? actualizada : i));
        return actualizada;
    }, []);

    // ─── Eliminar ───────────────────────────────────────────────────────────────

    const eliminar = useCallback(async (id: number): Promise<void> => {
        await deleteIncidencia(id);
        setIncidencias(prev => prev.filter(i => i.id_incidencia !== id));
    }, []);

    return {
        incidencias,
        loading,
        error,
        refetch: fetchIncidencias,
        crear,
        actualizar,
        eliminar,
    };
}

// ─── useIncidencia (una por ID) ───────────────────────────────────────────────

export function useIncidencia(id: number | null) {
    const [incidencia, setIncidencia] = useState<Incidencia | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchIncidencia = useCallback(async () => {
        if (id === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getIncidenciaById(id);
            setIncidencia(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchIncidencia(); }, [fetchIncidencia]);

    return { incidencia, loading, error, refetch: fetchIncidencia };
}