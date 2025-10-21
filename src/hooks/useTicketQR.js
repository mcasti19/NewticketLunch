import {useState, useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useAuthStore} from '../store/authStore';
import {getOrderByid} from '../services/actions';

export const useTicketQR = () => {
    const {user} = useAuthStore();
    const [ enabled, setEnabled ] = useState( false );

    const today = new Date().toISOString().split( 'T' )[ 0 ]; // Formato YYYY-MM-DD

    const {data: order, isLoading, error, refetch} = useQuery( {
        queryKey: [ 'order', user?.cedula, today ],
        queryFn: () => getOrderByid( user.cedula ),
        enabled: enabled && !!user?.cedula, // Solo se activa si `enabled` es true y hay cédula
        staleTime: 1000 * 60 * 60 * 12, // 12 horas: considera los datos frescos durante todo el día
        retry: 1, // Reintentar solo 1 vez en caso de error
    } );

    console.log( "DATAORDER:", order );


    const generateTicket = () => {
        if ( !enabled ) {
            setEnabled( true );
        } else {
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

    const qrData = useMemo( () => {
        if ( !order || !employee ) return null;

        const orderID = order.id || order.order?.id || order.orderID || order.id_order || '';
        const referencia = order.reference || order.referencia || order.order?.reference || '';
        const total = order.total_amount || order.total || order.order?.total_amount || 0;

        const empleadoPayload = {
            fullName: employee.fullName,
            cedula: employee.cedula,
            extras: order.extras || order.order?.extras || [],
            autorizado: order.authorized_person || order.autorizado || null,
        };

        return {
            orderID,
            empleados: [ empleadoPayload ],
            total,
            referencia,
        };
    }, [ order, employee ] );

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
        error: error ? error.message : null,
        generateTicket,
        formatQRText,
    };
};
