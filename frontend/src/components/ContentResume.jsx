import React, {useState} from 'react';
import {useTicketLunchStore} from '../store/ticketLunchStore';
import ModalResume from './ModalResume';
// import ModalResumenFinal from './ModalResumenFinal';
import {OrderDetails} from './OrderDetails';


export const ContentResume = ( {goToTicketTab} ) => {
  const [ modalIsOpen, setModalIsOpen ] = useState( false );
  const [ selectedPaymentOption, setSelectedPaymentOption ] = useState( null );
  const setReferenceNumber = useTicketLunchStore( state => state.setReferenceNumber );

  const openModal = option => {
    setSelectedPaymentOption( option );
    setModalIsOpen( true );
  };
  const closeModal = () => {
    setModalIsOpen( false );
    setSelectedPaymentOption( null );
  };

  const handleGenerarTickets = ( referenceNumber ) => {
    setReferenceNumber( referenceNumber ); // Si quieres guardar en el store
    // setResumenOpen( false );
    setModalIsOpen( false );
    if ( goToTicketTab ) goToTicketTab();
  };

  return (
    <>
      <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 text-center tracking-tight drop-shadow">Resumen de Almuerzos</h2>
      <div className="flex flex-col lg:justify-center md:items-center gap-6 w-full max-w-4xl border-0">
        <OrderDetails />

        <div className="flex flex-col gap-4 w-full max-w-3xl border-0">
          <h3 className="text-xl md:text-2xl font-bold text-center text-blue-700 mb-2">Opciones de Pago</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div
              className="flex flex-col items-center cursor-pointer rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-md hover:shadow-xl border border-blue-200 p-3 transition-all hover:scale-105"
              onClick={() => openModal( 'Pago Móvil' )}
            >
              <span className="font-bold text-blue-700 mb-1">Pago Móvil</span>
              <img src="./pagomovil-removebg-preview.png" alt="pago_movil" className="w-24 md:w-32" />
            </div>
            <div
              className="flex flex-col items-center cursor-pointer rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-md hover:shadow-xl border border-blue-200 p-3 transition-all hover:scale-105"
              onClick={() => openModal( 'Transferencia' )}
            >
              <span className="font-bold text-blue-700 mb-1">Transferencia</span>
              <img src="cuáles-son-los-bancos-de-venezuela.jpg" alt="transferencia" className="w-24 md:w-32 rounded" />
            </div>
            <div
              className="flex flex-col items-center cursor-pointer rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-md hover:shadow-xl border border-blue-200 p-3 transition-all hover:scale-105"
              onClick={() => openModal( 'Débito' )}
            >
              <span className="font-bold text-blue-700 mb-1">Débito</span>
              <img src="./tarjeta.png" alt="tarjeta_debito" className="w-24 md:w-32" />
            </div>
            <div
              className="flex flex-col items-center cursor-pointer rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-md hover:shadow-xl border border-blue-200 p-3 transition-all hover:scale-105"
              onClick={() => openModal( 'Efectivo' )}
            >
              <span className="font-bold text-blue-700 mb-1">Efectivo</span>
              <img src="./efectivo.png" alt="Bolivares_efectivo" className="w-24 md:w-32" />
            </div>
          </div>
        </div>
      </div>


      <ModalResume
        // isOpen={resumenOpen}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        paymentOption={selectedPaymentOption}
        // onVerResumen={openResumen}

        onGenerarTickets={handleGenerarTickets}
      />
    </>
  );
};
