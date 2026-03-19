import { useState, useEffect, useCallback } from 'react';
import { TipoContrato, CreateTipoContratoDto, UpdateTipoContratoDto } from '@/types/TipoContrato';
import { getTiposContratos, createTipoContrato, updateTipoContrato, deleteTipoContrato } from '../lib/services/TipoContrato.service';

export function useTiposContratos() {
    const [tiposContratos, setTiposContratos] = useState<TipoContrato[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTipos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTiposContratos();
            setTiposContratos(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTipos(); }, [fetchTipos]);

    const crear = useCallback(async (dto: CreateTipoContratoDto): Promise<TipoContrato> => {
        const nuevo = await createTipoContrato(dto);
        setTiposContratos(prev => [...prev, nuevo]);
        return nuevo;
    }, []);

    const actualizar = useCallback(async (id: number, dto: UpdateTipoContratoDto): Promise<TipoContrato> => {
        const actualizado = await updateTipoContrato(id, dto);
        setTiposContratos(prev => prev.map(t => t.id_tipo_contrato === id ? actualizado : t));
        return actualizado;
    }, []);

    const eliminar = useCallback(async (id: number): Promise<void> => {
        await deleteTipoContrato(id);
        setTiposContratos(prev => prev.filter(t => t.id_tipo_contrato !== id));
    }, []);

    return { tiposContratos, loading, error, refetch: fetchTipos, crear, actualizar, eliminar };
}