// useGetEmployees.js
import {useState, useEffect} from 'react';
import {getEmployees} from '../services/actions';

export function useGetEmployees( idGerencia ) {
  const [ employees, setEmployees ] = useState( [] );
  const [ loading, setLoading ] = useState( true );
  // Solo API, no fallback

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getEmployees(idGerencia)
      .then(data => {
        if (isMounted) {
          setEmployees(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setEmployees([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [idGerencia]);

  // console.log("Fetched Employees:", employees);
  
  return { employees, loading };
}