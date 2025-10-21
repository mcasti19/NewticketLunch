import {useEffect, useState} from 'react'
import {MyQRCodeComponent} from '../components/MyQRCodeComponent'
import {useTicketLunchStore} from '../store/ticketLunchStore'
import {useBuildDataToQR} from '../hooks/useBuildDataToQR';

export const Tickets = () => {
  const qrData = useTicketLunchStore((state) => state.qrData);
  const qrBatchData = useTicketLunchStore((state) => state.qrBatchData);
  const { builderDataQR } = useBuildDataToQR();

  useEffect(() => {
    // Intenta construir los datos del QR si no existen.
    if (!qrData && !qrBatchData) {
      builderDataQR();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Se ejecuta solo una vez al montar el componente.

  // El estado de carga se deriva directamente de la presencia de datos.
  const isLoading = !qrData && (!qrBatchData || qrBatchData.length === 0);

  return (
    <div className="w-full max-h-screen overflow-y-auto ">
      <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-tight drop-shadow">Generar Ticket QR</h2>
      <div className="w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mb-4"></div>
            <p className="text-blue-700 text-lg font-semibold">Generando ticket, espera la respuesta...</p>
          </div>
        ) : (
          <>
            {qrBatchData && Array.isArray(qrBatchData) && qrBatchData.length > 0 ? (
              <div className="flex flex-wrap gap-8 justify-center">
                {qrBatchData.map((qr, idx) => (
                  <div key={idx} className="w-full md:w-auto">
                    <MyQRCodeComponent qrData={qr} />
                  </div>
                ))}
              </div>
            ) : (
              <MyQRCodeComponent qrData={qrData} />
            )}
            <p className="text-center text-gray-700 text-base md:text-lg mt-2">Escanea el código QR para ver tu ticket de almuerzo.</p>
          </>
        )}
      </div>
    </div>
  );
};
