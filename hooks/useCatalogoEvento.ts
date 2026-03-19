import { useState, useEffect, useCallback } from 'react';
import { CatalogoEvento, CreateCatalogoEventoDto } from '@/types/CatalogoEventos';
import { getCatalogoEventos, createCatalogoEvento } from '../lib/services/CatalogoEventos.service';

export function useCatalogoEventos() {
    const [catalogoEventos, setCatalogoEventos] = useState<CatalogoEvento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCatalogo = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCatalogoEventos();
            setCatalogoEventos(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCatalogo(); }, [fetchCatalogo]);

    const crear = useCallback(async (dto: CreateCatalogoEventoDto): Promise<CatalogoEvento> => {
        const nuevo = await createCatalogoEvento(dto);
        setCatalogoEventos(prev => [...prev, nuevo]);
        return nuevo;
    }, []);

    return { catalogoEventos, loading, error, refetch: fetchCatalogo, crear };
}