import {QRCode} from 'react-qrcode-logo';
import JSZip from 'jszip';
import QRCodeGen from 'qrcode';
import {saveAs} from 'file-saver';
// 💡 Importar la función centralizada
import {formatQRText} from '../hooks/useTicketQR'; // ¡Ajusta la ruta si es necesario!

// La función formatQRText ya no se define aquí, se importa.

// Función auxiliar para generar un Blob (imagen PNG) de un QR individual.
const generateQRImage = ( qr ) => {
  return new Promise( ( resolve, reject ) => {
    // 💡 Usamos la función importada
    const text = formatQRText( qr );
    QRCodeGen.toDataURL( text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      scale: 8,
    }, ( err, url ) => {
      if ( err ) {
        console.error( "Error generating QR code:", err );
        return reject( err );
      }
      fetch( url )
        .then( res => res.blob() )
        .then( resolve )
        .catch( reject );
    } );
  } );
};


export function MyQRCodeComponent( {qrData, isBatchItem = false} ) {

  const logoUrl = "/MercalMarker.png";

  // ----------------------------------------------------
  // --- FLUJO DE LOTE: RENDERIZA EL BOTÓN DE DESCARGA ---
  // ----------------------------------------------------
  if ( Array.isArray( qrData ) ) {
    return (
      <div className="w-full flex justify-center my-4">
        <button
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 text-base font-bold shadow-lg transition-colors"
          onClick={async () => {
            const zip = new JSZip();
            try {
              // ... (Lógica de descarga ZIP se mantiene igual)
              for ( let i = 0; i < qrData.length; i++ ) {
                const qr = qrData[ i ];
                const blob = await generateQRImage( qr );
                const empleados = Array.isArray( qr.empleados ) ? qr.empleados : [];

                const nombresArchivo = empleados[ 0 ]
                  ? `${ empleados[ 0 ].cedula }_${ empleados[ 0 ].fullName.replace( /\s/g, '_' ) }`
                  : `ticket_lote_${ i + 1 }`;

                zip.file( `${ nombresArchivo }_QR.png`, blob );
              }
              const content = await zip.generateAsync( {type: 'blob'} );
              saveAs( content, 'QR_Tickets_Lote.zip' );
            } catch ( error ) {
              console.error( "Error al generar el ZIP:", error );
              alert( "Error al generar la descarga. Revise la consola." );
            }
          }}
        >
          Descargar {qrData.length} Tickets QR (ZIP)
        </button>
      </div>
    );
  }

  // Si qrData no es un objeto válido, muestra un mensaje.
  if ( !qrData || typeof qrData !== 'object' ) {

    return (
      <div className="text-center p-8 text-gray-500 bg-red-50 border border-red-200 rounded-lg">
        No hay datos válidos para generar el Código QR.
      </div>
    );
  }

  // console.log( qrData.orderID );
  // ----------------------------------------------------
  // --- FLUJO INDIVIDUAL: RENDERIZA EL QR ---
  // ----------------------------------------------------
  const empleados = Array.isArray( qrData.empleados ) ? qrData.empleados : [];
  const empleado = empleados[ 0 ] || {};
  const total = Number( qrData.total || 0 ).toFixed( 2 );

  return (
    <div className="flex flex-col items-center p-3 text-center">
      {/* Detalle del empleado */}
      <div className={`mb-3 w-full p-2 rounded-lg ${ isBatchItem ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200' }`}>
        <p>
          <strong>ORDEN: {qrData.orderID}</strong>
        </p>
        {/* <div className="text-sm font-semibold text-gray-700">
          {isBatchItem ? 'Ticket Individual para:' : 'Ticket para:'}
        </div> */}
        <b className="text-base text-blue-800">
          {empleado.fullName} (C.I: {empleado.cedula})
        </b>
      </div>

      {/* Código QR */}
      <div className="p-1 bg-white rounded-xl shadow-xl border-4 border-gray-100">
        <QRCode
          value={formatQRText( qrData )} // Usamos la función importada
          size={200}
          ecLevel="H"
          qrStyle="dots"
          logoImage={logoUrl}
          logoWidth={50}
          logoHeight={50}
          logoOpacity={1}
          logoPadding={2}
          logoPaddingStyle="square"
        />
      </div>


      {/* Información Adicional */}
      <div className="mt-4 text-center text-sm text-gray-700 w-full">
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
          <div>Referencia: <b>{String( qrData.referencia ?? 'N/A' )}</b></div>
          <div className="text-lg font-bold text-green-700 mt-1">
            Total Pagado: Bs. {total}
          </div>
        </div>

        {/* Autorizado (Si se encuentra en el objeto del QR o del backend) */}
        {( empleado.autorizado || ( qrData.authorized_person && qrData.authorized === 'yes' ) ) && (
          <div className="text-sm text-blue-700 mt-2 p-1 border-t">
            Autorizado: <b>{empleado.autorizado || qrData.authorized_person}</b>
          </div>
        )}
      </div>
    </div>
  );
}





