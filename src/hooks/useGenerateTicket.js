import React from 'react'
import {createOrderBatch, saveOrder} from '../services/actions';




export const useGenerateTicket = () => {
    const [ isLoading, setIsLoading ] = useState( false );

    // Función PRINCIPAL para enviar los datos a la API
    const handleGenerarTickets = async ( e ) => {
        e.preventDefault();

        // 💡 VALIDACIÓN DE DATOS REQUERIDOS
        if ( !paymentMethodId ) {
            Swal.fire( 'Error', 'Método de pago no reconocido.', 'error' );
            return;
        }

        if ( isDigitalPayment && !referenceNumber ) {
            Swal.fire( 'Error', 'Debe ingresar el número de referencia.', 'error' );
            return;
        }

        // Solo requerimos voucher y datos del pagador si es un pago digital y la orden no es individual
        // NOTA: Ajusta esta lógica de validación según las reglas de tu negocio
        const requiresPayerAndVoucher = isDigitalPayment && orderOrigin === "seleccion";

        if ( requiresPayerAndVoucher && ( !voucher || !payer.cedula || !payer.nombre ) ) {
            Swal.fire( 'Error', 'Faltan datos del pagador o el comprobante de pago.', 'error' );
            return;
        }

        setIsLoading( true );
        try {
            let response;

            const payloadBase = {
                paymentMethod: paymentMethodId, // 💡 ENVIAMOS EL ID DE PAGO
                referenceNumber,
                payer,
                voucher: voucher, // El componente padre debe manejar si se envía o no el archivo
            };

            if ( orderOrigin === 'seleccion' && Array.isArray( employees ) && employees.length > 1 ) {
                // FLUJO POR LOTE
                response = await createOrderBatch( {
                    employees,
                    ...payloadBase,
                } );
                setOrderId( response );

                // ... (Lógica de construcción de QR Batch se mantiene igual) ...
                const orderID = response || '';
                const batchQR = employees.map( emp => ( {
                    orderID,
                    empleados: [ {
                        cedula: emp.cedula,
                        fullName: emp.fullName,
                        extras: emp.extras,
                        total_pagar: emp.total_pagar,
                        autorizado: emp.id_autorizado || null,
                    } ],
                    total: emp.total_pagar,
                    referencia: referenceNumber,
                } ) );
                setQrBatchData( batchQR );
                setQrData( null );

            } else {

                // FLUJO INDIVIDUAL
                const emp = employees[ 0 ];
                response = await saveOrder( {
                    employee: emp,
                    extras: emp.extras || [],
                    ...payloadBase,
                } );

                setOrderId( response );

                // ... (Lógica de construcción de QR Individual se mantiene igual) ...
                const orderID = response || '';
                const qrDataFinal = {
                    orderID,
                    empleados: [ {
                        cedula: emp.cedula,
                        fullName: emp.fullName,
                        extras: emp.extras,
                        total_pagar: emp.total_pagar,
                        autorizado: emp.id_autorizado || null,
                    } ],
                    total: emp.total_pagar,
                    referencia: referenceNumber,
                };
                setQrData( qrDataFinal );
                setQrBatchData( null );
            }

            // Limpieza de estados y éxito
            setReferenceNumberStore( referenceNumber );
            setLocalReferenceNumber( '' );
            setPayer( {nombre: '', apellido: '', cedula: '', gerencia: '', telefono: ''} );
            setVoucher( null );
            setIsLoading( false );
            if ( onGenerarTickets ) onGenerarTickets( referenceNumber );

        } catch ( error ) {
            setIsLoading( false );
            const message = error?.message || error || 'Error al generar los tickets';
            Swal.fire( {
                title: 'Error',
                text: String( message ),
                icon: 'error',
                confirmButtonText: 'Volver'
            } ).then( () => {
                if ( onRequestClose ) onRequestClose();
            } );
        }
    };








    return {
        handleGenerarTickets
    }
}
