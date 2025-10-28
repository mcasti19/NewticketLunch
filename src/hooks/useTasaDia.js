import {useQuery} from '@tanstack/react-query';
import {getBCVrate} from '../services/actions';

/**
 * Custom Hook para obtener la Tasa del Día (BCV Rate)
 * Utiliza TanStack Query para manejo de caché, reintentos, y estados de carga/error.
 */
export const useTasaDia = () => {

    // El useQuery manejará automáticamente todos los estados (data, error, isLoading)
    const {
        data: bcvRate, // Renombramos 'data' a 'bcvRate' para mayor claridad.
        error,         // El objeto de error.
        isLoading,     // Booleano: true mientras la petición está en curso.
        isError,       // Booleano: true si ha ocurrido un error.
        isFetching     // Booleano: true cuando la petición se ejecuta en segundo plano.
    } = useQuery( {
        queryKey: [ 'tasaDia' ],
        queryFn: getBCVrate,

        // 🛠️ Opciones de Configuración Mejoradas 🛠️

        // El tiempo que los datos serán considerados 'fresh' (frescos).
        // Si es Infinity, los datos nunca se volverán 'stale' (obsoletos) automáticamente.
        staleTime: Infinity,

        // El tiempo que los datos 'stale' permanecerán en la caché.
        // Después de este tiempo (e.g., 1 hora), si la clave ('tasaDia') es requerida, 
        // se hará una nueva petición.
        gcTime: 1000 * 60 * 60, // 1 hora

        // Opcional: Desactiva el re-fetch automático al volver a enfocar la ventana.
        refetchOnWindowFocus: false,
    } );

    // La lógica de manejo de errores, carga, y el valor del dato se abstraen aquí.
    return {
        // Retorna el dato obtenido (o undefined/null si hay error o está cargando)
        bcvRate: bcvRate || 0, // Asegura que bcvRate retorne 0 si aún no hay data o hay error
        error,
        isLoading,
        isError,
        isFetching,
    };
};