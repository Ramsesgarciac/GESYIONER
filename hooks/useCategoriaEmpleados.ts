import { useState, useEffect, useCallback } from 'react';
import {
    CategoriaEmpleado,
    CreateCategoriaEmpleadoDto,
} from '../types/CategoriaEmpleados';
import { getCategorias, createCategoria } from '../lib/services/CategoriaEmpleado.service';

// ─── useCategorias ─────────────────────────────────────────────────────────────

export function useCategorias() {
    const [categorias, setCategorias] = useState<CategoriaEmpleado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategorias = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCategorias();
            setCategorias(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    // ─── Crear ──────────────────────────────────────────────────────────────────

    const crear = useCallback(
        async (dto: CreateCategoriaEmpleadoDto): Promise<CategoriaEmpleado> => {
            const nueva = await createCategoria(dto);
            setCategorias((prev) => [...prev, nueva]);
            return nueva;
        },
        [],
    );

    return {
        categorias,
        loading,
        error,
        refetch: fetchCategorias,
        crear,
    };
}