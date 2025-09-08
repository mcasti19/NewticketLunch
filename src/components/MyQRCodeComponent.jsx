import React, {useEffect} from 'react';
import {QRCode} from 'react-qrcode-logo';
import JSZip from 'jszip';
import QRCodeGen from 'qrcode';
import {saveAs} from 'file-saver';
import {useTicketLunchStore} from '../store/ticketLunchStore';

export function MyQRCodeComponent() {
  // Descargar individualmente el QR generado como imagen
  const handleDownloadQR = async (empleado, id) => {
    const blob = await generateQRImage(empleado, id);
    const nombreArchivo = `${empleado.nombre}_QR.png`;
    saveAs(blob, nombreArchivo);
  };
  const qrRefs = React.useRef( [] );
  const empleados = useTicketLunchStore( state => state.selectedEmpleadosSummary );
  const logoUrl = "/MercalMarker.png"; // Logo path

  // Si no hay empleados, no renderizamos nada más
  if ( !empleados || empleados.length === 0 ) {
    return (
      <div className="text-center p-6">
        <p>No hay empleados seleccionados para generar QR.</p>
      </div>
    );
  }

  useEffect( () => {
    console.log( "EMPLEADOS:", empleados );

  }, [] )


  // Función para generar un canvas con el texto y el QR
  const generateQRImage = async (empleado, id) => {
    const qrSize = 150; // Tamaño del QR
    const margin = 20; // Margen alrededor
    const text = `${empleado.nombre}`;
    // Crear canvas temporal para medir el texto
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = 'bold 18px Arial';
    const textMetrics = tempCtx.measureText(text);
    const textHeight = 22; // Aproximado para 18px Arial (no hay height exacto en measureText)
    const textWidth = textMetrics.width;

    // El ancho del canvas será el mayor entre el QR y el texto, más márgenes
    const canvasWidth = Math.max(qrSize, textWidth) + margin * 2;
    // El alto será margen + texto + margen + QR + margen
    const canvasHeight = margin + textHeight + margin + qrSize + margin;
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    // Fondo blanco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto: centrado horizontalmente
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(text, canvas.width / 2, margin);

    // Valor del QR: URL a la página del ticket
    const url = `${window.location.origin}/ticket/${id}`;

    // Generar el QR en un canvas aparte
    const qrCanvas = document.createElement('canvas');
    await QRCodeGen.toCanvas(qrCanvas, url, {
      width: qrSize,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Calcular posición centrada para el QR
    const qrX = (canvas.width - qrSize) / 2;
    const qrY = margin + textHeight + margin;
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // Devuelve la imagen como un blob
    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  };

  // Exportar todos los QR como PNG en un ZIP
  const handleExportZip = async () => {
    const zip = new JSZip();
    for (let i = 0; i < empleados.length; i++) {
      const empleado = empleados[i];
      const blob = await generateQRImage(empleado, i + 1);
      const nombreArchivo = `${empleado.nombre}_QR.png`;
      zip.file(nombreArchivo, blob);
    }
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'QR_Empleados.zip');
  };

  // // Función para compartir por correo
  // const getMailToLink = (text, empleado) => {
  //   const subject = `QR Ticket de Almuerzo - ${empleado.nombre} ${empleado.apellido}`;
  //   const body = `Este es tu código QR en formato texto:\n\n${text}`;
  //   return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  // };

  return (
    <div className='overflow-y-auto w-full'>
      <div className="w-full flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm shadow"
          onClick={handleExportZip}
        >
          Exportar todos los QR en ZIP
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6  rounded-lg shadow-xl max-w-7xl mx-auto my-8 border-0">
        {empleados.map((empleado, index) => {
          // Demo: el id será index+1 (debe coincidir con el de TicketPage.jsx)
          const id = (index + 1).toString();
          const url = `${window.location.origin}/ticket/${id}`;
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center  p-4 rounded shadow"
              ref={el => qrRefs.current[index] = el}
            >
              <QRCode
                value={url}
                size={150}
                ecLevel="H"
                qrStyle="squares"
                fgColor="#000000"
                bgColor="#FFFFFF"
                logoImage={logoUrl}
                logoWidth={20}
                logoHeight={20}
                logoOpacity={1}
                logoPadding={5}
                logoPaddingStyle="square"
              />
              <button
                className="mt-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs shadow"
                onClick={() => handleDownloadQR(empleado, id)}
              >
                Descargar QR
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}




// import React from 'react';
// import { QRCode } from 'react-qrcode-logo';
// import JSZip from 'jszip';
// import QRCodeGen from 'qrcode';
// import { saveAs } from 'file-saver';
// import { useTicketLunchStore } from '../store/ticketLunchStore';

// export function MyQRCodeComponent() {
//   // Ref para los QR
//   const qrRefs = React.useRef([]);

//   const empleados = useTicketLunchStore(state => state.selectedEmpleadosSummary);
//   const logoUrl = "/MercalMarker.png"; // Logo path

//   if (!empleados || empleados.length === 0) {
//     return (
//       <div className="text-center p-6">
//         <p>No hay empleados seleccionados para generar QR.</p>
//       </div>
//     );
//   }

//   // // Función para copiar al portapapeles
//   // const handleCopy = (text) => {
//   //   if (navigator.clipboard) {
//   //     navigator.clipboard.writeText(text);
//   //   }
//   // };

//   // // Función para compartir por WhatsApp
//   // const getWhatsAppLink = (text) => {
//   //   return `https://wa.me/?text=${encodeURIComponent(text)}`;
//   // };

//   // Función para compartir por correo
//   const getMailToLink = (text, empleado) => {
//     const subject = `QR Ticket de Almuerzo - ${empleado.nombre} ${empleado.apellido}`;
//     const body = `Este es tu código QR en formato texto:\n\n${text}`;
//     return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
//   };

//   // Exportar todos los QR como PNG en un ZIP
//   const handleExportZip = async () => {
//     const zip = new JSZip();
//     for (let i = 0; i < empleados.length; i++) {
//       const empleado = empleados[i];
//       const qrValue = JSON.stringify({
//         nombre: empleado.nombre,
//         apellido: empleado.apellido,
//         almuerzoParaLlevar: empleado.para_llevar,
//         cubiertos: empleado.cubiertos,
//         autorizado: empleado.autorizado,
//       });
//       // Generar PNG usando qrcode
//       const pngData = await QRCodeGen.toDataURL(qrValue, { width: 150, margin: 2 });
//       const nombreArchivo = `${empleado.nombre}_${empleado.apellido}_QR.png`;
//       zip.file(nombreArchivo, pngData.split(',')[1], { base64: true });
//     }
//     const content = await zip.generateAsync({ type: 'blob' });
//     saveAs(content, 'QR_Empleados.zip');
//   };

//   return (
//     <div className='overflow-y-auto w-full'>
//       <div className="w-full flex justify-end mb-4">
//         <button
//           className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm shadow"
//           onClick={handleExportZip}
//         >
//           Exportar todos los QR en ZIP
//         </button>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6  rounded-lg shadow-xl max-w-7xl mx-auto my-8 border-0">
//         {empleados.map((empleado, index) => {
//           const qrValue = JSON.stringify({
//             nombre: empleado.nombre,
//             apellido: empleado.apellido,
//             almuerzoParaLlevar: empleado.para_llevar,
//             cubiertos: empleado.cubiertos,
//             autorizado: empleado.autorizado,
//           });
//           return (
//             <div
//               key={index}
//               className="flex flex-col items-center justify-center  p-4 rounded shadow"
//               ref={el => qrRefs.current[index] = el}
//             >
//               <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-amber-50">{empleado.nombre} {empleado.apellido}</h3>
//               <QRCode
//                 value={qrValue}
//                 size={150}
//                 ecLevel="H"
//                 qrStyle="squares"
//                 fgColor="#000000"
//                 bgColor="#FFFFFF"
//                 logoImage={logoUrl}
//                 logoWidth={20}
//                 logoHeight={20}
//                 logoOpacity={1}
//                 logoPadding={5}
//                 logoPaddingStyle="square"
//               />
//               {/* <div className="mt-3 flex flex-col gap-2 w-full items-center">
//                 <button
//                   className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs shadow"
//                   onClick={() => handleCopy(qrValue)}
//                 >
//                   Copiar texto QR
//                 </button>
//                 <a
//                   href={getWhatsAppLink(qrValue)}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs shadow text-center"
//                 >
//                   Compartir por WhatsApp
//                 </a>
//                 <a
//                   href={getMailToLink(qrValue, empleado)}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs shadow text-center"
//                 >
//                   Compartir por correo
//                 </a>
//               </div> */}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
