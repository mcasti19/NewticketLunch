import React, {useEffect} from 'react';
import {QRCode} from 'react-qrcode-logo';
import JSZip from 'jszip';
import QRCodeGen from 'qrcode';
import {saveAs} from 'file-saver';
import {useTicketLunchStore} from '../store/ticketLunchStore';

export function MyQRCodeComponent() {
  // Acceso al objeto orderData recibido del backend
  const orderData = useTicketLunchStore( state => state.orderData );
  const empleados = useTicketLunchStore( state => state.selectedEmpleadosSummary );
  const qrRefs = React.useRef( [] );
  const logoUrl = "/MercalMarker.png";
  const domain = "http://192.168.1.9:5173";

  useEffect( () => {
    if (orderData) {
      console.log("ORDER DATA PARA QR:", orderData);
    }
  }, [orderData]);

  // Si no hay datos de la orden, mostrar mensaje
  if (!orderData) {
    return (
      <div className="text-center p-6">
        <p>Genera tu ticket para ver el QR.</p>
      </div>
    );
  }




  // Función para generar un canvas con el texto y el QR usando datos del backend
  const generateQRImage = async ( order, id ) => {
    const qrSize = 150;
    const margin = 20;
    // Texto principal: nombre y total
    const nombre = order.nombre || order.name_employee || '';
    const total = order.total_amount || order.total_pagar || 0;
    let text = `${nombre} - Bs. ${Number(total).toFixed(2)}`;
    // Info de autorización
    let infoAutorizacion = '';
    if (order.autoriza_a) {
      infoAutorizacion = `Autoriza a: ${order.autoriza_a}`;
    } else if (order.autorizado_por || order.authorized_person) {
      infoAutorizacion = `Autorizado por: ${order.autorizado_por || order.authorized_person}`;
    }

    // Crear canvas temporal para medir el texto
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = 'bold 18px Arial';
    const textMetrics = tempCtx.measureText(text);
    const textHeight = 22;
    const textWidth = textMetrics.width;
    const infoMetrics = tempCtx.measureText(infoAutorizacion);
    const infoHeight = infoAutorizacion ? 18 : 0;
    const infoWidth = infoMetrics.width;

    const canvasWidth = Math.max(qrSize, textWidth, infoWidth) + margin * 2;
    const canvasHeight = margin + textHeight + (infoAutorizacion ? infoHeight + 4 : 0) + margin + qrSize + margin;
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(text, canvas.width / 2, margin);

    if (infoAutorizacion) {
      ctx.font = 'normal 15px Arial';
      ctx.fillText(infoAutorizacion, canvas.width / 2, margin + textHeight + 2);
    }

    // Valor del QR: URL a la página del ticket, usando el id del backend si existe
    const ticketId = order.id || id;
    const url = `${window.location.origin}/ticket/${ticketId}`;

    const qrCanvas = document.createElement('canvas');
    await QRCodeGen.toCanvas(qrCanvas, url, {
      width: qrSize,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    const qrX = (canvas.width - qrSize) / 2;
    const qrY = margin + textHeight + (infoAutorizacion ? infoHeight + 4 : 0) + margin;
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  };

  // Exportar el QR como PNG en un ZIP (solo el order del backend)
  const handleExportZip = async () => {
    const zip = new JSZip();
    if (orderData) {
      const blob = await generateQRImage(orderData, orderData.id || 1);
      const nombreArchivo = `${orderData.nombre || orderData.name_employee || 'ticket'}_QR.png`;
      zip.file(nombreArchivo, blob);
    }
    const content = await zip.generateAsync({type: 'blob'});
    saveAs(content, 'QR_Ticket.zip');
  };

  // // Función para compartir por correo
  // const getMailToLink = (text, empleado) => {
  //   const subject = `QR Ticket de Almuerzo - ${empleado.nombre} ${empleado.apellido}`;
  //   const body = `Este es tu código QR en formato texto:\n\n${text}`;
  //   return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  // };

  // Descargar el QR generado como imagen (solo el order del backend)
  const handleDownloadQR = async () => {
    if (orderData) {
      const blob = await generateQRImage(orderData, orderData.id || 1);
      const nombreArchivo = `${orderData.nombre || orderData.name_employee || 'ticket'}_QR.png`;
      saveAs(blob, nombreArchivo);
    }
  };

  return (
    <div className='overflow-y-auto w-full'>
      <div className="w-full flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm shadow"
          onClick={handleExportZip}
        >
          Exportar QR en ZIP
        </button>
      </div>
      <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-xl max-w-2xl mx-auto my-8 border-0">
        <QRCode
          value={`${window.location.origin}/ticket/${orderData.id || 1}`}
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
        <div className="mt-2 text-center text-xs text-gray-700">
          <div><b>{orderData.nombre || orderData.name_employee || ''}</b></div>
          <div>Total: <b>Bs. {Number(orderData.total_amount || orderData.total_pagar || 0).toFixed(2)}</b></div>
          {(orderData.autoriza_a || orderData.autorizado_por || orderData.authorized_person) && (
            <div className="text-blue-700">
              {orderData.autoriza_a
                ? `Autoriza a: ${orderData.autoriza_a}`
                : `Autorizado por: ${orderData.autorizado_por || orderData.authorized_person}`}
            </div>
          )}
        </div>
        <button
          className="mt-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs shadow"
          onClick={handleDownloadQR}
        >
          Descargar QR
        </button>
      </div>
    </div>
  );
}