import {QRCode} from 'react-qrcode-logo';
import JSZip from 'jszip';
import QRCodeGen from 'qrcode';
import {saveAs} from 'file-saver';

export function MyQRCodeComponent( {qrData} ) {
  const logoUrl = "/MercalMarker.png";

  // Si recibe un array, renderizar múltiples QR
  if ( Array.isArray( qrData ) ) {
    return (
      <div className="overflow-y-auto w-full">
        <div className="w-full flex justify-end mb-4">
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm shadow"
            onClick={async () => {
              const zip = new JSZip();
              for ( let i = 0; i < qrData.length; i++ ) {
                const qr = qrData[ i ];
                const blob = await generateQRImage( qr );
                const empleados = Array.isArray( qr.empleados ) ? qr.empleados : [];
                const nombresArchivo = empleados.map( e => e.fullName ).join( '_' ) || `ticket_${ i + 1 }`;
                zip.file( `${ nombresArchivo }_QR.png`, blob );
              }
              const content = await zip.generateAsync( {type: 'blob'} );
              saveAs( content, 'QR_Tickets_Lote.zip' );
            }}
          >
            Exportar todos los QR en ZIP
          </button>
        </div>
        <div className="flex flex-wrap gap-8 justify-center">
          {qrData.map( ( qr, idx ) => (
            <div key={idx} className="w-full md:w-auto">
              <MyQRCodeComponent qrData={qr} />
            </div>
          ) )}
        </div>
      </div>
    );
  }

  if ( !qrData ) {
    return (
      <div className="text-center p-6">
        <p>Genera tu ticket para ver el QR.</p>
      </div>
    );
  }

  // Función para generar un canvas con el texto y el QR usando datos del backend
  const generateQRImage = async ( qrData ) => {
    const qrSize = 150;
    const margin = 20;
    // Mostrar todos los empleados
    const empleados = Array.isArray( qrData.empleados ) ? qrData.empleados : [];
    const total = qrData.total || 0;
    let text = `OrdenID: ${ qrData.orderID }\n`;
    if ( Array.isArray( empleados ) ) {
      empleados.forEach( emp => {
        text += `Nombre y Apellido: ${ emp.fullName }\n`;
        text += `Cédula: ${ emp.cedula }\n`;
        if ( emp.autorizado ) text += `Autorizado: ${ emp.autorizado }\n`;
      } );
    }
    text += `Total Pagado: Bs. ${ Number( total ).toFixed( 2 ) }\n`;
    if ( qrData.referencia ) text += `Referencia: ${ qrData.referencia }\n`;

    // Crear canvas temporal para medir el texto
    // Calcular el ancho máximo del texto
    const tempCanvas = document.createElement( 'canvas' );
    const tempCtx = tempCanvas.getContext( '2d' );
    tempCtx.font = 'bold 18px Arial';
    const textLines = text.split( '\n' ).filter( Boolean );
    const lineHeight = 22;
    tempCtx.font = 'bold 18px Arial';
    let maxTextWidth = 0;
    textLines.forEach( line => {
      const w = tempCtx.measureText( line ).width;
      if ( w > maxTextWidth ) maxTextWidth = w;
    } );
    const canvasWidth = Math.max( qrSize, maxTextWidth ) + margin * 2;
    const canvasHeight = margin + ( textLines.length * lineHeight ) + margin + qrSize + margin;
    const canvas = document.createElement( 'canvas' );
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext( '2d' );

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect( 0, 0, canvas.width, canvas.height );

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    textLines.forEach( ( line, idx ) => {
      ctx.fillText( line, canvas.width / 2, margin + idx * lineHeight );
    } );

    const y = margin + ( textLines.length * lineHeight ) + margin;

    // Valor del QR: serializa el objeto completo
    const qrValue = formatQRText( qrData );
    const qrCanvas = document.createElement( 'canvas' );
    await QRCodeGen.toCanvas( qrCanvas, qrValue, {
      width: qrSize,
      margin: 2,
    } );

    const qrX = ( canvas.width - qrSize ) / 2;
    const qrY = y + margin;
    ctx.drawImage( qrCanvas, qrX, qrY, qrSize, qrSize );

    return new Promise( ( resolve ) => canvas.toBlob( resolve, 'image/png' ) );
  };

  // Descargar el QR generado como imagen (solo el order del backend)
  const handleDownloadQR = async () => {
    if ( qrData ) {
      const blob = await generateQRImage( qrData );
      const empleados = Array.isArray( qrData.empleados ) ? qrData.empleados : [];
      const nombresArchivo = empleados.map( e => e.fullName ).join( '_' ) || 'ticket';
      saveAs( blob, `${ nombresArchivo }_QR.png` );
    }
  };

  const formatQRText = ( qrData ) => {
    let text = `Orden: ${ qrData.orderID }\nReferencia: ${ qrData.referencia }\n`;
    if ( Array.isArray( qrData.empleados ) ) {
      qrData.empleados.forEach( ( emp, idx ) => {
        text += `Empleado ${ idx + 1 }: ${ emp.fullName } (C.I: ${ emp.cedula })\n`;
        if ( emp.autorizado ) text += `Autorizado: ${ emp.autorizado }\n`;
      } );
    }
    text += `Total: Bs. ${ Number( qrData.total || 0 ).toFixed( 2 ) }\n`;
    return text;
  };

  return (
    <div className="overflow-y-auto w-full">
      <div className="w-full flex justify-end mb-4">
      </div>
      <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-xl max-w-2xl mx-auto my-8 border-0">
        <div><b>Orden: {qrData.orderID}</b></div>
        <div>
          <b>
            {Array.isArray( qrData.empleados )
              ? qrData.empleados.map( e => `${ e.fullName } (C.I: ${ e.cedula })` ).join( ', ' )
              : ''}
          </b>
        </div>
        <QRCode
          value={formatQRText( qrData )}
          size={150}
          ecLevel="M"
          qrStyle="fluid"
          logoImage={logoUrl}
          logoWidth={80}
          logoHeight={80}
          logoOpacity={1}
          logoPadding={0}
          logoPaddingStyle="square"
        />
        <div className="mt-2 text-center text-xs text-gray-700">
          <div><b>Referencia: {qrData.referencia}</b></div>
          <div>Total Pagado: <b>Bs. {Number( qrData.total || 0 ).toFixed( 2 )}</b></div>
          {Array.isArray( qrData.empleados ) && qrData.empleados.some( e => e.autorizado ) && (
            <div className="text-blue-700">
              Autorizado: {qrData.empleados.filter( e => e.autorizado ).map( e => e.autorizado ).join( ', ' )}
            </div>
          )}
        </div>
        <h1>Fecha: {new Date().toLocaleDateString()}</h1>
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