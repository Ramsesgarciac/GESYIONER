import { useState, useEffect, useCallback } from 'react';
import { Evento, CreateEventoDto, UpdateEventoDto } from '@/types/Evento';
import {
    getEventosByEmpleado,
    getEventoById,
    createEvento,
    updateEvento,
    deleteEvento,
} from '../lib/services/Evento.service';

// Ordena descendente: primero por fecha, luego por id como desempate
function ordenarDescendente(lista: Evento[]): Evento[] {
    return [...lista].sort((a, b) => {
        const fechaA = new Date(a.fecha_evento).getTime();
        const fechaB = new Date(b.fecha_evento).getTime();
        if (fechaB !== fechaA) return fechaB - fechaA;
        return b.id_evento - a.id_evento; // más reciente creado = id mayor
    });
}

export function useEventosByEmpleado(id_empleado: number | null) {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEventos = useCallback(async () => {
        if (id_empleado === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getEventosByEmpleado(id_empleado);
            setEventos(ordenarDescendente(data ?? []));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id_empleado]);

    useEffect(() => { fetchEventos(); }, [fetchEventos]);

    const crear = useCallback(async (dto: CreateEventoDto): Promise<Evento> => {
        const nuevo = await createEvento(dto);
        setEventos(prev => ordenarDescendente([nuevo, ...prev]));
        return nuevo;
    }, []);

    const actualizar = useCallback(async (id: number, dto: UpdateEventoDto): Promise<Evento> => {
        const actualizado = await updateEvento(id, dto);
        setEventos(prev => ordenarDescendente(prev.map(e => e.id_evento === id ? actualizado : e)));
        return actualizado;
    }, []);

    const eliminar = useCallback(async (id: number): Promise<void> => {
        await deleteEvento(id);
        setEventos(prev => prev.filter(e => e.id_evento !== id));
    }, []);

    return { eventos, loading, error, refetch: fetchEventos, crear, actualizar, eliminar };
}

export function useEvento(id: number | null) {
    const [evento, setEvento] = useState<Evento | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEvento = useCallback(async () => {
        if (id === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getEventoById(id);
            setEvento(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchEvento(); }, [fetchEvento]);

    return { evento, loading, error, refetch: fetchEvento };
}