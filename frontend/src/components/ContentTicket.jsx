import React from 'react'
import {MyQRCodeComponent} from './MyQRCodeComponent'
// import {useTicketLunchStore} from '../store/ticketLunchStore'

export const ContentTicket = () => {
  // const empleados = useTicketLunchStore( state => state.empleados );

  return (
    <div className='w-full max-h-screen overflow-y-auto '>
      <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-tight drop-shadow">Generar Ticket QR</h2>
      <div className="w-full">
        <MyQRCodeComponent  />
        <p className="text-center text-gray-700 text-base md:text-lg mt-2">Escanea el código QR para ver tu ticket de almuerzo.</p>
      </div>
    </div>
  )
}
