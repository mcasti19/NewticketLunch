import {useQuery} from '@tanstack/react-query';
import {getMenu} from '../services/actions';

/**
 * Custom Hook para obtener el menú del día.
 * Utiliza TanStack Query para manejo eficiente de la data asíncrona.
 */
export const useMenu = () => {

    const {
        data,           // Los datos del menú
        error,          // El objeto de error si la petición falla
        isLoading,      // true mientras la petición inicial está en curso
        isError,        // true si la petición inicial falló
        isFetching      // true mientras cualquier petición (inicial o de fondo) está en curso
    } = useQuery( {
        // 1. Clave de la Query: Identificador único para el caché
        queryKey: [ 'menuDia' ],

        // 2. Función de Petición: La función asíncrona que obtiene los datos
        queryFn: getMenu,

        // 3. Opciones de Caching

        // staleTime: El menú cambia diariamente, por lo que podemos darle un tiempo de 'frescura' largo
        // pero que no sea infinito, para que al menos se intente refetchear una vez al día.
        // Ejemplo: 5 minutos (para desarrollo) o 12 horas (para producción)
        staleTime: 1000 * 60 * 5, // Datos frescos por 5 minutos

        // gcTime: El tiempo que los datos permanecerán en caché (1 día).
        // Si el usuario vuelve después de 1 día, se hará una nueva petición.
        gcTime: 1000 * 60 * 60 * 24, // 24 horas

        // Opcional: Transforma los datos antes de devolverlos (asegura que siempre es un array)
        select: ( data ) => Array.isArray( data ) ? data : [],

        // Opcional: Desactiva el re-fetch al re-enfocar la ventana si no es necesario.
        refetchOnWindowFocus: false,
    } );

    return {
        // Aseguramos que menuData sea siempre un array (gracias a la opción 'select' arriba)
        menuData: data,
        error,
        isLoading,
        isError,
        isFetching,
    };
};