"use client";

import { useState, useEffect } from "react";
import { Eye, Download, Loader2, FileText, X } from "lucide-react";
import { downloadContrato } from "@/lib/services/Contrato.service";

interface Props {
    open: boolean;
    onClose: () => void;
    id_contrato: number;
    nombre_archivo: string;
    zIndex?: number;
}

export default function PreviewContratoModal({
    open,
    onClose,
    id_contrato,
    nombre_archivo,
    zIndex = 50,
}: Props) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isPdf = nombre_archivo.toLowerCase().endsWith(".pdf");

    useEffect(() => {
        if (!open) return;

        setLoading(true);
        setError(null);

        fetch(`http://localhost:3000/api/contratos/${id_contrato}/download`)
            .then((res) => {
                if (!res.ok) throw new Error("Error al obtener el archivo");
                return res.blob();
            })
            .then((blob) => setBlobUrl(URL.createObjectURL(blob)))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));

        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [open, id_contrato]);

    if (!open) return null;

    return (
        <>
            {/* tu JSX completo aquí */}
        </>
    );
}