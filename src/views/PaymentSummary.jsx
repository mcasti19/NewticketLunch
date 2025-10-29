// // src/views/PaymentSummary.jsx (o donde lo tengas)

// import React, {useEffect, useState} from 'react';
// // Importaciones de Store y Lógica
// import {useTicketLunchStore} from '../store/ticketLunchStore';
// import {getPaymentMethodsMap} from '../services/actions';
// Componentes
import ModalResume from '../components/ModalResume'; // Asegúrate que la ruta es correcta
import {OrderDetails} from '../components/OrderDetails'; // Asegúrate que la ruta es correcta
import {PaymentOptionCard} from '../components/PaymentOptionCard'; // Importar el nuevo componente
import {usePaymentSummary} from '../hooks/usePaymentSummary';


export const PaymentSummary = ( {goToTicketTab, goBackSeleccionTab, goBackMyOrderTab} ) => {
  const {
    // --- HANDLERS ---
    openModal,
    closeModal,
    handleGenerarTickets,
    handleModifyOrder,
    // --- ESTADOS ---
    modalIsOpen,
    selectedPaymentOption,
    paymentMethodMap,
    isLoading,
    isError,
    // --- ESTADOS DEL STORE-- -
    orderOrigin

  } = usePaymentSummary( {goToTicketTab, goBackSeleccionTab, goBackMyOrderTab} )


  // --- LÓGICA DE RENDERIZADO CONDICIONAL ---

  // 1. Convertimos el mapa a un array de [nombre, id]
  const allPaymentOptions = Object.entries( paymentMethodMap );

  // 2. 🚨 APLICAMOS EL FILTRO 🚨
  const paymentOptions = allPaymentOptions.filter( ( [ name ] ) => {
    const lowerName = name.toLowerCase();
    // Incluimos solo las opciones que contengan "pago móvil" o "transferencia"
    return lowerName.includes( 'pago móvil' ) || lowerName.includes( 'transferencia' );
  } );

  // NOTA: Si los nombres exactos en tu API son "PAGO MOVIL" y "TRANSFERENCIA BANCARIA",
  // el filtro funcionará igual gracias al .toLowerCase().

  // 1. Muestra estado de carga
  if ( isLoading ) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">Cargando opciones de pago...</p>
        {/* Opcional: Agregar un spinner */}
      </div>
    );
  }

  // 2. Muestra mensaje de error
  if ( isError || paymentOptions.length === 0 ) {
    return (
      <div className="flex flex-col justify-center items-center h-40 p-4 bg-red-100 dark:bg-red-900 rounded-lg">
        <p className="text-xl font-bold text-red-700 dark:text-red-300">
          ¡Error! No se pudieron cargar los métodos de pago. 😔
        </p>
        <p className='text-sm text-red-600 dark:text-red-400 mt-2'>Por favor, intente recargar la página.</p>
      </div>
    );
  }

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div className='w-full md:h-full flex flex-col items-center justify-between p-4 bg-gradient-to-br from-blue-900/30 to-blue-950/30 rounded-md border-0'>
      <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 dark:text-blue-200 text-center tracking-tight mb-6">
        Resumen y Confirmación de Pago
      </h2>

      <div className="flex flex-col gap-8 w-full max-w-5xl">
        {/* 1. Detalles de la Orden */}
        <OrderDetails />

        {/* 2. Contenedor de Opciones de Pago */}
        <div className="p-6 dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl md:text-2xl font-bold text-center text-blue-900 dark:text-blue-300 mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">
            Seleccione su Opción de Pago
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full border-0">
            {/* GENERACIÓN DINÁMICA DE LAS OPCIONES DE PAGO */}
            {paymentOptions.map( ( [ name, id ] ) => (
              <PaymentOptionCard
                key={id}
                name={name}
                onClick={() => openModal( name )}
              />
            ) )}
          </div>
        </div>

      </div>
        {/* 3. Botón de Modificar Orden */}
      <div className="flex justify-center w-full mt-2">
        <button
          onClick={handleModifyOrder}
          className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-extrabold text-lg shadow-xl uppercase tracking-wider"
        >
          Modificar Orden
        </button>
      </div>

      {/* 4. Modal de Resumen */}
      {( modalIsOpen && selectedPaymentOption ) && (
        <ModalResume
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          paymentOption={selectedPaymentOption}
          paymentMethodMap={paymentMethodMap}
          onGenerarTickets={handleGenerarTickets}
          orderOrigin={orderOrigin}
        />
      )}
    </div>
  );
};



// import React, {useEffect, useState} from 'react';
// import {useTicketLunchStore} from '../store/ticketLunchStore';
// import ModalResume from '../components/ModalResume';
// import {OrderDetails} from '../components/OrderDetails';
// import {getPaymentMethodsMap} from '../services/actions'; // Asegúrate que la ruta sea correcta

// export const PaymentSummary = ( {goToTicketTab, goBackSeleccionTab, goBackMyOrderTab} ) => {
//   const [ modalIsOpen, setModalIsOpen ] = useState( false );
//   const [ selectedPaymentOption, setSelectedPaymentOption ] = useState( null );

//   // 💡 ESTADOS PARA MANEJAR LA CARGA DE DATOS DE LA API
//   const [ paymentMethodMap, setPaymentMethodMap ] = useState( {} );
//   const [ isLoading, setIsLoading ] = useState( true );

