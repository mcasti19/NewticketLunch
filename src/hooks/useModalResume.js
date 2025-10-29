import React, {useEffect, useState} from 'react'
import {useTicketLunchStore} from '../store/ticketLunchStore';
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';
import {createOrderBatch, saveOrder} from '../services/actions';

// Se elimina 'isOpen' ya que no es usado por el hook.
export const useModalResume = ( {onRequestClose, paymentOption, paymentMethodMap, onGenerarTickets, orderOrigin} ) => {
    const [ referenceNumber, setReferenceNumber ] = useState( '' );
    const [ payer, setPayer ] = useState( {nombre: '', apellido: '', cedula: '', gerencia: '', telefono: ''} );
    const [ voucher, setVoucher ] = useState( null );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ paymentInfo, setPaymentInfo ] = useState( null );

    // Estados del Store que se usan internamente en el hook
    const employees = useTicketLunchStore( state => state.selectedEmpleadosSummary );
    const summary = useTicketLunchStore( state => state.summary );
    const setOrderData = useTicketLunchStore( state => state.setOrderData );
    const setQrData = useTicketLunchStore( state => state.setQrData );
    const setQrBatchData = useTicketLunchStore( state => state.setQrBatchData );
    const setReferenceNumberStore = useTicketLunchStore( state => state.setReferenceNumber );

    // ID del método de pago para la API
    const paymentMethodId = paymentMethodMap?.[ paymentOption ] || null;
    // Bandera para saber si se requieren referencia/voucher (se asume que Pago Móvil y Transf. son digitales)
    const isDigitalPayment = paymentMethodId && !paymentOption.toLowerCase().includes( 'efectivo' );

    // ✅ La lógica de isBatchOrder está correcta y accesible para el JSX
    const isBatchOrder = orderOrigin === 'seleccion' && Array.isArray( employees ) && employees.length > 1;


    // --- LÓGICA: Carga la información de contacto bancaria/móvil ---
    useEffect( () => {
        // Esto debería venir de la API, aquí lo simulamos:
        if ( paymentOption ) {
            const dummyInfo = {
                'Pago Móvil': {
                    telefono: '0414-2418171',
                    banco: '0108 - Provicial',
                    cedula: 'V-19.254.775',
                },
                'Transferencia Bancaria': {
                    cuenta: '0000 0000 0000 0000',
                    banco: '0108 - Provicial',
                    // La cuenta/cédula del receptor de la transferencia
                    cedula: 'V-19.254.775',
                },
            };
            setPaymentInfo( dummyInfo[ paymentOption ] || null );
        } else {
            setPaymentInfo( null );
        }
    }, [ paymentOption ] ); // Depende de paymentOption (debe ser pasado en el hook)

    // --- HANDLERS ---
    const handleCopy = async ( text ) => {
        try {
            await navigator.clipboard.writeText( text );
            toast.success( "¡Número copiado al portapapeles!" );
        } catch ( err ) {
            console.error( 'Error al copiar: ', err );
            toast.error( "Error al copiar el número." );
        }
    };

    const handleVoucherChange = ( e ) => {
        const file = e.target.files[ 0 ];
        if ( file ) {
            const maxSize = 1024 * 1024; // 1MB
            if ( file.size > maxSize ) {
                Swal.fire( {
                    icon: 'error',
                    title: 'Archivo demasiado grande',
                    text: 'La imagen no debe superar 1MB.',
                } );
                setVoucher( null );
                e.target.value = '';
            } else {
                setVoucher( file );
            }
        }
    };

    /**
     * @description Filtra el valor del input para aceptar solo números.
     */
    const setLocalReferenceNumber = ( value ) => {
        // Expresión regular para ELIMINAR todo lo que no sea un dígito (0-9)
        const numericValue = value.replace( /\D/g, '' );
        setReferenceNumber( numericValue );
    };


    // Función PRINCIPAL para enviar los datos a la API
    const handleGenerarTickets = async ( e ) => {
        e.preventDefault();

        // Lógica de validación para pedidos por lote (requieren datos del pagador)
        const requiresPayerData = isDigitalPayment && isBatchOrder;


        // --- 1. VALIDACIÓN DE DATOS REQUERIDOS ---
        if ( !paymentMethodId ) {
            Swal.fire( 'Error', 'Método de pago no reconocido.', 'error' );
            return;
        }

        if ( isDigitalPayment && !referenceNumber ) {
            Swal.fire( 'Error', 'Debe ingresar el número de referencia.', 'error' );
            return;
        }

        if ( isDigitalPayment && !voucher ) {
            Swal.fire( 'Error', 'Debe adjuntar el comprobante de pago.', 'error' );
            return;
        }

        if ( requiresPayerData && ( !payer.cedula || !payer.nombre ) ) {
            Swal.fire( 'Error', 'Faltan datos del pagador (Cédula y Nombre son obligatorios).', 'error' );
            return;
        }


        // --- 2. PREPARACIÓN DEL PAYLOAD Y ENVÍO A LA API ---
        setIsLoading( true );

        try {
            let OrderResponse;

            // El voucher se envía si es un pago digital (individual o lote)
            const payloadBase = {
                paymentMethod: paymentMethodId,
                referenceNumber,
                payer: isBatchOrder ? payer : null,
                voucher: isDigitalPayment ? voucher : null,
            };

            if ( isBatchOrder ) {
                // FLUJO POR LOTE
                OrderResponse = await createOrderBatch( {
                    employees,
                    ...payloadBase,
                } );

                const orderID = OrderResponse.number_order || '';
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
                    id_order_status: '1',
                    id_orders_consumption: '1',
                } ) );

                setQrBatchData( batchQR );
                setQrData( null );

            } else {
                // FLUJO INDIVIDUAL (incluye 'mi-ticket' y 'seleccion' de un solo ítem)
                const emp = employees[ 0 ];
                OrderResponse = await saveOrder( {
                    employee: emp,
                    extras: emp.extras || [],
                    ...payloadBase,
                } );

                const orderID = OrderResponse.number_order || '';
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
                    id_order_status: '1',
                    id_orders_consumption: '1',
                };
                setQrData( qrDataFinal );
                setQrBatchData( null );
            }

            // Guardar en Store y limpiar estados
            setOrderData( OrderResponse );
            setReferenceNumberStore( referenceNumber );
            setReferenceNumber( '' ); // Limpiar la referencia después del éxito
            setPayer( {nombre: '', apellido: '', cedula: '', gerencia: '', telefono: ''} );
            setVoucher( null );
            setIsLoading( false );

            // Finalizar y navegar
            if ( onGenerarTickets ) onGenerarTickets( referenceNumber );

        } catch ( error ) {
            setIsLoading( false );

            let errorMessage = error?.message || error || 'Error al generar los tickets';

            // 1. Detección de Violación de Unicidad de MySQL/Laravel (orders_reference_unique)
            if ( typeof errorMessage === 'string' && errorMessage.includes( 'orders_reference_unique' ) ) {
                // Mensaje amigable para el usuario
                errorMessage = 'La referencia de pago ingresada ya fue utilizada. Por favor, verifique el número e intente de nuevo.';
            }

            // 2. Detección de Mensaje de Validación del Backend (ej: Error 422 de Laravel)
            else if ( error?.response?.data?.message ) {
                errorMessage = error.response.data.message;
            }

            Swal.fire( {
                title: '¡Atención!',
                text: String( errorMessage ),
                icon: 'warning',
                confirmButtonText: 'Entendido'
            } ).then( () => {
                if ( onRequestClose ) onRequestClose(); // Usa la prop pasada
            } );
        }
    };


    return {
        // --- HANDLERS ---
        handleCopy,
        handleVoucherChange,
        setLocalReferenceNumber, // El componente usa este setter para el input
        handleGenerarTickets,
        // --- VARIABLES NECESARIAS PARA EL JSX ---
        isDigitalPayment,
        isBatchOrder,
        referenceNumber,
        payer,
        setPayer, // Necesario para PayerDataForm
        voucher,
        isLoading,
        paymentInfo,
        summary,
        // Eliminamos el resto de variables y setters internos
    }
}