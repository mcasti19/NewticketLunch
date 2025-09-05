// useGetEmployees.js
import {useState, useEffect} from 'react';
import {getEmployees} from '../services/actions';
import empleadosData from '../data/mockDataEmpleados.json';

export function useGetEmployees( idGerencia ) {
  const [ employees, setEmployees ] = useState( [] );
  const [ loading, setLoading ] = useState( true );
  const [ isFallback, setIsFallback ] = useState( false ); // Nuevo estado para indicar si se está usando la data local

  useEffect( () => {
    // console.log( "IDGERENCIA:", idGerencia );

    let isMounted = true;
    setLoading( true );
    setIsFallback( false );

    getEmployees( idGerencia )
      .then( data => {
        if ( isMounted ) {
          setEmployees( data );
          // console.log( "DAAAAAAAAAAAAAAAATA:", data );

          if ( !data.length > 0 ) {
            const empleadosFiltrados = empleadosData.filter( e => e.id_gerencia === idGerencia );
            setEmployees( empleadosFiltrados );
            setIsFallback( true );
          }

          // console.log(employees);
          
        }
        // return employees
      } )
      .catch( () => {
        if ( isMounted ) {
          // En caso de error, usa los datos locales y activa la bandera de respaldo
          const empleadosFiltrados = empleadosData.filter( e => e.id_gerencia === idGerencia );
          setEmployees( empleadosFiltrados );
          // console.log( "EMPLOYEEEESSSS:", idGerencia );

          setIsFallback( true );
        }
      } )
      .finally( () => {
        if ( isMounted ) {
          setLoading( false );
        }
      } );

    return () => {isMounted = false;};
  }, [ idGerencia ] );

  return {employees, loading, isFallback};
}