//   const setReferenceNumber = useTicketLunchStore( state => state.setReferenceNumber );
//   const setTicketEnabled = useTicketLunchStore( state => state.setTicketEnabled );
//   const orderOrigin = useTicketLunchStore( state => state.orderOrigin );

//   const openModal = option => {
//     console.log( "METODO DE PAGO SELECCIONADO: ", option );

//     // Si necesitas el ID del método de pago, aquí lo tienes:
//     // const paymentMethodId = paymentMethodsMap[option];
//     // console.log("ID del método de pago:", paymentMethodId);

//     setSelectedPaymentOption( option );
//     setModalIsOpen( true );
//   };

//   const closeModal = () => {
//     setModalIsOpen( false );
//     setSelectedPaymentOption( null );
//   };

//   const handleGenerarTickets = ( referenceNumber ) => {
//     setReferenceNumber( referenceNumber ); // Si quieres guardar en el store
//     setModalIsOpen( false );
//     setTicketEnabled( true ); // Habilita la tab de ticket
//     if ( goToTicketTab ) goToTicketTab();
//   };

//   const handleModifyOrder = () => {
//     if ( orderOrigin === 'mi-ticket' && goBackMyOrderTab ) {
//       goBackMyOrderTab();
//     } else if ( orderOrigin === 'seleccion' && goBackSeleccionTab ) {
//       goBackSeleccionTab();
//     } else {
//       // Comportamiento por defecto si el origen no está claro
//       if ( goBackSeleccionTab ) goBackSeleccionTab();
//     }
//   }

//   // 💡 EFECTO PARA LLAMAR A LA API Y OBTENER LOS MÉTODOS DE PAGO
//   useEffect( () => {
//     const fetchPaymentMethods = async () => {
//       try {
//         const map = await getPaymentMethodsMap();
//         setPaymentMethodMap( map );
//       } catch ( error ) {
//         console.error( "Error al cargar los métodos de pago.", error );
//         // Puedes establecer el mapa en un valor vacío o mostrar un error al usuario.
//         setPaymentMethodMap( {} );
//       } finally {
//         setIsLoading( false );
//       }
//     };

//     fetchPaymentMethods();
//   }, [] );


//   // 💡 LÓGICA DE CARGA Y DATOS

//   // Convertimos el mapa de pagos en un array para poder iterar sobre él en el JSX
//   const paymentOptions = Object.entries( paymentMethodMap );


//   // 1. Muestra un estado de carga
//   if ( isLoading ) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         <p className="text-xl font-semibold text-blue-600">Cargando opciones de pago...</p>
//         {/* Aquí podrías añadir un spinner de carga */}
//       </div>
//     );
//   }

//   // 2. Muestra un mensaje si no se encontraron métodos de pago (ej. por error de API)
//   if ( paymentOptions.length === 0 ) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         <p className="text-xl font-bold text-red-600">No se encontraron métodos de pago disponibles.</p>
//       </div>
//     );
//   }


//   // 3. Renderizado principal con las opciones de pago dinámicas
//   return (
//     <>
//       <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 text-center tracking-tight drop-shadow">Resumen de Almuerzos</h2>
//       <div className="flex flex-col lg:justify-center md:items-center gap-6 w-full max-w-4xl border-0">
//         <OrderDetails />

//         <div className="flex flex-col gap-4 w-full max-w-3xl border-0">
//           <h3 className="text-xl md:text-2xl font-bold text-center text-blue-700 mb-2">Opciones de Pago</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

//             {/* 💡 GENERACIÓN DINÁMICA DE LAS OPCIONES DE PAGO */}
//             {paymentOptions.map( ( [ name, id ] ) => (
//               <div
//                 key={id} // Usamos el ID del método como key
//                 className="flex flex-col items-center cursor-pointer rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-md hover:shadow-xl border border-blue-200 p-3 transition-all hover:scale-105"
//                 onClick={() => openModal( name )} // Pasamos el nombre del método (clave del mapa)
//               >
//                 <span className="font-bold text-blue-700 mb-1">{name}</span>
//                 {/* Lógica simple para seleccionar la imagen según el nombre */}
//                 <img
//                   src={
//                     name.toLowerCase().includes( 'transferencia' )
//                       ? "cuáles-son-los-bancos-de-venezuela.jpg"
//                       : name.toLowerCase().includes( 'pago móvil' )
//                         ? "./pagomovil-removebg-preview.png"
//                         : "./default-payment-icon.png" // Usa un ícono por defecto si no coincide
//                   }
//                   alt={name}
//                   className="w-24 md:w-32 rounded"
//                 />
//               </div>
//             ) )}

//           </div>
//         </div>
//       </div>

//       {/* 💡 CORRECCIÓN: Renderizar solo si está abierto y selectedPaymentOption tiene valor. */}
//       {/* 💡 CORRECCIÓN: ¡Pasar la prop paymentMethodsMap! */}
//       {( modalIsOpen && selectedPaymentOption ) && (
//         <ModalResume
//           isOpen={modalIsOpen}
//           onRequestClose={closeModal}
//           paymentOption={selectedPaymentOption}
//           paymentMethodMap={paymentMethodMap} // 👈 ¡ESTO ES LO QUE FALTABA!
//           onGenerarTickets={handleGenerarTickets}
//           orderOrigin={orderOrigin}
//         />
//       )}

//       <div className="flex justify-center w-full mt-4">
//         <button
//           onClick={handleModifyOrder}
//           className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-base shadow"
//         >
//           Modificar Orden
//         </button>
//       </div>
//     </>
//   );
// };