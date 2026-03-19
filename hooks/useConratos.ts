import { useState, useEffect, useCallback } from 'react';
import { Contrato, UploadContratoDto, UpdateContratoDto } from '@/types/Contrato';
import {
    getContratosByEmpleado,
    getContratosVigentes,
    uploadContrato,
    updateContrato,
    replaceContratoFile,
    marcarContratoNoVigente,
    downloadContrato,
} from '../lib/services/Contrato.service';

// ─── useContratosByEmpleado ───────────────────────────────────────────────────

export function useContratosByEmpleado(id_empleado: number | null) {
    const [contratos, setContratos] = useState<Contrato[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContratos = useCallback(async () => {
        if (id_empleado === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getContratosByEmpleado(id_empleado);
            setContratos(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id_empleado]);

    useEffect(() => { fetchContratos(); }, [fetchContratos]);

    const subir = useCallback(async (dto: UploadContratoDto): Promise<Contrato> => {
        const nuevo = await uploadContrato(dto);
        await fetchContratos();
        return nuevo;
    }, [fetchContratos]);

    const actualizar = useCallback(async (id: number, dto: UpdateContratoDto): Promise<Contrato> => {
        const actualizado = await updateContrato(id, dto);
        setContratos(prev => prev.map(c => c.id_contrato === id ? actualizado : c));
        return actualizado;
    }, []);

    const reemplazarArchivo = useCallback(async (id: number, file: File): Promise<Contrato> => {
        const actualizado = await replaceContratoFile(id, file);
        await fetchContratos();
        return actualizado;
    }, [fetchContratos]);

    const marcarNoVigente = useCallback(async (id: number): Promise<void> => {
        await marcarContratoNoVigente(id);
        setContratos(prev => prev.map(c => c.id_contrato === id ? { ...c, vigente: false } : c));
    }, []);

    const descargar = useCallback(async (id: number, nombre_archivo: string): Promise<void> => {
        await downloadContrato(id, nombre_archivo);
    }, []);

    // Contrato vigente actual (el primero vigente)
    const contratoVigente = contratos.find(c => c.vigente) ?? null;

    return {
        contratos,
        contratoVigente,
        loading,
        error,
        refetch: fetchContratos,
        subir,
        actualizar,
        reemplazarArchivo,
        marcarNoVigente,
        descargar,
    };
}

// ─── useContratosVigentes ─────────────────────────────────────────────────────

export function useContratosVigentes(id_empleado: number | null) {
    const [vigentes, setVigentes] = useState<Contrato[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVigentes = useCallback(async () => {
        if (id_empleado === null) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getContratosVigentes(id_empleado);
            setVigentes(data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [id_empleado]);

    useEffect(() => { fetchVigentes(); }, [fetchVigentes]);

    return { vigentes, loading, error, refetch: fetchVigentes };
}