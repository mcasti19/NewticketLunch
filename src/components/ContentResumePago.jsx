import React, {useState} from 'react';
import {useTicketLunchStore} from '../store/ticketLunchStore';
import ModalResume from './ModalResume';
import {OrderDetails} from './OrderDetails';


export const ContentResume = ( {goToTicketTab, goBackSeleccionTab} ) => {
  const [ modalIsOpen, setModalIsOpen ] = useState( false );
  const [ selectedPaymentOption, setSelectedPaymentOption ] = useState( null );
  const setReferenceNumber = useTicketLunchStore( state => state.setReferenceNumber );
  const setTicketEnabled = useTicketLunchStore(state => state.setTicketEnabled);

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
    setModalIsOpen( false );
    setTicketEnabled(true); // Habilita la tab de ticket
    if ( goToTicketTab ) goToTicketTab();
  };

  const handleBackToSeleccionTab = () => {
    // console.log( "REGRESANDO" );

    if ( goBackSeleccionTab ) goBackSeleccionTab();
  }

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
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        paymentOption={selectedPaymentOption}
        onGenerarTickets={handleGenerarTickets}
      />

      <div className="flex justify-center w-full mt-4">
        <button
          onClick={handleBackToSeleccionTab}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-base shadow"
        >
          Modificar Orden
        </button>
      </div>
    </>
  );
};