////////*************************************************** */
// import {QRCode} from 'react-qrcode-logo';
// import JSZip from 'jszip';
// import QRCodeGen from 'qrcode';
// import {saveAs} from 'file-saver';

// // 💡 FUNCIÓN MODIFICADA: Ahora genera un string de texto plano individual
// const formatQRText = ( data ) => {
//   if ( !data ) return 'Error: Sin datos';

//   // 1. Extraer los datos singulares del empleado (asumiendo que data.empleados[0] existe)
//   const empleado = Array.isArray( data.empleados ) ? data.empleados[ 0 ] : {};

//   const cedula = empleado.cedula || 'N/A';
//   // Asumimos que fullName está disponible o lo construimos
//   const fullName = empleado.fullName || `${ empleado.first_name || '' } ${ empleado.last_name || '' }`.trim() || 'Empleado Desconocido';
//   const total = Number( data.total || 0 ).toFixed( 2 );

//   // 2. Determinar el estado de Autorización
//   // Se usa 'autorizado' del objeto del hook, que puede ser la persona (String) o null
//   const autorizadoText = empleado.autorizado
//     ? `SI (${ empleado.autorizado })`
//     : ( data.authorized === 'yes' ? `SI (${ data.authorized_person || 'N/A' })` : 'NO' );

//   // 3. Generar una cadena de texto simple con saltos de línea (\n)
//   return [
//     `Ticket QR - Almuerzo`,
//     `--------------------------`,
//     `Orden: ${ data.orderID || 'N/A' }`,
//     `Referencia: ${ data.referencia || 'N/A' }`,
//     `Total Bs: ${ total }`,
//     `--------------------------`,
//     `Empleado: ${ fullName }`,
//     `C.I.: ${ cedula }`,
//     `Autorizado: ${ autorizadoText }`,
//   ].join( '\n' );
// };

// // Función auxiliar para generar un Blob (imagen PNG) de un QR individual.
// const generateQRImage = ( qr ) => {
//   return new Promise( ( resolve, reject ) => {
//     const text = formatQRText( qr );
//     QRCodeGen.toDataURL( text, {
//       errorCorrectionLevel: 'H',
//       type: 'image/png',
//       margin: 1,
//       scale: 8,
//     }, ( err, url ) => {
//       if ( err ) {
//         console.error( "Error generating QR code:", err );
//         return reject( err );
//       }
//       fetch( url )
//         .then( res => res.blob() )
//         .then( resolve )
//         .catch( reject );
//     } );
//   } );
// };


// export function MyQRCodeComponent( {qrData, isBatchItem = false} ) {

//   const logoUrl = "/MercalMarker.png";

//   // ----------------------------------------------------
//   // --- FLUJO DE LOTE: RENDERIZA EL BOTÓN DE DESCARGA ---
//   // ----------------------------------------------------
//   if ( Array.isArray( qrData ) ) {
//     return (
//       <div className="w-full flex justify-center my-4">
//         <button
//           className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 text-base font-bold shadow-lg transition-colors"
//           onClick={async () => {
//             const zip = new JSZip();
//             try {
//               for ( let i = 0; i < qrData.length; i++ ) {
//                 const qr = qrData[ i ];
//                 const blob = await generateQRImage( qr );
//                 const empleados = Array.isArray( qr.empleados ) ? qr.empleados : [];

//                 const nombresArchivo = empleados[ 0 ]
//                   ? `${ empleados[ 0 ].cedula }_${ empleados[ 0 ].fullName.replace( /\s/g, '_' ) }`
//                   : `ticket_lote_${ i + 1 }`;

