"use client";

import { useState, useEffect } from "react";
import { X, Clock, Loader2, ScrollText, Eye, Download, CheckCircle2, CalendarDays } from "lucide-react";
import { Contrato } from "@/types/Contrato";
import { downloadContrato } from "@/lib/services/Contrato.service";
import PreviewContratoModal from "./PreviewContratoModal";

function formatFecha(fecha: string): string {
    if (!fecha) return "—";
    const [year, month, day] = fecha.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
}

interface Props {
    open: boolean;
    onClose: () => void;
    id_empleado: number;
}

export default function HistorialContratosModal({
    open,
    onClose,
    id_empleado,
}: Props) {
    const [contratos, setContratos] = useState<Contrato[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewId, setPreviewId] = useState<{
        id: number;
        nombre: string;
    } | null>(null);

    useEffect(() => {
        if (!open) return;

        setLoading(true);
        setError(null);

        fetch(`http://localhost:3000/api/contratos/empleado/${id_empleado}`)
            .then((res) => {
                if (!res.ok) throw new Error("Error al obtener historial");
                return res.json();
            })
            .then((data) => setContratos(data ?? []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [open, id_empleado]);

    if (!open) return null;

    return (
        <>
            {/* tu JSX completo aquí */}
        </>
    );
}