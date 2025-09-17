import {useEffect, useState} from 'react'
import {MyQRCodeComponent} from './MyQRCodeComponent'
// import {useTicketLunchStore} from '../store/ticketLunchStore'

export const ContentTicket = () => {
  const [ ordenes, setOrdenes ] = useState( [] );

  useEffect( () => {
    console.log(ordenes);
    
    const data = localStorage.getItem( 'ordenesGeneradas' );
    if ( data ) {
      const parsed = JSON.parse( data );
      setOrdenes( parsed );
      console.log( 'ORDENES GENERADAS:', parsed );
    } else {
      setOrdenes( [] );
      console.log( 'No hay ordenes generadas en localStorage' );
    }
  }, [ordenes] );

  return (
    <div className='w-full max-h-screen overflow-y-auto '>
      <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-tight drop-shadow">Generar Ticket QR</h2>
      <div className="w-full">
        <MyQRCodeComponent />
        <p className="text-center text-gray-700 text-base md:text-lg mt-2">Escanea el código QR para ver tu ticket de almuerzo.</p>
      </div>
      {/* <div className="w-full max-w-2xl mx-auto mt-6 bg-white rounded shadow p-4 overflow-x-auto">
        <h3 className="text-lg font-bold text-blue-700 mb-2 text-center">Orden generada (estructura enviada al backend):</h3>
        <pre className="text-xs md:text-sm bg-gray-100 rounded p-2 overflow-x-auto">
          {ordenes.length > 0 ? JSON.stringify(ordenes, null, 2) : 'No hay orden generada.'}
        </pre>
      </div> */}
    </div>
  )
}
