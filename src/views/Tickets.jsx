import {useEffect} from 'react'
import {MyQRCodeComponent} from '../components/MyQRCodeComponent'
import {useTicketLunchStore} from '../store/ticketLunchStore'
import {useBuildDataToQR} from '../hooks/useBuildDataToQR';
import {useNavigate} from 'react-router'; // 👈 1. IMPORTAR HOOK DE NAVEGACIÓN

export const Tickets = () => {
  // Variables del Store
  const qrData = useTicketLunchStore( ( state ) => state.qrData );
  const qrBatchData = useTicketLunchStore( ( state ) => state.qrBatchData );
  const orderData = useTicketLunchStore( state => state.orderData );
  const selectedEmpleadosSummary = useTicketLunchStore( state => state.selectedEmpleadosSummary );
  const orderOrigin = useTicketLunchStore( state => state.orderOrigin );
  const referenceNumber = useTicketLunchStore( state => state.referenceNumber );

  // 💡 2. OBTENER LA FUNCIÓN DE RESETEO DEL STORE
  const resetOrderData = useTicketLunchStore( ( state ) => state.resetOrderData );

  // OBTENER LA FUNCIÓN BUILDER DEL HOOK (Asumo que sigue siendo necesaria)
  const {builderDataQR} = useBuildDataToQR();

  // Inicializar navegación
  const navigate = useNavigate();

  useEffect( () => {
    // Reconstruir el QR siempre que cambie la orden o la selección
    builderDataQR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ orderData, selectedEmpleadosSummary, orderOrigin, referenceNumber ] );

  // 💡 3. FUNCIÓN PARA CERRAR LA ORDEN
  const handleCloseOrder = () => {
    // 🚨 4. LIMPIAR EL STORE y NAVEGAR
    resetOrderData();
    navigate( '/' ); // Redirige a la ruta raíz (o la ruta que desees)
  }

  // El estado de carga se deriva directamente de la presencia de datos.
  const isLoading = !qrData && ( !qrBatchData || qrBatchData.length === 0 );

  return (
    <div className="w-full h-full max-h-screen p-4 overflow-y-auto">
      <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-tight drop-shadow">Generar Ticket QR</h2>
      <div className="w-full flex flex-col border-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 border-2">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mb-4"></div>
            <p className="text-blue-700 text-lg font-semibold">Generando ticket, espera la respuesta...</p>
          </div>
        ) : (
          <>
            {qrBatchData && Array.isArray( qrBatchData ) && qrBatchData.length > 0 ? (
              <div className="flex flex-wrap gap-8 justify-center border-2">
                {qrBatchData.map( ( qr, idx ) => (
                  <div key={idx} className="w-full md:w-auto border-2">
                    <MyQRCodeComponent qrData={qr} />
                  </div>
                ) )}</div>
            ) : (
              <MyQRCodeComponent qrData={qrData} />
            )}

            <p className="text-center text-gray-700 dark:text-amber-50 text-base md:text-lg mt-2">Cada empleado tendra su QR en su perfil</p>
          </>
        )}
      </div>

      {/* 💡 5. BOTÓN "FINALIZAR Y VOLVER" */}
      <div className="flex justify-center mt-8 pb-10">
        <button
          onClick={handleCloseOrder}
          className="w-full max-w-sm bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-extrabold shadow-lg transition-colors text-lg"
          disabled={isLoading}
        >
          Finalizar y Volver
        </button>
      </div>

    </div>
  );
}




















// // import {useEffect} from 'react'
// import {MyQRCodeComponent} from '../components/MyQRCodeComponent'
// import {useTicketLunchStore} from '../store/ticketLunchStore'
// // 🗑️ Importación de useBuildDataToQR eliminada
// // import {useBuildDataToQR} from '../hooks/useBuildDataToQR';

// export const Tickets = () => {
//   const qrData = useTicketLunchStore( ( state ) => state.qrData );
//   const qrBatchData = useTicketLunchStore( ( state ) => state.qrBatchData );

//   // 🗑️ Variables del store que ya no se usan en este componente
//   // const orderData = useTicketLunchStore( state => state.orderData );
//   // const selectedEmpleadosSummary = useTicketLunchStore( state => state.selectedEmpleadosSummary );
//   // const orderOrigin = useTicketLunchStore( state => state.orderOrigin );
//   // const referenceNumber = useTicketLunchStore( state => state.referenceNumber );

//   // 🗑️ La llamada al builderDataQR en useEffect ha sido eliminada.
//   // La data de QR debe ser establecida únicamente por el hook que guarda la orden (e.g., useModalResume.js)
//   // useEffect( () => {
//   //   builderDataQR();
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [ orderData, selectedEmpleadosSummary, orderOrigin, referenceNumber ] );

//   const handleCloseOrder = () => {
//     // 💡 NOTA: Aquí deberías resetear la store si se navega a otro módulo.
//     console.log( "FINALIZANDO ORDER" );
//   }

//   // El estado de carga es ahora más robusto
//   const isLoading = !qrData && ( !qrBatchData || qrBatchData.length === 0 );

