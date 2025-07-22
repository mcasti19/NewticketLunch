import React from 'react';
import { QRCode } from 'react-qrcode-logo';
import { useTicketLunchStore } from '../store/ticketLunchStore';

export function MyQRCodeComponent() {
  const empleados = useTicketLunchStore(state => state.selectedEmpleadosSummary);
  const logoUrl = "/MercalMarker.png"; // Logo path

  if (!empleados || empleados.length === 0) {
    return (
      <div className="text-center p-6">
        <p>No hay empleados seleccionados para generar QR.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-white rounded-lg shadow-xl max-w-7xl mx-auto my-8">
      {empleados.map((empleado, index) => {
        // Construct QR value as JSON string with relevant employee info
        const qrValue = JSON.stringify({
          nombre: empleado.nombre,
          apellido: empleado.apellido,
          almuerzoParaLlevar: empleado.para_llevar,
          cubiertos: empleado.cubiertos,
          autorizado: empleado.autorizado,
          // Add other fields if needed
        });

        return (
          <div key={index} className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{empleado.nombre} {empleado.apellido}</h3>
            <QRCode
              value={qrValue}
              size={180}
              ecLevel="H"
              qrStyle="squares"
              fgColor="#000000"
              bgColor="#FFFFFF"
              logoImage={logoUrl}
              logoWidth={40}
              logoHeight={40}
              logoOpacity={1}
              logoPadding={5}
              logoPaddingStyle="square"
            />
          </div>
        );
      })}
    </div>
  );
}
