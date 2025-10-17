import React, {useEffect, useState} from 'react'
import {useGetDataOrder} from './useGetDataOrder';
import {useTicketLunchStore} from '../store/ticketLunchStore';
import {useAuthStore} from '../store/authStore';

export const useGenerateMyQR = () => {
    const {user} = useAuthStore();
    const [ employee, setEmployee ] = useState( '' )
    // Build a minimal employee object from the normalized user stored in authStore


    const {order, isLoading, error} = useGetDataOrder();
    const showTicketImage = useTicketLunchStore( state => state.showTicketImage );
    const setShowTicketImage = useTicketLunchStore( state => state.setShowTicketImage );


    useEffect( () => {
        console.log( "USER:", user );

    }, [ user ] )



    // Mapear los datos de la orden para el QR del empleado logueado
    const qrDataForLogged = React.useMemo( () => {

        const employee = user ? {
            fullName: user.fullName || `${ user.first_name || '' } ${ user.last_name || '' }`.trim(),
            cedula: user.cedula || '',
            email: user.email || '',
            phone: user.phone || '',
            management: user.management || '',
        } : null;

        setEmployee( employee );

        if ( !order || !employee ) return null;

        const orderID = order.id || order.order?.id || order.orderID || order.id_order || '';
        const referencia = order.reference || order.referencia || order.order?.reference || '';
        const total = order.total_amount || order.total || order.order?.total_amount || 0;

        const fullName = employee.fullName || `${ employee.nombre || '' } ${ employee.apellido || '' }`.trim() || employee.name || '';
        const cedula = employee.cedula || employee.ced || employee.cedula_employee || '';

        const empleadoPayload = {
            fullName,
            cedula,
            extras: order.extras || order.order?.extras || [],
            autorizado: order.authorized_person || order.autorizado || null,
        };

        return {
            orderID,
            empleados: [ empleadoPayload ],
            total,
            referencia,
        };
    }, [ order, user ] );

    const formatQRText = ( qr ) => {
        if ( !qr ) return '';
        const emp = Array.isArray( qr.empleados ) ? qr.empleados[ 0 ] : {};
        return `Orden: ${ qr.orderID }\nReferencia: ${ qr.referencia }\nEmpleado: ${ emp.fullName || '' } (C.I: ${ emp.cedula || '' })\nTotal: Bs. ${ Number( qr.total || 0 ).toFixed( 2 ) }`;
    };

    return {
        order,
        isLoading,
        error,
        showTicketImage,
        qrDataForLogged,
        user,
        employee,

        setShowTicketImage,
        formatQRText
    }
}