//                 zip.file( `${ nombresArchivo }_QR.png`, blob );
//               }
//               const content = await zip.generateAsync( {type: 'blob'} );
//               saveAs( content, 'QR_Tickets_Lote.zip' );
//             } catch ( error ) {
//               console.error( "Error al generar el ZIP:", error );
//               alert( "Error al generar la descarga. Revise la consola." );
//             }
//           }}
//         >
//           Descargar {qrData.length} Tickets QR (ZIP)
//         </button>
//       </div>
//     );
//   }

//   // Si qrData no es un objeto válido, muestra un mensaje.
//   if ( !qrData || typeof qrData !== 'object' ) {
//     return (
//       <div className="text-center p-8 text-gray-500 bg-red-50 border border-red-200 rounded-lg">
//         No hay datos válidos para generar el Código QR.
//       </div>
//     );
//   }

//   // ----------------------------------------------------
//   // --- FLUJO INDIVIDUAL: RENDERIZA EL QR ---
//   // ----------------------------------------------------
//   const empleados = Array.isArray( qrData.empleados ) ? qrData.empleados : [];
//   const empleado = empleados[ 0 ] || {}; // Solo necesitamos el primero para la data

//   return (
//     <div className="flex flex-col items-center p-3 text-center">
//       {/* Detalle del empleado */}
//       <div className={`mb-3 w-full p-2 rounded-lg ${ isBatchItem ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200' }`}>
//         <div className="text-sm font-semibold text-gray-700">
//           {isBatchItem ? 'Ticket Individual para:' : 'Ticket para:'}
//         </div>
//         <b className="text-base text-blue-800">
//           {empleado.fullName} (C.I: {empleado.cedula})
//         </b>
//       </div>

//       {/* Código QR */}
//       <div className="p-1 bg-white rounded-xl shadow-xl border-4 border-gray-100">
//         <QRCode
//           value={formatQRText( qrData )}
//           size={200}
//           ecLevel="H"
//           qrStyle="dots"
//           logoImage={logoUrl}
//           logoWidth={50}
//           logoHeight={50}
//           logoOpacity={1}
//           logoPadding={2}
//           logoPaddingStyle="square"
//         />
//       </div>


//       {/* Información Adicional */}
//       <div className="mt-4 text-center text-sm text-gray-700 w-full">
//         <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
//           <div>Referencia: <b>{String( qrData.referencia ?? 'N/A' )}</b></div>
//           <div className="text-lg font-bold text-green-700 mt-1">
//             Total Pagado: Bs. {Number( qrData.total || 0 ).toFixed( 2 )}
//           </div>
//         </div>

//         {/* Autorizado (si aplica) */}
//         {empleado.autorizado && (
//           <div className="text-sm text-blue-700 mt-2 p-1 border-t">
//             Autorizado por: <b>{empleado.autorizado}</b>
//           </div>
//         )}
//         {/* Si el campo autorizado_person está en el objeto de la respuesta, podríamos usarlo aquí */}
//         {qrData.authorized_person && qrData.authorized === 'yes' && (
//           <div className="text-sm text-blue-700 mt-2 p-1 border-t">
//             Autorizado: <b>{qrData.authorized_person}</b>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




//************************************************************************** */
// import {QRCode} from 'react-qrcode-logo';
// import JSZip from 'jszip';
// import QRCodeGen from 'qrcode';
// import {saveAs} from 'file-saver';
// // 💡 Ya no es necesario importar Swal si lo omitimos

// // 💡 FUNCIÓN MODIFICADA: Ahora genera un string de texto plano formateado
// const formatQRText = ( data ) => {
//   if ( !data ) return 'Error: Sin datos';

//   const cedulas = Array.isArray( data.empleados ) ? data.empleados.map( e => e.cedula ).join( ', ' ) : 'N/A';
//   const total = Number( data.total || 0 ).toFixed( 2 );

//   // Generamos una cadena de texto simple con saltos de línea (\n)
//   return [
//     `Orden: ${ data.orderID || 'N/A' }`,
//     `Ref: ${ data.referencia || 'N/A' }`,
//     `Total Bs: ${ total }`,
//     `Cédulas: ${ cedulas }`,
//     // Opcionalmente, puedes añadir más campos aquí
//   ].join( '\n' );
// };

