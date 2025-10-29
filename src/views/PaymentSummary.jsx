import {ModalResume} from '../components/ModalResume'; // Asegúrate que la ruta es correcta
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