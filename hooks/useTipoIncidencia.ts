import { useState, useEffect, useCallback } from 'react';
import { TipoIncidencia, CreateTipoIncidenciaDto, UpdateTipoIncidenciaDto } from '@/types/TipoIincidencia';
import {
    getTiposIncidencias,
    createTipoIncidencia,
    updateTipoIncidencia,
    deleteTipoIncidencia,
} from '../lib/services/TipoIncidencia.service';

export function useTiposIncidencias() {
    const [tiposIncidencias, setTiposIncidencias] = useState<TipoIncidencia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTipos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTiposIncidencias();
            setTiposIncidencias(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTipos(); }, [fetchTipos]);

    const crear = useCallback(async (dto: CreateTipoIncidenciaDto): Promise<TipoIncidencia> => {
        const nuevo = await createTipoIncidencia(dto);
        setTiposIncidencias(prev => [...prev, nuevo]);
        return nuevo;
    }, []);

    const actualizar = useCallback(async (id: number, dto: UpdateTipoIncidenciaDto): Promise<TipoIncidencia> => {
        const actualizado = await updateTipoIncidencia(id, dto);
        setTiposIncidencias(prev => prev.map(t => t.id_tipo_incidencia === id ? actualizado : t));
        return actualizado;
    }, []);

    const eliminar = useCallback(async (id: number): Promise<void> => {
        await deleteTipoIncidencia(id);
        setTiposIncidencias(prev => prev.filter(t => t.id_tipo_incidencia !== id));
    }, []);

    return { tiposIncidencias, loading, error, refetch: fetchTipos, crear, actualizar, eliminar };
}