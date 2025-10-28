// El componente debe estar definido como una función
import {useEffect, useState} from 'react';
import Modal from 'react-modal';
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';
import {useTicketLunchStore} from '../store/ticketLunchStore';

import {createOrderBatch, saveOrder} from '../services/actions';
import {PiCopyThin} from "react-icons/pi";

// 💡 Modificamos las props para recibir el mapa de pagos
const ModalResume = ( {isOpen, onRequestClose, paymentOption, paymentMethodMap, onGenerarTickets, orderOrigin} ) => {
  const [ referenceNumber, setLocalReferenceNumber ] = useState( '' );
  const [ payer, setPayer ] = useState( {nombre: '', apellido: '', cedula: '', gerencia: '', telefono: ''} );
  const [ voucher, setVoucher ] = useState( null );
  const [ isLoading, setIsLoading ] = useState( false );
  // 💡 Nuevo estado para la información específica del método de pago (ej: cuenta, teléfono)
  const [ paymentInfo, setPaymentInfo ] = useState( null );

  const employees = useTicketLunchStore( state => state.selectedEmpleadosSummary );
  const summary = useTicketLunchStore( state => state.summary );
  const setOrderData = useTicketLunchStore( state => state.setOrderData );
  const setQrData = useTicketLunchStore( state => state.setQrData );
  const setQrBatchData = useTicketLunchStore( state => state.setQrBatchData );
  const setReferenceNumberStore = useTicketLunchStore( state => state.setReferenceNumber );

  // 💡 LÓGICA: En un componente real, la información del pago (teléfono, cuenta, banco)
  // debería cargarse aquí o pasarse como prop desde el componente padre.
  // Como no tenemos una API para esa info, la hardcodeamos temporalmente, 
  // pero usando el nombre del pago para simular la dinámica.
  useEffect( () => {
    // Simulamos cargar la información de contacto bancaria/móvil
    if ( paymentOption ) {
      // Objeto que simula la información adicional que vendría de una API
      const dummyInfo = {
        'Pago Móvil': {
          telefono: '0414-2418171',
          banco: '0108 - Provicial',
          cedula: 'V-19.254.775',
        },
        'Transferencia Bancaria': {
          cuenta: '0000 0000 0000 0000',
          banco: '0108 - Provicial',
        },
        // ... Otros métodos de pago ...
      };
      setPaymentInfo( dummyInfo[ paymentOption ] || null );
    } else {
      setPaymentInfo( null );
    }
  }, [ paymentOption ] );

  const handleCopy = async ( text ) => {
    try {
      await navigator.clipboard.writeText( text );
      toast.success( "¡Número copiado al portapapeles!" ); // Usamos toast para un mejor feedback
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
        e.target.value = ''; // Limpiar el input
      } else {
        setVoucher( file );
      }
    }
  };

  // 💡 Obtenemos el ID del método de pago, que es lo que la API necesita
  const paymentMethodId = paymentMethodMap?.[ paymentOption ] || null;
  const isDigitalPayment = paymentMethodId && paymentOption !== 'Efectivo Bolivares' && paymentOption !== 'Efectivo Divisas'; // Asume que solo se necesita ref/voucher para pagos digitales

  // Función PRINCIPAL para enviar los datos a la API
  const handleGenerarTickets = async ( e ) => {
    e.preventDefault();

    console.log( "METODO DE PAGO: ", paymentMethodId );


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
      let OrderResponse;

      const payloadBase = {
        paymentMethod: paymentMethodId, // 💡 ENVIAMOS EL ID DE PAGO
        referenceNumber,
        payer,
        voucher: voucher, // El componente padre debe manejar si se envía o no el archivo
      };

      if ( orderOrigin === 'seleccion' && Array.isArray( employees ) && employees.length > 1 ) {
        // FLUJO POR LOTE
        OrderResponse = await createOrderBatch( {
          employees,
          ...payloadBase,
        } );
        setOrderData( OrderResponse );

        // ... (Lógica de construcción de QR Batch se mantiene igual) ...
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
          // Añadimos los ids que se envían en saveOrder para que estén disponibles en el QR
          id_order_status: '1',
          id_orders_consumption: '1',
        } ) );
        setQrBatchData( batchQR );
        setQrData( null );

      } else {

        console.log( "ENTRANDO A ENVIO INDIVIDUAL" );

        // FLUJO INDIVIDUAL
        const emp = employees[ 0 ];
        OrderResponse = await saveOrder( {
          employee: emp,
          extras: emp.extras || [],
          ...payloadBase,
        } );
        setOrderData( OrderResponse );

        // console.log( "TODO EMPLEADO:", emp );

        // ... (Lógica de construcción de QR Individual se mantiene igual) ...
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
          // Añadimos los ids que se envían en saveOrder para que estén disponibles en el QR
          id_order_status: '1',
          id_orders_consumption: '1',
        };
        setQrData( qrDataFinal );
        setQrBatchData( null );
        console.log( "SALIMOS DEL ELSE", qrDataFinal );
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

  return (
    <Modal
      // ... (Estilos del Modal)
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '95vw',
          maxWidth: '400px',
          minWidth: '320px',
          maxHeight: '95vh',
          overflowY: 'auto',
          padding: '32px',
          borderRadius: '18px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)',
        }
      }}
      contentLabel="Resumen y Pago"
    >
      <div className="mb-4 text-center">
        <h3 className="font-extrabold text-xl text-blue-700">{paymentOption}</h3>
        <div className="font-bold text-lg text-blue-800">
          Total a pagar: <span className="text-green-600">Bs. {summary.totalPagar?.toFixed( 2 ) ?? '0.00'}</span>
        </div>
      </div>

      <form onSubmit={handleGenerarTickets} className="flex flex-col gap-4">

        {/* --- INFORMACIÓN DEL MÉTODO DE PAGO DINÁMICA --- */}
        {paymentInfo && (
          <div className="flex flex-col gap-2 p-3 bg-blue-100 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-700 text-center mb-1">Datos de Pago</h4>

            {paymentInfo.telefono && (
              <div className="flex justify-between font-semibold text-sm text-gray-700">
                <label>Teléfono:</label>
                <div className="flex items-center text-gray-800 cursor-pointer hover:text-blue-500" onClick={() => handleCopy( paymentInfo.telefono )}>
                  <label className="mr-1">{paymentInfo.telefono}</label>
                  <PiCopyThin />
                </div>
              </div>
            )}

            {paymentInfo.cuenta && (
              <div className="flex justify-between font-semibold text-sm text-gray-700">
                <label>Cuenta:</label>
                <div className="flex items-center text-gray-800 cursor-pointer hover:text-blue-500" onClick={() => handleCopy( paymentInfo.cuenta )}>
                  <label className="mr-1">{paymentInfo.cuenta}</label>
                  <PiCopyThin />
                </div>
              </div>
            )}

            {paymentInfo.banco && (
              <div className="flex justify-between font-semibold text-sm text-gray-700">
                <label>Banco:</label>
                <div className="flex items-center text-gray-800 cursor-pointer hover:text-blue-500" onClick={() => handleCopy( paymentInfo.banco.split( ' - ' )[ 0 ] )}>
                  <label className="mr-1">{paymentInfo.banco}</label>
                  <PiCopyThin />
                </div>
              </div>
            )}

            {paymentInfo.cedula && (
              <div className="flex justify-between font-semibold text-sm text-gray-700">
                <label>Cédula:</label>
                <div className="flex items-center text-gray-800 cursor-pointer hover:text-blue-500" onClick={() => handleCopy( paymentInfo.cedula.replace( 'V-', '' ).replace( /\./g, '' ) )}>
                  <label className="mr-1">{paymentInfo.cedula}</label>
                  <PiCopyThin />
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- DATOS DE QUIEN REALIZA EL PAGO (Se mantiene si es digital y lote) --- */}
        {isDigitalPayment && orderOrigin === "seleccion" && (
          <div className="flex flex-col gap-2 mb-2 p-2 bg-blue-50 rounded border border-blue-200">
            <div className="font-bold text-blue-700 mb-1 text-center">Datos de quien realiza el pago</div>
            <input
              type="text"
              placeholder="Nombre (*)"
              className="p-2 border border-blue-200 rounded mb-1"
              value={payer.nombre}
              onChange={e => setPayer( p => ( {...p, nombre: e.target.value} ) )}
            />
            <input
              type="text"
              placeholder="Apellido"
              className="p-2 border border-blue-200 rounded mb-1"
              value={payer.apellido}
              onChange={e => setPayer( p => ( {...p, apellido: e.target.value} ) )}
            />
            <input
              type="text"
              placeholder="Cédula (*)"
              className="p-2 border border-blue-200 rounded mb-1"
              value={payer.cedula}
              onChange={e => setPayer( p => ( {...p, cedula: e.target.value} ) )}
            />
            <input
              type="text"
              placeholder="Gerencia"
              className="p-2 border border-blue-200 rounded mb-1"
              value={payer.gerencia}
              onChange={e => setPayer( p => ( {...p, gerencia: e.target.value} ) )}
            />
            <input
              type="text"
              placeholder="Teléfono"
              className="p-2 border border-blue-200 rounded mb-1"
              value={payer.telefono}
              onChange={e => setPayer( p => ( {...p, telefono: e.target.value} ) )}
            />
          </div>
        )}

        {/* --- ADJUNTAR CAPTURA DE PAGO (Solo si es un pago digital) --- */}
        {isDigitalPayment && (
          <div className="flex flex-col gap-2 mb-2 p-2 bg-blue-50 rounded border border-blue-200">
            <label className="font-bold text-blue-700 mb-1 text-center">Adjuntar Captura de pago (*)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleVoucherChange}
              className="p-2 border border-blue-200 rounded"
            />
            {voucher && (
              <img src={URL.createObjectURL( voucher )} alt="Voucher" className="mt-2 max-h-32 rounded shadow" />
            )}
          </div>
        )}

        {/* --- NÚMERO DE REFERENCIA (Solo si es un pago digital) --- */}
        {isDigitalPayment && (
          <div className='flex flex-col  justify-center items-center m-auto py-1.5'>
            <label htmlFor="referenceNumber" className="font-bold text-blue-700">
              Número de referencia: (*)
            </label>
            <input
              id="referenceNumber"
              type="text"
              placeholder="Ingrese número de referencia"
              value={referenceNumber}
              onChange={e => setLocalReferenceNumber( e.target.value )}
              className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm"
            />
          </div>
        )}

        {/* --- BOTONES DE ACCIÓN --- */}
        <div className="flex flex-col md:flex-row justify-center md:justify-between gap-4 mt-4">
          <button
            type="button"
            onClick={onRequestClose}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg font-semibold transition-colors"
            disabled={isLoading}
          >
            Cerrar
          </button>
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Generar Tickets'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default ModalResume;