// // Función auxiliar para generar un Blob (imagen PNG) de un QR individual.
// const generateQRImage = ( qr ) => {
//   return new Promise( ( resolve, reject ) => {
//     const text = formatQRText( qr );
//     QRCodeGen.toDataURL( text, {
//       errorCorrectionLevel: 'H', // Mantenemos el nivel de corrección alto
//       type: 'image/png',
//       margin: 1,
//       scale: 8,
//     }, ( err, url ) => {
//       if ( err ) {
//         console.error( "Error generating QR code:", err );
//         return reject( err );
//       }
//       fetch( url )
//         .then( res => res.blob() )
//         .then( resolve )
//         .catch( reject );
//     } );
//   } );
// };


// export function MyQRCodeComponent( {qrData, isBatchItem = false} ) {

//   const logoUrl = "/MercalMarker.png";

//   // ----------------------------------------------------
//   // --- FLUJO DE LOTE: RENDERIZA EL BOTÓN DE DESCARGA ---
//   // ----------------------------------------------------
//   if ( Array.isArray( qrData ) ) {
//     return (
//       <div className="w-full flex justify-center my-4">
//         <button
//           className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 text-base font-bold shadow-lg transition-colors"
//           onClick={async () => {
//             const zip = new JSZip();
//             try {
//               for ( let i = 0; i < qrData.length; i++ ) {
//                 const qr = qrData[ i ];
//                 const blob = await generateQRImage( qr );
//                 const empleados = Array.isArray( qr.empleados ) ? qr.empleados : [];

//                 const nombresArchivo = empleados[ 0 ]
//                   ? `${ empleados[ 0 ].cedula }_${ empleados[ 0 ].fullName.replace( /\s/g, '_' ) }`
//                   : `ticket_lote_${ i + 1 }`;

//                 zip.file( `${ nombresArchivo }_QR.png`, blob );
//               }
//               const content = await zip.generateAsync( {type: 'blob'} );
//               saveAs( content, 'QR_Tickets_Lote.zip' );
//             } catch ( error ) {
//               console.error( "Error al generar el ZIP:", error );
//               alert( "Error al generar la descarga. Revise la consola." );
//             }
//           }}
//         >
//           Descargar {qrData.length} Tickets QR (ZIP)
//         </button>
//       </div>
//     );
//   }

//   // Si qrData no es un objeto válido, muestra un mensaje.
//   if ( !qrData || typeof qrData !== 'object' ) {
//     return (
//       <div className="text-center p-8 text-gray-500 bg-red-50 border border-red-200 rounded-lg">
//         No hay datos válidos para generar el Código QR.
//       </div>
//     );
//   }

//   // ----------------------------------------------------
//   // --- FLUJO INDIVIDUAL: RENDERIZA EL QR ---
//   // ----------------------------------------------------
//   const empleados = Array.isArray( qrData.empleados ) ? qrData.empleados : [];

//   return (
//     <div className="flex flex-col items-center p-3 text-center">
//       {/* Detalle del empleado */}
//       <div className={`mb-3 w-full p-2 rounded-lg ${ isBatchItem ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200' }`}>
//         <div className="text-sm font-semibold text-gray-700">
//           {isBatchItem ? 'Ticket Individual' : 'Ticket para:'}
//         </div>
//         <b className="text-base text-blue-800">
//           {empleados.length === 1
//             ? `${ empleados[ 0 ].fullName } (C.I: ${ empleados[ 0 ].cedula })`
//             : empleados.map( e => `${ e.fullName } (C.I: ${ e.cedula })` ).join( ', ' ) || 'Empleado Desconocido'}
//         </b>
//       </div>

//       {/* Código QR */}
//       <div className="p-1 bg-white rounded-xl shadow-xl border-4 border-gray-100">
//         <QRCode
//           value={formatQRText( qrData )} // Usamos el nuevo formato de texto plano
//           size={200} // Optimizaciones de robustez
//           ecLevel="H" // Optimizaciones de robustez
//           qrStyle="dots"
//           logoImage={logoUrl}
//           logoWidth={50} // Optimizaciones de robustez
//           logoHeight={50} // Optimizaciones de robustez
//           logoOpacity={1}
//           logoPadding={2}
//           logoPaddingStyle="square"
//         />
//       </div>


//       {/* Información Adicional */}
//       <div className="mt-4 text-center text-sm text-gray-700 w-full">
//         <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
//           <div>Referencia: <b>{String( qrData.referencia ?? 'N/A' )}</b></div>
//           <div className="text-lg font-bold text-green-700 mt-1">
//             Total Pagado: Bs. {Number( qrData.total || 0 ).toFixed( 2 )}
//           </div>
//         </div>

