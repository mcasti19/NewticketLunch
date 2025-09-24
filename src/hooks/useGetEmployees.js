// useGetEmployees.js
import {useState, useEffect} from 'react';
import {getEmployees} from '../services/actions';

export function useGetEmployees( idGerencia ) {
  const [ employees, setEmployees ] = useState( [] );
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {
    let isMounted = true;
    setLoading( true );

    getEmployees( idGerencia )
      .then( data => {
        if ( isMounted ) {
          const formattedEmployees = data.map( emp => {
            // Validamos que first_name y last_name existan y sean strings antes de usarlos.
            const rawFirstName = emp.first_name || '';
            const rawLastName = emp.last_name || '';

            // Dividimos y obtenemos el primer nombre y apellido.
            const firstName = rawFirstName.trim().split( ' ' )[ 0 ];
            const lastName = rawLastName.trim().split( ' ' )[ 0 ];

            // Unificamos el nombre completo.
            const fullName = `${ firstName } ${ lastName }`.trim();

            return {
              ...emp,
              fullName,
            };
          } );
          
          setEmployees( formattedEmployees );
          console.log( "EMPLOYESS", employees );
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
  }, [ idGerencia ] );

  return {employees, loading};
}