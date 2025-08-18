// El componente debe estar definido como una función
import React, {useState} from 'react';
import Modal from 'react-modal';
import {toast} from 'react-toastify';
import {useTicketLunchStore} from '../store/ticketLunchStore';
import {PiCopyThin} from "react-icons/pi";

const ModalResume = ( {isOpen, onRequestClose, paymentOption, onVerResumen, onGenerarTickets} ) => {
  const [ paymentDetails, setPaymentDetails ] = useState( {
    phoneNumber: '',
    bank: '',
    idNumber: '',
    accountNumber: '',
    accountType: '',
  } );
  const [ referenceNumber, setReferenceNumber ] = useState( '' );
  const setReferenceNumberStore = useTicketLunchStore( state => state.setReferenceNumber );
  // const empleados = useTicketLunchStore(state => state.selectedEmpleadosSummary);
  const summary = useTicketLunchStore( state => state.summary );

  const handleInputChange = ( field ) => ( e ) => {
    setPaymentDetails( ( prev ) => ( {...prev, [ field ]: e.target.value} ) );
  };

  const handleCopy = async ( text ) => {
    try {
      await navigator.clipboard.writeText( text );
      alert( "¡Número copiado al portapapeles!" );
    } catch ( err ) {
      console.error( 'Error al copiar: ', err );
      toast.error( "Error al copiar el número." );
    }
  };

  const isPagoMovil = paymentOption === 'Pago Móvil';
  const isTransferencia = paymentOption === 'Transferencia';

  // // Lógica para generar tickets
  // const handleGenerarTickets = ( e ) => {
  //   e.preventDefault();
  //   if ( !referenceNumber || referenceNumber.trim() === '' ) {
  //     setTimeout( () => {
  //       toast.error( 'Debe ingresar el número de referencia antes de continuar.' );
  //     }, 100 );
  //     return;
  //   }
  //   setReferenceNumberStore( referenceNumber );
  //   if ( typeof onVerResumen === 'function' ) onVerResumen( referenceNumber );
  //   setReferenceNumber( '' );
  //   onRequestClose();
  // };

  // Validación y notificación
  const handleGenerarTickets = ( e ) => {
    e.preventDefault();
    if ( !referenceNumber || referenceNumber.trim() === '' ) {
      setTimeout( () => {
        toast.error( 'Debe ingresar el número de referencia antes de continuar.' );
      }, 100 );
      return;
    }
    if ( onGenerarTickets ) onGenerarTickets( referenceNumber );
    setReferenceNumber( '' );
  };


  return (
    <Modal
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
            <label htmlFor="bank" className="font-bold text-blue-700">Banco:</label>
            <input
              id="bank"
              type="text"
              placeholder="Ingrese banco"
              value={paymentDetails.bank}
              onChange={handleInputChange( 'bank' )}
              className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm"
            />
            <label htmlFor="accountNumber" className="font-bold text-blue-700">Número de Cuenta:</label>
            <input
              id="accountNumber"
              type="text"
              placeholder="Ingrese número de cuenta"
              value={paymentDetails.accountNumber}
              onChange={handleInputChange( 'accountNumber' )}
              className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm"
            />
            <label htmlFor="accountType" className="font-bold text-blue-700">Tipo de Cuenta:</label>
            <input
              id="accountType"
              type="text"
              placeholder="Ingrese tipo de cuenta"
              value={paymentDetails.accountType}
              onChange={handleInputChange( 'accountType' )}
              className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm"
            />
            <label htmlFor="idNumber" className="font-bold text-blue-700">Cédula:</label>
            <input
              id="idNumber"
              type="text"
              placeholder="Ingrese cédula"
              value={paymentDetails.idNumber}
              onChange={handleInputChange( 'idNumber' )}
              className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm"
            />
          </div>
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
            onChange={e => setReferenceNumber( e.target.value )}
            className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-center md:justify-between gap-4 mt-4">
          <button
            type="button"
            onClick={onRequestClose}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Cerrar
          </button>
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Generar Tickets
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalResume;