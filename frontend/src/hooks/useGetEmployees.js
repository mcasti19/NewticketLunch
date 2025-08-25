import { useState, useEffect } from 'react';
import { getemployees } from '../services/actions';

export function useGetEmployees(id_gerencia) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getemployees(id_gerencia)
      .then(data => {
        if (isMounted) {
          setEmployees(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [id_gerencia]);

  return { employees, loading, error };
}
