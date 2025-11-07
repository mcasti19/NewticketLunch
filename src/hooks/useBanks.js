import {useQuery} from '@tanstack/react-query';
import {getBankList, getBCVrate} from '../services/actions';

/**
 * Custom Hook para obtener la Tasa del Día (BCV Rate)
 * Utiliza TanStack Query para manejo de caché, reintentos, y estados de carga/error.
 */
export const useBank = () => {

    const {
        data: bankList, 
        error,         
        isLoading,     
        isError,       
        isFetching     
    } = useQuery( {
        queryKey: [ 'bancos' ],
        queryFn: getBankList,

        staleTime: Infinity,
        gcTime: 1000 * 60 * 60, // 1 hora

        refetchOnWindowFocus: false,
    } );

    return {
        bankList: bankList || [], //
        error,
        isLoading,
        isError,
        isFetching,
    };
};