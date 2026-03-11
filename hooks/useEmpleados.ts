import { useState, useEffect, useCallback } from 'react';
import {
    Empleado,
    CreateEmpleadoDto,
    UpdateEmpleadoDto,
    EmpleadoEstado,
} from '../types/Empleado';
import {
    getEmpleados,
    getEmpleadosActivos,
    getEmpleadosInactivos,
    getEmpleadoById,
    getEmpleadosByCategoria,
    createEmpleado,
    updateEmpleado,
    deactivateEmpleado,
} from '../lib/services/Empleado.service';

// ─── useEmpleados (lista con filtro activos/inactivos/todos) ───────────────────

export function useEmpleados(filtro: EmpleadoEstado = 'activos') {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmpleados = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let data: Empleado[];
            if (filtro === 'activos') data = await getEmpleadosActivos();
            else if (filtro === 'inactivos') data = await getEmpleadosInactivos();
            else data = await getEmpleados();
            setEmpleados(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [filtro]);

    useEffect(() => {
        fetchEmpleados();
    }, [fetchEmpleados]);

    // ─── Crear ──────────────────────────────────────────────────────────────────

    const crear = useCallback(async (dto: CreateEmpleadoDto): Promise<Empleado> => {
        const nuevo = await createEmpleado(dto);
        await fetchEmpleados();
        return nuevo;
    }, [fetchEmpleados]);

    // ─── Actualizar ─────────────────────────────────────────────────────────────

    const actualizar = useCallback(async (id: number, dto: UpdateEmpleadoDto): Promise<Empleado> => {
        const actualizado = await updateEmpleado(id, dto);
        setEmpleados(prev =>
            prev.map(e => (e.id_empleado === id ? actualizado : e))
        );
        return actualizado;
    }, []);

    // ─── Desactivar ─────────────────────────────────────────────────────────────

    const desactivar = useCallback(async (id: number): Promise<void> => {
        await deactivateEmpleado(id);
        // Si estamos en vista activos, lo quitamos de la lista
        if (filtro === 'activos') {
            setEmpleados(prev => prev.filter(e => e.id_empleado !== id));
        } else {
            await fetchEmpleados();
        }
    }, [filtro, fetchEmpleados]);

    return {
        empleados,
        loading,
        error,
        refetch: fetchEmpleados,
        crear,
        actualizar,
        desactivar,
    };
}

// ─── useEmpleado (uno por ID) ──────────────────────────────────────────────────

export function useEmpleado(id: number | null) {
    const [empleado, setEmpleado] = useState<Empleado | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEmpleado = useCallback(async () => {
        if (id === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getEmpleadoById(id);
            setEmpleado(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEmpleado();
    }, [fetchEmpleado]);

    return { empleado, loading, error, refetch: fetchEmpleado };
}

// ─── useEmpleadosByCategoria ───────────────────────────────────────────────────

export function useEmpleadosByCategoria(idCategoria: number | null) {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchByCategoria = useCallback(async () => {
        if (idCategoria === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getEmpleadosByCategoria(idCategoria);
            setEmpleados(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [idCategoria]);

    useEffect(() => {
        fetchByCategoria();
    }, [fetchByCategoria]);

    return { empleados, loading, error, refetch: fetchByCategoria };
}