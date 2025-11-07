// useGetEmployees.js
import {useQuery} from '@tanstack/react-query'; // 💡 Importar el hook principal
import {getEmployees} from '../services/actions';
import {formatFullName} from '../utils/employeeUtils';

/**
 * Clave única para identificar la consulta en el caché de TanStack Query.
 */
const EMPLOYEES_QUERY_KEY = 'employees';

/**
 * Hook para obtener la lista de empleados.
 *
 * TanStack Query se encarga de:
 * 1. Manejar los estados de loading (isLoading), error (isError).
 * 2. Caching (cachear los datos obtenidos).
 * 3. Background refetching (refetch automático en ciertas condiciones).
 * 4. La lógica de cancelación (el 'isMounted' ya no es necesario).
 *
 * @returns {object} Un objeto con los datos formateados y estados de consulta.
 */
export function useGetEmployees() {

  const {
    data: employees, // Renombramos 'data' a 'employees' para consistencia
    isLoading,
    isError,
    error
  } = useQuery( {
    // 1. QUERY KEY: Identificador para el caché
    queryKey: [ EMPLOYEES_QUERY_KEY ],

    // 2. QUERY FUNCTION: Función que realiza la llamada a la API
    queryFn: async () => {
      const data = await getEmployees();
      // 💡 Aplicamos el formateo directamente después de obtener los datos
      const formattedEmployees = formatFullName( data );
      // console.log( "EMPLOYEES (TanStack Query):", formattedEmployees );
      return formattedEmployees;
    },

    // 3. OPCIONES ADICIONALES (Opcional pero útil)
    staleTime: 5 * 60 * 1000, // Los datos se consideran 'frescos' por 5 minutos
    // refetchOnWindowFocus: false, // Puedes desactivar el refetch si no es necesario
  } );

  // Devolvemos la lista de empleados (que es 'undefined' si isLoading es true)
  // y el estado de carga y error.
  return {
    employees: employees || [], // Aseguramos que siempre devuelva un array
    isLoading,
    isError,
    error,
  };
}







// // useGetEmployees.js
// import {useState, useEffect} from 'react';
// import {getEmployees} from '../services/actions';
// import {formatFullName} from '../utils/employeeUtils';

// // export function useGetEmployees( idGerencia ) {
// export function useGetEmployees() {
//   const [ employees, setEmployees ] = useState( [] );
//   const [ loading, setLoading ] = useState( true );

//   useEffect( () => {
//     let isMounted = true;
//     setLoading( true );

//     getEmployees()
//       .then( data => {
//         if ( isMounted ) {
//           // Aplica el formateo de fullName usando la función utilitaria
//           const formattedEmployees = formatFullName( data );
//           setEmployees( formattedEmployees );
//           console.log( "EMPLOYESS", formattedEmployees );
//         }
//       } )
//       .catch( () => {
//         if ( isMounted ) {
//           setEmployees( [] );
//         }
//       } )
//       .finally( () => {
//         if ( isMounted ) {
//           setLoading( false );
//         }
//       } );

//     return () => {isMounted = false;};
//     // }, [ idGerencia ] );
//   }, [] );

//   return {employees, loading};
// }