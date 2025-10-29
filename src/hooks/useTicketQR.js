import {useState, useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useAuthStore} from '../store/authStore';
import {getOrderByid} from '../services/actions';

/**
 * Función CENTRALIZADA: Formatea la data del ticket (orden y empleado)
 * a un string de texto plano legible con saltos de línea (\n) para el QR.
 */
export const formatQRText = ( data ) => {
    if ( !data ) return 'Error: Sin datos';

    // 1. Extraer los datos singulares del empleado (asumiendo que data.empleados[0] existe)
    const empleado = Array.isArray( data.empleados ) ? data.empleados[ 0 ] : {};

    const cedula = empleado.cedula || 'N/A';
    // 💡 Aseguramos la construcción del fullName: prioriza el campo 'fullName' si existe, sino lo construye.
    const fullName = empleado.fullName || `${ empleado.first_name || '' } ${ empleado.last_name || '' }`.trim() || 'Empleado Desconocido';

    // 💡 CLAVE: Usamos total_pagar del empleado si está presente (lo ponemos en el payload), sino el total de la orden.
    const total = Number( empleado.total_pagar || data.total || 0 ).toFixed( 2 );

    // 2. Determinar el estado de Autorización
    // La API devuelve 'si' (en minúsculas), por eso chequeamos por 'si'.
    const autorizadoText = empleado.autorizado
        ? `SI (${ empleado.autorizado })`
        // 🚨 CORRECCIÓN: Chequeamos por 'si' minúscula
        : ( data.authorized === 'si' ? `SI (${ data.authorized_person || 'N/A' })` : 'NO' );

    // 3. Generar una cadena de texto simple con saltos de línea (\n)
    return [
        `Ticket QR - Almuerzo`,
        `--------------------------`,
        `Orden: ${ data.orderID || 'N/A' }`,
        `Referencia: ${ data.referencia || 'N/A' }`,
        `Total Bs: ${ total }`,
        `--------------------------`,
        `Empleado: ${ fullName }`,
        `C.I.: ${ cedula }`,
        `Autorizado: ${ autorizadoText }`,
    ].join( '\n' );
};


export const useTicketQR = () => {
    const {user} = useAuthStore();
    const [ enabled, setEnabled ] = useState( false );

    const today = new Date().toISOString().split( 'T' )[ 0 ];

    const {data: order, isLoading, error, refetch} = useQuery( {
        queryKey: [ 'order', user?.cedula, today ],
        queryFn: () => getOrderByid( user.cedula ),
        enabled: enabled && !!user?.cedula,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    } );

    const qrData = useMemo( () => {
        if ( !order ) return null;

        // 🚨 CORRECCIÓN: Usamos el objeto de empleado que viene en la respuesta de la API.
        const apiEmployee = order.employees || {};

        // Extracción de datos
        const total = order.total_amount;
        const referencia = order.reference;
        const orderID = order.number_order;

        // 1. Build the employee object
        const empleadoPayload = {
            // Usamos los campos específicos de la API y caemos en el user de la Auth Store
            cedula: apiEmployee.cedula || user.cedula,
            // 💡 Construimos fullName con los campos de la API.
            fullName: `${ apiEmployee.first_name || '' } ${ apiEmployee.last_name || '' }`.trim() || user.fullName,

            // Authorization data está en la raíz de 'order'
            // 🚨 CORRECCIÓN: Chequeamos por 'si'
            autorizado: order.authorized_person && order.authorized === 'si' ? order.authorized_person : null,

            // Total a pagar para la función formatQRText (usamos el total_amount de la orden)
            total_pagar: total,
            first_name: apiEmployee.first_name, // Se mantienen para la función formatQRText
            last_name: apiEmployee.last_name, // Se mantienen para la función formatQRText
        };

        return {
            orderID,
            // 2. Lo envolvemos en un array para que la función formatQRText funcione consistentemente.
            empleados: [ empleadoPayload ],
            total,
            referencia,
            // También pasar estos campos para la consistencia
            authorized: order.authorized,
            authorized_person: order.authorized_person,
        };
    }, [ order, user ] );


    const generateTicket = () => {
        if ( !enabled ) {
            setEnabled( true );
        } else {
            refetch();
        }
    };

    return {
        // employee ya no se usa directamente
        order,
        isLoading,
        error,
        refetch,
        generateTicket,
        qrData,
    }
}

