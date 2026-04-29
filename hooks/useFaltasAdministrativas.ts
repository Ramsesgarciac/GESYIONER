import { useState, useEffect, useCallback } from 'react';
import {
    FaltaAdministrativa,
    CreateFaltaAdministrativaDto,
    UpdateFaltaAdministrativaDto,
} from '../types/falta-administrativa';
import {
    createFaltaAdministrativa,
    getFaltasByEmpleado,
    updateFaltaAdministrativa,
    deleteFaltaAdministrativa,
} from '../lib/services/FaltaAdministrativa.service';

// ─── useFaltasByEmpleado ───────────────────────────────────────────────────────

export function useFaltasByEmpleado(id_empleado: number | null) {
    const [faltas, setFaltas] = useState<FaltaAdministrativa[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFaltas = useCallback(async () => {
        if (id_empleado === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getFaltasByEmpleado(id_empleado);
            // Orden descendente: más reciente primero
            const ordenadas = (data ?? []).sort(
                (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            );
            setFaltas(ordenadas);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id_empleado]);

    useEffect(() => { fetchFaltas(); }, [fetchFaltas]);

    // ─── Crear ──────────────────────────────────────────────────────────────────

    const crear = useCallback(async (dto: CreateFaltaAdministrativaDto): Promise<FaltaAdministrativa> => {
        const nueva = await createFaltaAdministrativa(dto);
        setFaltas(prev =>
            [nueva, ...prev].sort(
                (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            )
        );
        return nueva;
    }, []);

    // ─── Actualizar ─────────────────────────────────────────────────────────────

    const actualizar = useCallback(async (
        id: number,
        dto: UpdateFaltaAdministrativaDto
    ): Promise<FaltaAdministrativa> => {
        const actualizada = await updateFaltaAdministrativa(id, dto);
        setFaltas(prev =>
            prev
                .map(f => f.id_falta_administrativa === id ? actualizada : f)
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        );
        return actualizada;
    }, []);

    // ─── Eliminar ───────────────────────────────────────────────────────────────

    const eliminar = useCallback(async (id: number): Promise<void> => {
        await deleteFaltaAdministrativa(id);
        setFaltas(prev => prev.filter(f => f.id_falta_administrativa !== id));
    }, []);

    return {
        faltas,
        loading,
        error,
        refetch: fetchFaltas,
        crear,
        actualizar,
        eliminar,
    };
}