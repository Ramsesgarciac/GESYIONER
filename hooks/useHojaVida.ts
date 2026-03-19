import { useState, useEffect, useCallback } from 'react';
import { HojaVida, ResumenHojaVida } from '@/types/HojaVida';
import { getHojaVidaByEmpleado, getResumenHojaVida, downloadHojaVidaPdf } from '../lib/services/HojaVida.service'

export function useHojaVida(id_empleado: number | null) {
    const [hojaVida, setHojaVida] = useState<HojaVida | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHojaVida = useCallback(async () => {
        if (id_empleado === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getHojaVidaByEmpleado(id_empleado);
            setHojaVida(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id_empleado]);

    useEffect(() => { fetchHojaVida(); }, [fetchHojaVida]);

    const descargarPdf = useCallback(async () => {
        if (id_empleado === null) return;
        await downloadHojaVidaPdf(id_empleado);
    }, [id_empleado]);

    return { hojaVida, loading, error, refetch: fetchHojaVida, descargarPdf };
}

export function useResumenHojaVida(id_empleado: number | null) {
    const [resumen, setResumen] = useState<ResumenHojaVida | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchResumen = useCallback(async () => {
        if (id_empleado === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getResumenHojaVida(id_empleado);
            setResumen(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id_empleado]);

    useEffect(() => { fetchResumen(); }, [fetchResumen]);

    return { resumen, loading, error, refetch: fetchResumen };
}