import { HojaVida } from '@/types/Empleado';
import { ResumenHojaVida } from '@/types/HojaVida';

const BASE_URL = 'http://localhost:3000/api/hoja-vida';

export async function getHojaVidaByEmpleado(id_empleado: number): Promise<HojaVida> {
    const res = await fetch(`${BASE_URL}/empleado/${id_empleado}`);
    if (!res.ok) throw new Error(`Error al obtener hoja de vida del empleado ${id_empleado}`);
    return res.json();
}

export async function getResumenHojaVida(id_empleado: number): Promise<ResumenHojaVida> {
    const res = await fetch(`${BASE_URL}/resumen/${id_empleado}`);
    if (!res.ok) throw new Error(`Error al obtener resumen de hoja de vida del empleado ${id_empleado}`);
    return res.json();
}

export async function downloadHojaVidaPdf(id_empleado: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/pdf/${id_empleado}`);
    if (!res.ok) throw new Error(`Error al descargar PDF del empleado ${id_empleado}`);

    const disposition = res.headers.get('Content-Disposition') ?? '';
    const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    const filename = match ? match[1].replace(/['"]/g, '') : `hoja_vida_${id_empleado}.pdf`;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}