import {useState, useMemo, useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useAuthStore} from '../store/authStore';
import {getOrderByid} from '../services/actions';

export const useTicketQR = () => {
    const {user} = useAuthStore();
    const [ enabled, setEnabled ] = useState( false );

    const today = new Date().toISOString().split( 'T' )[ 0 ]; // Formato YYYY-MM-DD

    const {data: order, isLoading, error, refetch} = useQuery( {
        // Nota: se renombró 'data' a 'order' para usar la misma convención de tu código
        queryKey: [ 'order', user?.cedula, today ],
        queryFn: () => getOrderByid( user.cedula ),
        enabled: enabled && !!user?.cedula, // Solo se activa si `enabled` es true y hay cédula
        staleTime: 1000 * 60 * 60 * 12, // 12 horas: considera los datos frescos durante todo el día
        retry: 1, // Reintentar solo 1 vez en caso de error
    } );

    // ----------------------------------------------------------------------------------

    const generateTicket = () => {
        // Si no está habilitado, lo habilita para que se dispare la primera consulta
        if ( !enabled ) {
            setEnabled( true );
        } else {
            // Si ya está habilitado, simplemente refresca los datos
            refetch();
        }
    };

    const employee = useMemo( () => {
        if ( !user ) return null;
        return {
            fullName: user.fullName || `${ user.first_name || '' } ${ user.last_name || '' }`.trim(),
            cedula: user.cedula || '',
            email: user.email || '',
            phone: user.phone || '',
            management: user.management || '',
        };
    }, [ user ] );

    // ----------------------------------------------------------------------------------

    const qrData = useMemo( () => {
        // Solo calcula si tenemos el pedido (order) y la información del empleado
        if ( !order || !employee ) return null;

        console.log( "HOLA: Calculando qrData" );

        const orderID = order.number_order || 'no hay';
        const referencia = order.reference || 'no hay';
        // ✅ CORRECCIÓN CRÍTICA: Acceso a la propiedad 'total_amount' desde el objeto 'order'
        const total = order.total_amount || 0;

        const empleadoPayload = {
            fullName: employee.fullName,
            cedula: employee.cedula,
            extras: order.extras || [],
            autorizado: order.authorized_person || order.autorizado || null,
        };

        return {
            orderID,
            empleados: [ empleadoPayload ],
            total,
            referencia,
        };
    }, [ order, employee ] );

    // ----------------------------------------------------------------------------------

    // ✅ CORRECCIÓN: Usar useEffect para registrar los cambios en los datos.
    // Se ejecuta cada vez que 'order' o 'qrData' se actualizan (de null a valor, o entre valores).
    useEffect( () => {
        // Log de 'order' cuando está disponible y no está cargando (solo para ver la data)
        if ( order && !isLoading ) {
            console.log( "DATAORDER:", order );
        }

        // Log de 'qrData' cuando está calculado (debe ser un objeto y no null)
        if ( qrData ) {
            console.log( "qrData FINAL:", qrData );
        }
    }, [ order, qrData, isLoading ] ) // Dependencias que disparan el efecto

    // ----------------------------------------------------------------------------------

    const formatQRText = ( qr ) => {
        if ( !qr ) return '';
        const emp = Array.isArray( qr.empleados ) ? qr.empleados[ 0 ] : {};
        return `Orden: ${ qr.orderID }\nReferencia: ${ qr.referencia }\nEmpleado: ${ emp.fullName || '' } (C.I: ${ emp.cedula || '' })\nTotal: Bs. ${ Number( qr.total || 0 ).toFixed( 2 ) }`;
    };

    return {
        employee,
        order,
        qrData,
        isLoading,
        error: error ? ( error.message || 'Error desconocido' ) : null,
        generateTicket,
        formatQRText,
    };
};