//         {/* Autorizado (si aplica) */}
//         {empleados.some( e => e.autorizado ) && (
//           <div className="text-sm text-blue-700 mt-2 p-1 border-t">
//             Autorizado: <b>{empleados.filter( e => e.autorizado ).map( e => e.autorizado ).join( ', ' )}</b>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// ******************************************************************






// import {QRCode} from 'react-qrcode-logo';
// import JSZip from 'jszip';
// import QRCodeGen from 'qrcode';
// import {saveAs} from 'file-saver';

// export function MyQRCodeComponent( {qrData} ) {

//   // console.log( {qrData} );

//   const logoUrl = "/MercalMarker.png";

//   // Si recibe un array, renderizar múltiples QR
//   if ( Array.isArray( qrData ) ) {
//     return (
//       <div className="overflow-y-auto w-full">
//         <div className="w-full flex justify-end mb-4">
//           <button
//             className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm shadow"
//             onClick={async () => {
//               const zip = new JSZip();
//               for ( let i = 0; i < qrData.length; i++ ) {
//                 const qr = qrData[ i ];
//                 const blob = await generateQRImage( qr );
//                 const empleados = Array.isArray( qr.empleados ) ? qr.empleados : [];
//                 const nombresArchivo = empleados.map( e => e.fullName ).join( '_' ) || `ticket_${ i + 1 }`;
//                 zip.file( `${ nombresArchivo }_QR.png`, blob );
//               }
//               const content = await zip.generateAsync( {type: 'blob'} );
//               saveAs( content, 'QR_Tickets_Lote.zip' );
//             }}
//           >
//             Exportar todos los QR en ZIP
//           </button>
//         </div>
//         <div className="flex flex-wrap gap-8 justify-center">
//           {qrData.map( ( qr, idx ) => (
//             <div key={idx} className="w-full md:w-auto">
//               <MyQRCodeComponent qrData={qr} />
//             </div>
//           ) )}
//         </div>
//       </div>
//     );
//   }

//   if ( !qrData ) {
//     return (
//       <div className="text-center p-6">
//         <p>Genera tu ticket para ver el QR.</p>
//       </div>
//     );
//   }

//   // Función para generar un canvas con el texto y el QR usando datos del backend
//   const generateQRImage = async ( qrData ) => {
//     const qrSize = 150;
//     const margin = 20;
//     // Mostrar todos los empleados
//     const empleados = Array.isArray( qrData.empleados ) ? qrData.empleados : [];
//     const total = qrData.total || 0;
//   const orderIdStr = String(qrData.orderID ?? '');
//   let text = `OrdenID: ${ orderIdStr }\n`;
//     if ( Array.isArray( empleados ) ) {
//       empleados.forEach( emp => {
//         text += `Nombre y Apellido: ${ emp.fullName }\n`;
//         text += `Cédula: ${ emp.cedula }\n`;
//         if ( emp.autorizado ) text += `Autorizado: ${ emp.autorizado }\n`;
//       } );
//     }
//     text += `Total Pagado: Bs. ${ Number( total ).toFixed( 2 ) }\n`;
//   if ( qrData.referencia ) text += `Referencia: ${ String(qrData.referencia) }\n`;

//     // Crear canvas temporal para medir el texto
//     // Calcular el ancho máximo del texto
//     const tempCanvas = document.createElement( 'canvas' );
//     const tempCtx = tempCanvas.getContext( '2d' );
//     tempCtx.font = 'bold 18px Arial';
//     const textLines = text.split( '\n' ).filter( Boolean );
//     const lineHeight = 22;
//     tempCtx.font = 'bold 18px Arial';
//     let maxTextWidth = 0;
//     textLines.forEach( line => {
//       const w = tempCtx.measureText( line ).width;
//       if ( w > maxTextWidth ) maxTextWidth = w;
//     } );
//     const canvasWidth = Math.max( qrSize, maxTextWidth ) + margin * 2;
//     const canvasHeight = margin + ( textLines.length * lineHeight ) + margin + qrSize + margin;
//     const canvas = document.createElement( 'canvas' );
//     canvas.width = canvasWidth;
//     canvas.height = canvasHeight;
//     const ctx = canvas.getContext( '2d' );

//     ctx.fillStyle = '#FFFFFF';
//     ctx.fillRect( 0, 0, canvas.width, canvas.height );

//     ctx.fillStyle = '#000000';
//     ctx.font = 'bold 18px Arial';
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'top';
//     textLines.forEach( ( line, idx ) => {
//       ctx.fillText( line, canvas.width / 2, margin + idx * lineHeight );
//     } );