//   return (
//     <div className="w-full h-full max-h-screen p-4 md:p-8 bg-white rounded-xl shadow-2xl">
//       <h2 className="text-2xl md:text-3xl font-black text-blue-800 text-center mb-6 tracking-tight drop-shadow-md border-b pb-3">
//         ✅ Tickets QR Generados
//       </h2>

//       {/* Contenedor principal de visualización */}
//       <div className="w-full flex flex-col items-center">

//         {isLoading ? (
//           /* --- Estado de Carga / Inicial --- */
//           <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-blue-300">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mb-4"></div>
//             <p className="text-blue-700 text-lg font-semibold">Esperando la generación de tickets...</p>
//             <p className="text-gray-500 text-sm mt-1">Si la carga persiste, intente generar el pedido de nuevo.</p>
//           </div>
//         ) : (
//           <>
//             {/* --- VISUALIZACIÓN POR LOTES (Array de QRs) --- */}
//             {qrBatchData && Array.isArray( qrBatchData ) && qrBatchData.length > 0 ? (
//               <div className="flex flex-wrap gap-6 justify-center max-h-[60vh] overflow-y-auto p-4 border-2 border-blue-100 rounded-xl bg-blue-50 w-full">
//                 {qrBatchData.map( ( qr, idx ) => (
//                   <div key={idx} className="w-full max-w-[280px] bg-white p-4 rounded-xl shadow-lg border border-gray-200">
//                     <MyQRCodeComponent qrData={qr} isBatchItem={true} />
//                   </div>
//                 ) )}
//               </div>
//             ) : (
//               /* --- VISUALIZACIÓN INDIVIDUAL (QR Único) --- */
//               <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-2xl border border-blue-200">
//                 <MyQRCodeComponent qrData={qrData} isBatchItem={false} />
//               </div>
//             )}

//             <p className="text-center text-gray-700 text-base md:text-lg mt-6 font-medium p-2 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
//               Cada empleado tendrá su código QR en su perfil para su consumo.
//             </p>
//           </>
//         )}
//       </div>

//       <div className="mt-8 flex justify-center">
//         <button
//           onClick={handleCloseOrder}
//           className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-xl transition-colors text-lg"
//         >
//           Finalizar y Volver
//         </button>
//       </div>

//     </div>
//   );
// };





// import {useEffect} from 'react'
// import {MyQRCodeComponent} from '../components/MyQRCodeComponent'
// import {useTicketLunchStore} from '../store/ticketLunchStore'
// import {useBuildDataToQR} from '../hooks/useBuildDataToQR';

// export const Tickets = () => {
//   const qrData = useTicketLunchStore( ( state ) => state.qrData );
//   const qrBatchData = useTicketLunchStore( ( state ) => state.qrBatchData );
//   const {builderDataQR} = useBuildDataToQR();
//   const orderData = useTicketLunchStore( state => state.orderData );
//   const selectedEmpleadosSummary = useTicketLunchStore( state => state.selectedEmpleadosSummary );
//   const orderOrigin = useTicketLunchStore( state => state.orderOrigin );
//   const referenceNumber = useTicketLunchStore( state => state.referenceNumber );

//   useEffect( () => {
//     // Reconstruir el QR siempre que cambie la orden o la selección
//     builderDataQR();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [ orderData, selectedEmpleadosSummary, orderOrigin, referenceNumber ] );

//   const handleCloseOrder = () => {
//     console.log( "FINALIZANDO ORDER" );
//   }

//   // El estado de carga se deriva directamente de la presencia de datos.
//   const isLoading = !qrData && ( !qrBatchData || qrBatchData.length === 0 );
//   return (
//     <div className="w-full h-full max-h-screen overflow-y-auto flex flex-col border-0">
//       <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-tight drop-shadow">Generar Ticket QR</h2>
//       <div className="w-full flex flex-col border-0">
//         {isLoading ? (
//           <div className="flex flex-col items-center justify-center py-12 border-2">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mb-4"></div>
//             <p className="text-blue-700 text-lg font-semibold">Generando ticket, espera la respuesta...</p>
//           </div>
//         ) : (
//           <>
//             {qrBatchData && Array.isArray( qrBatchData ) && qrBatchData.length > 0 ? (
//               <div className="flex flex-wrap gap-8 justify-center border-2">
//                 {qrBatchData.map( ( qr, idx ) => (
//                   <div key={idx} className="w-full md:w-auto border-2">
//                     <MyQRCodeComponent qrData={qr} />
//                   </div>
//                 ) )}
//               </div>
//             ) : (
//               <MyQRCodeComponent qrData={qrData} />
//             )}

//             <p className="text-center text-gray-700 dark:text-amber-50 text-base md:text-lg mt-2">Cada empleado tendra su QR en su perfil</p>
//           </>
//         )}
//       </div>
//       <button
//         className="self-center mt-auto px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs shadow"
//         onClick={handleCloseOrder}
//       >
//         Finalizar Pedido
//       </button>
//     </div>
//   );
// };
