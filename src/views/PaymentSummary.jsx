import React, {useEffect, useState} from 'react';
import {useTicketLunchStore} from '../store/ticketLunchStore';
import ModalResume from '../components/ModalResume';
import {OrderDetails} from '../components/OrderDetails';
import {getPaymentMethodsMap} from '../services/actions'; // Asegúrate que la ruta sea correcta

export const PaymentSummary = ( {goToTicketTab, goBackSeleccionTab, goBackMiTicketTab} ) => {
  const [ modalIsOpen, setModalIsOpen ] = useState( false );
  const [ selectedPaymentOption, setSelectedPaymentOption ] = useState( null );

  // 💡 ESTADOS PARA MANEJAR LA CARGA DE DATOS DE LA API
  const [ paymentMethodMap, setPaymentMethodMap ] = useState( {} );
  const [ isLoading, setIsLoading ] = useState( true );

  const setReferenceNumber = useTicketLunchStore( state => state.setReferenceNumber );
  const setTicketEnabled = useTicketLunchStore( state => state.setTicketEnabled );
  const orderOrigin = useTicketLunchStore( state => state.orderOrigin );

  const openModal = option => {
    console.log( "METODO DE PAGO SELECCIONADO: ", option );

    // Si necesitas el ID del método de pago, aquí lo tienes:
    // const paymentMethodId = paymentMethodsMap[option];
    // console.log("ID del método de pago:", paymentMethodId);

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
    setTicketEnabled( true ); // Habilita la tab de ticket
    if ( goToTicketTab ) goToTicketTab();
  };

  const handleModifyOrder = () => {
    if ( orderOrigin === 'mi-ticket' && goBackMiTicketTab ) {
      goBackMiTicketTab();
    } else if ( orderOrigin === 'seleccion' && goBackSeleccionTab ) {
      goBackSeleccionTab();
    } else {
      // Comportamiento por defecto si el origen no está claro
      if ( goBackSeleccionTab ) goBackSeleccionTab();
    }
  }

  // 💡 EFECTO PARA LLAMAR A LA API Y OBTENER LOS MÉTODOS DE PAGO
  useEffect( () => {
    const fetchPaymentMethods = async () => {
      try {
        const map = await getPaymentMethodsMap();
        setPaymentMethodMap( map );
      } catch ( error ) {
        console.error( "Error al cargar los métodos de pago.", error );
        // Puedes establecer el mapa en un valor vacío o mostrar un error al usuario.
        setPaymentMethodMap( {} );
      } finally {
        setIsLoading( false );
      }
    };

    fetchPaymentMethods();
  }, [] );


  // 💡 LÓGICA DE CARGA Y DATOS

  // Convertimos el mapa de pagos en un array para poder iterar sobre él en el JSX
  const paymentOptions = Object.entries( paymentMethodMap );


  // 1. Muestra un estado de carga
  if ( isLoading ) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-xl font-semibold text-blue-600">Cargando opciones de pago...</p>
        {/* Aquí podrías añadir un spinner de carga */}
      </div>
    );
  }

  // 2. Muestra un mensaje si no se encontraron métodos de pago (ej. por error de API)
  if ( paymentOptions.length === 0 ) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-xl font-bold text-red-600">No se encontraron métodos de pago disponibles.</p>
      </div>
    );
  }


  // 3. Renderizado principal con las opciones de pago dinámicas
  return (
    <>
      <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 text-center tracking-tight drop-shadow">Resumen de Almuerzos</h2>
      <div className="flex flex-col lg:justify-center md:items-center gap-6 w-full max-w-4xl border-0">
        <OrderDetails />

        <div className="flex flex-col gap-4 w-full max-w-3xl border-0">
          <h3 className="text-xl md:text-2xl font-bold text-center text-blue-700 mb-2">Opciones de Pago</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

            {/* 💡 GENERACIÓN DINÁMICA DE LAS OPCIONES DE PAGO */}
            {paymentOptions.map( ( [ name, id ] ) => (
              <div
                key={id} // Usamos el ID del método como key
                className="flex flex-col items-center cursor-pointer rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-md hover:shadow-xl border border-blue-200 p-3 transition-all hover:scale-105"
                onClick={() => openModal( name )} // Pasamos el nombre del método (clave del mapa)
              >
                <span className="font-bold text-blue-700 mb-1">{name}</span>
                {/* Lógica simple para seleccionar la imagen según el nombre */}
                <img
                  src={
                    name.toLowerCase().includes( 'transferencia' )
                      ? "cuáles-son-los-bancos-de-venezuela.jpg"
                      : name.toLowerCase().includes( 'pago móvil' )
                        ? "./pagomovil-removebg-preview.png"
                        : "./default-payment-icon.png" // Usa un ícono por defecto si no coincide
                  }
                  alt={name}
                  className="w-24 md:w-32 rounded"
                />
              </div>
            ) )}

          </div>
        </div>
      </div>

      {/* 💡 CORRECCIÓN: Renderizar solo si está abierto y selectedPaymentOption tiene valor. */}
      {/* 💡 CORRECCIÓN: ¡Pasar la prop paymentMethodsMap! */}
      {( modalIsOpen && selectedPaymentOption ) && (
        <ModalResume
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          paymentOption={selectedPaymentOption}
          paymentMethodMap={paymentMethodMap} // 👈 ¡ESTO ES LO QUE FALTABA!
          onGenerarTickets={handleGenerarTickets}
          orderOrigin={orderOrigin}
        />
      )}

      <div className="flex justify-center w-full mt-4">
        <button
          onClick={handleModifyOrder}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-base shadow"
        >
          Modificar Orden
        </button>
      </div>
    </>
  );
};