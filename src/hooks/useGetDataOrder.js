import {useState, useEffect} from 'react';
import {getOrderByid} from '../services/actions';
import { useAuthStore } from '../store/authStore';

export const useGetDataOrder = () => {
    const [ order, setOrder ] = useState( null );
    const [ isLoading, setIsLoading ] = useState( true );
    const [ error, setError ] = useState( null );

    useEffect( () => {
        if ( order ) {
            console.log( "ORDERRRRRRRRR", order.employees );
        }
    }, [] )


    useEffect( () => {
        const fetchOrderData = async () => {
            try {
                setIsLoading( true );
                setError( null );

                // Obtener la cédula rápida desde el store
                const cedula = useAuthStore.getState().getCedula();
                if (!cedula) {
                    throw new Error('No se encontró cédula del usuario autenticado');
                }
                const dataOrder = await getOrderByid(cedula);
                setOrder( dataOrder );

            } catch ( err ) {
                console.error( "Fallo al cargar el pedido:", err );
                setError( err.message || "Error al cargar los datos." );
            } finally {
                setIsLoading( false );
            }
        };

        fetchOrderData();
    }, [] );

    return {order, isLoading, error};
};