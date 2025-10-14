// useGetEmployees.js
import {useState, useEffect} from 'react';
import {getEmployees} from '../services/actions';
import {formatFullName} from '../utils/employeeUtils';

// export function useGetEmployees( idGerencia ) {
export function useGetEmployees() {
  const [ employees, setEmployees ] = useState( [] );
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {
    let isMounted = true;
    setLoading( true );

    getEmployees()
      .then( data => {
        if ( isMounted ) {
          // Aplica el formateo de fullName usando la función utilitaria
          const formattedEmployees = formatFullName( data );
          setEmployees( formattedEmployees );
          console.log( "EMPLOYESS", formattedEmployees );
        }
      } )
      .catch( () => {
        if ( isMounted ) {
          setEmployees( [] );
        }
      } )
      .finally( () => {
        if ( isMounted ) {
          setLoading( false );
        }
      } );

    return () => {isMounted = false;};
    // }, [ idGerencia ] );
  }, [] );

  return {employees, loading};
}