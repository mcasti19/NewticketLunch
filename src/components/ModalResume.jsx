// El componente debe estar definido como una función
import {
  // useEffect,
  useState
} from 'react';
import Modal from 'react-modal';
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';
import {useTicketLunchStore} from '../store/ticketLunchStore';

import {
  createOrderBatch,
  saveOrder
} from '../services/actions';
import {PiCopyThin} from "react-icons/pi";

const ModalResume = ( {isOpen, onRequestClose, paymentOption, onGenerarTickets, orderOrigin} ) => {
  const [ referenceNumber, setLocalReferenceNumber ] = useState( '' );
  const [ payer, setPayer ] = useState( {nombre: '', apellido: '', cedula: '', gerencia: '', telefono: ''} ); // Agregué 'telefono'
  const [ voucher, setVoucher ] = useState( null );
  const [ isLoading, setIsLoading ] = useState( false ); // Nuevo estado para deshabilitar el botón

  const employees = useTicketLunchStore( state => state.selectedEmpleadosSummary );
  const summary = useTicketLunchStore( state => state.summary );
  const setOrderId = useTicketLunchStore( state => state.setOrderId );
  const setQrData = useTicketLunchStore( state => state.setQrData );
  const setQrBatchData = useTicketLunchStore( state => state.setQrBatchData );
  const setReferenceNumberStore = useTicketLunchStore( state => state.setReferenceNumber );



  // ... (handleCopy se mantiene igual)
  const handleCopy = async ( text ) => {
    try {
      await navigator.clipboard.writeText( text );
      alert( "¡Número copiado al portapapeles!" );
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

  const isPagoMovil = paymentOption === 'Pago Móvil';
  const isTransferencia = paymentOption === 'Transferencia';

  // Función PRINCIPAL para enviar los datos a la API
  const handleGenerarTickets = async ( e ) => {
    e.preventDefault();
    setIsLoading( true );
    try {
      let response;
      if ( orderOrigin === 'seleccion' && Array.isArray( employees ) && employees.length > 1 ) {
        // FLUJO POR LOTE
        response = await createOrderBatch( {
          employees,
          paymentOption,
          referenceNumber,
          payer,
          // voucher,
        } );
        setOrderId( response );
        // Construir los QR individuales para cada empleado usando el id de la orden
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
        
        console.log( "FLUJO INDIVIDUAL" );
        // FLUJO INDIVIDUAL
        const emp = employees[ 0 ];
        response = await saveOrder( {
          employee: emp,
          paymentOption,
          referenceNumber,
          payer,
          voucher,
          extras: emp.extras || [],
        } );
        console.log( "RESPONSE" );
        setOrderId( response );

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
      setReferenceNumberStore( referenceNumber );
      setLocalReferenceNumber( '' );
      setPayer( {nombre: '', apellido: '', cedula: '', gerencia: '', telefono: ''} );
      setVoucher( null );
      setIsLoading( false );
      // Solo llamar al callback de generación si todo fue exitoso
      if ( onGenerarTickets ) onGenerarTickets( referenceNumber );

    } catch ( error ) {
      setIsLoading( false );
      const message = error?.message || error || 'Error al generar los tickets';
      // Mostrar popup con SweetAlert2
      Swal.fire({
        title: 'Error',
        text: String(message),
        icon: 'error',
        confirmButtonText: 'Volver'
      }).then(() => {
        // Cerrar el modal y regresar a la vista anterior
        if ( onRequestClose ) onRequestClose();
      });
    }
  };

  return (
    <Modal
      // ... (Props y estilos del Modal se mantienen igual)
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
      <div className="mb-6 text-center font-bold text-lg text-blue-800">
        Total a pagar: <span className="text-green-600">Bs. {summary.totalPagar?.toFixed( 2 ) ?? '0.00'}</span>
      </div>

      <form onSubmit={handleGenerarTickets} className="flex flex-col gap-4">

        {/* --- (Pago Móvil / Transferencia info se mantiene igual) --- */}
        {isPagoMovil && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between font-bold text-blue-700">
              <label htmlFor="">Número de Teléfono:</label>
              <div className="flex text-gray-800 hover:text-blue-500 transition-colors duration-200 ml-2">
                <label htmlFor="">0414-2418171 </label>
                <PiCopyThin onClick={() => handleCopy( '0414-2418171' )} style={{cursor: 'pointer', userSelect: 'none'}} />
              </div>
            </div>
            <div className="flex justify-between font-bold text-blue-700">
              <label htmlFor="">Banco:</label>
              <div className=" flex text-gray-800 hover:text-blue-500 transition-colors duration-200">
                <label htmlFor="">0108 - Provicial</label>
                <PiCopyThin onClick={() => handleCopy( '0108' )} style={{cursor: 'pointer', userSelect: 'none'}} />
              </div>
            </div>
            <div className="flex justify-between font-bold text-blue-700">
              <label htmlFor="">Cédula:</label>
              <div className=" flex text-gray-800 hover:text-blue-500 transition-colors duration-200">
                <label htmlFor="">V-19.254.775</label>
                <PiCopyThin onClick={() => handleCopy( '19.254.775' )} style={{cursor: 'pointer', userSelect: 'none'}} />
              </div>
            </div>
          </div>
        )}

        {isTransferencia && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between font-bold text-blue-700">
              <label htmlFor="">Número de Cuenta:</label>
              <div className="flex text-gray-800 hover:text-blue-500 transition-colors duration-200 ml-2">
                <label htmlFor="">0000 0000 0000 0000</label>
                <PiCopyThin onClick={() => handleCopy( '0000 0000 0000 0000' )} style={{cursor: 'pointer', userSelect: 'none'}} />
              </div>
            </div>
            <div className="flex justify-between font-bold text-blue-700">
              <label htmlFor="">Banco:</label>
              <div className=" flex text-gray-800 hover:text-blue-500 transition-colors duration-200">
                <label htmlFor="">0108 - Provicial</label>
                <PiCopyThin onClick={() => handleCopy( '0108' )} style={{cursor: 'pointer', userSelect: 'none'}} />
              </div>
            </div>
          </div>
        )}

        {/* --- (DATOS DE QUIEN REALIZA EL PAGO) --- */}
        {( isPagoMovil || isTransferencia ) && (
          <>
            {( orderOrigin === "seleccion" ) && (
              <div className="flex flex-col gap-2 mb-2 p-2 bg-blue-50 rounded">
                <div className="font-bold text-blue-700 mb-1 text-center">Quien realiza el pago</div>
                <input
                  type="text"
                  placeholder="Nombre"
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
                  placeholder="Cédula"
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
                  placeholder="Teléfono" // Agregué el campo teléfono aquí
                  className="p-2 border border-blue-200 rounded mb-1"
                  value={payer.telefono}
                  onChange={e => setPayer( p => ( {...p, telefono: e.target.value} ) )}
                />
              </div>
            )}

            <div className="flex flex-col gap-2 mb-2 p-2 bg-blue-50 rounded">
              <label className="font-bold text-blue-700 mb-1 text-center">Adjuntar Captura de pago</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg" // Definir los tipos de archivo
                onChange={handleVoucherChange}
                className="p-2 border border-blue-200 rounded"
              />
              {voucher && (
                <img src={URL.createObjectURL( voucher )} alt="Voucher" className="mt-2 max-h-32 rounded shadow" />
              )}
            </div>
          </>
        )}

        <div className='flex flex-col  justify-center items-center m-auto py-1.5'>
          <label htmlFor="referenceNumber" className="font-bold text-blue-700">
            Número de referencia:
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
            disabled={isLoading} // Deshabilitar durante la carga
          >
            {isLoading ? 'Enviando...' : 'Generar Tickets'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default ModalResume;