//     const y = margin + ( textLines.length * lineHeight ) + margin;

//     // Valor del QR: serializa el objeto completo
//     const qrValue = formatQRText( qrData );
//     const qrCanvas = document.createElement( 'canvas' );
//     await QRCodeGen.toCanvas( qrCanvas, qrValue, {
//       width: qrSize,
//       margin: 2,
//     } );

//     const qrX = ( canvas.width - qrSize ) / 2;
//     const qrY = y + margin;
//     ctx.drawImage( qrCanvas, qrX, qrY, qrSize, qrSize );

//     return new Promise( ( resolve ) => canvas.toBlob( resolve, 'image/png' ) );
//   };

//   // Descargar el QR generado como imagen (solo el order del backend)
//   const handleDownloadQR = async () => {
//     if ( qrData ) {
//       const blob = await generateQRImage( qrData );
//       const empleados = Array.isArray( qrData.empleados ) ? qrData.empleados : [];
//       const nombresArchivo = empleados.map( e => e.fullName ).join( '_' ) || 'ticket';
//       saveAs( blob, `${ nombresArchivo }_QR.png` );
//     }
//   };

//   const formatQRText = ( qrData ) => {
//     const orderId = String(qrData.orderID ?? '');
//     const referencia = String(qrData.referencia ?? '');
//     let text = `Orden: ${ orderId }\nReferencia: ${ referencia }\n`;
//     if ( Array.isArray( qrData.empleados ) ) {
//       qrData.empleados.forEach( ( emp, idx ) => {
//         const name = String(emp.fullName ?? '');
//         const ci = String(emp.cedula ?? '');
//         text += `Empleado ${ idx + 1 }: ${ name } (C.I: ${ ci })\n`;
//         if ( emp.autorizado ) text += `Autorizado: ${ String(emp.autorizado) }\n`;
//       } );
//     }
//     text += `Total: Bs. ${ Number( qrData.total || 0 ).toFixed( 2 ) }\n`;
//     if ( qrData.id_order_status ) {
//       text += `id_order_status: ${ qrData.id_order_status }\n`;
//     }
//     if ( qrData.id_orders_consumption ) {
//       text += `id_orders_consumption: ${ qrData.id_orders_consumption }\n`;
//     }
//     return text;
//   };

//   return (
//     <div className="overflow-y-auto w-full border-0">
//       {/* <div className="w-full flex justify-end mb-4 border-2">
//       </div> */}
//       <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-xl mx-auto my-8 border-0">
//   <div><b>Orden: {String(qrData.orderID ?? '')}</b></div>
//         <div>
//           <b>
//             {Array.isArray( qrData.empleados )
//               ? qrData.empleados.map( e => `${ e.fullName } (C.I: ${ e.cedula })` ).join( ', ' )
//               : ''}
//           </b>
//         </div>
//         <QRCode
//           value={formatQRText( qrData )}
//           size={150}
//           ecLevel="M"
//           qrStyle="dots"
//           logoImage={logoUrl}
//           logoWidth={80}
//           logoHeight={80}
//           logoOpacity={1}
//           logoPadding={0}
//           logoPaddingStyle="circle"
//         />
//         <div className="mt-2 text-center text-xs text-gray-700">
//           <div><b>Referencia: {String(qrData.referencia ?? '')}</b></div>
//           <div>Total Pagado: <b>Bs. {Number( qrData.total || 0 ).toFixed( 2 )}</b></div>
//           {qrData.id_order_status && (
//             <div>ID Estado: <b>{qrData.id_order_status}</b></div>
//           )}
//           {qrData.id_orders_consumption && (
//             <div>ID Consumo: <b>{qrData.id_orders_consumption}</b></div>
//           )}
//           {Array.isArray( qrData.empleados ) && qrData.empleados.some( e => e.autorizado ) && (
//             <div className="text-blue-700">
//               Autorizado: {qrData.empleados.filter( e => e.autorizado ).map( e => e.autorizado ).join( ', ' )}
//             </div>
//           )}
//         </div>
//         <h1>Fecha: {new Date().toLocaleDateString()}</h1>
//         <button
//           className="mt-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs shadow"
//           onClick={handleDownloadQR}
//         >
//           Descargar QR
//         </button>
//       </div>
//     </div>
//   );
// }