// import {useState, useMemo, useEffect} from 'react';
// import {useQuery} from '@tanstack/react-query';
// import {useAuthStore} from '../store/authStore';
// import {getOrderByid} from '../services/actions';

// export const useTicketQR = () => {
//     const {user} = useAuthStore();
//     const [ enabled, setEnabled ] = useState( false );

//     const today = new Date().toISOString().split( 'T' )[ 0 ]; // Formato YYYY-MM-DD

//     const {data: order, isLoading, error, refetch} = useQuery( {
//         // Nota: se renombró 'data' a 'order' para usar la misma convención de tu código
//         queryKey: [ 'order', user?.cedula, today ],
//         queryFn: () => getOrderByid( user.cedula ),
//         enabled: enabled && !!user?.cedula, // Solo se activa si `enabled` es true y hay cédula
//         staleTime: 1000 * 60 * 60 * 12, // 12 horas: considera los datos frescos durante todo el día
//         retry: 1, // Reintentar solo 1 vez en caso de error
//     } );

//     // ----------------------------------------------------------------------------------

//     const generateTicket = () => {
//         // Si no está habilitado, lo habilita para que se dispare la primera consulta
//         if ( !enabled ) {
//             setEnabled( true );
//         } else {
//             // Si ya está habilitado, simplemente refresca los datos
//             refetch();
//         }
//     };

//     const employee = useMemo( () => {
//         if ( !user ) return null;
//         return {
//             fullName: user.fullName || `${ user.first_name || '' } ${ user.last_name || '' }`.trim(),
//             cedula: user.cedula || '',
//             email: user.email || '',
//             phone: user.phone || '',
//             management: user.management || '',
//         };
//     }, [ user ] );

//     // ----------------------------------------------------------------------------------

//     const qrData = useMemo( () => {
//         // Solo calcula si tenemos el pedido (order) y la información del empleado
//         if ( !order || !employee ) return null;

//         console.log( "HOLA: Calculando qrData" );

//         const orderID = order.number_order || 'no hay';
//         const referencia = order.reference || 'no hay';
//         // ✅ CORRECCIÓN CRÍTICA: Acceso a la propiedad 'total_amount' desde el objeto 'order'
//         const total = order.total_amount || 0;

//         const empleadoPayload = {
//             fullName: employee.fullName,
//             cedula: employee.cedula,
//             extras: order.extras || [],
//             autorizado: order.authorized_person || order.autorizado || null,
//         };

//         return {
//             orderID,
//             empleados: [ empleadoPayload ],
//             total,
//             referencia,
//         };
//     }, [ order, employee ] );

//     // ----------------------------------------------------------------------------------

//     // ✅ CORRECCIÓN: Usar useEffect para registrar los cambios en los datos.
//     // Se ejecuta cada vez que 'order' o 'qrData' se actualizan (de null a valor, o entre valores).
//     useEffect( () => {
//         // Log de 'order' cuando está disponible y no está cargando (solo para ver la data)
//         if ( order && !isLoading ) {
//             console.log( "DATAORDER:", order );
//         }

//         // Log de 'qrData' cuando está calculado (debe ser un objeto y no null)
//         if ( qrData ) {
//             console.log( "qrData FINAL:", qrData );
//         }
//     }, [ order, qrData, isLoading ] ) // Dependencias que disparan el efecto

//     // ----------------------------------------------------------------------------------

//     const formatQRText = ( qr ) => {
//         if ( !qr ) return '';
//         const emp = Array.isArray( qr.empleados ) ? qr.empleados[ 0 ] : {};
//         return `Orden: ${ qr.orderID }\nReferencia: ${ qr.referencia }\nEmpleado: ${ emp.fullName || '' } (C.I: ${ emp.cedula || '' })\nTotal: Bs. ${ Number( qr.total || 0 ).toFixed( 2 ) }`;
//     };

//     return {
//         employee,
//         order,
//         qrData,
//         isLoading,
//         error: error ? ( error.message || 'Error desconocido' ) : null,
//         generateTicket,
//         formatQRText,
//     };
// };