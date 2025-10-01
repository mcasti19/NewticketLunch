import {useEffect, useState} from 'react'
import {MyQRCodeComponent} from './MyQRCodeComponent'
import {useTicketLunchStore} from '../store/ticketLunchStore'

export const ContentTicket = () => {
  // Leer el estado global de la orden generada
  const orderData = useTicketLunchStore( state => state.orderData );
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    
    // Cuando orderData cambia, actualizar loading
    if (orderData) {
      console.log({orderData});
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [orderData]);

  return (
    <div className='w-full max-h-screen overflow-y-auto '>
      <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-tight drop-shadow">Generar Ticket QR</h2>
      <div className="w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mb-4"></div>
            <p className="text-blue-700 text-lg font-semibold">Generando ticket, espera la respuesta...</p>
          </div>
        ) : (
          <>
            <MyQRCodeComponent />
            <p className="text-center text-gray-700 text-base md:text-lg mt-2">Escanea el código QR para ver tu ticket de almuerzo.</p>
          </>
        )}
      </div>
    </div>
  )
}
