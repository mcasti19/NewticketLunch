import React from 'react'
import {MyQRCodeComponent} from './MyQRCodeComponent'
import { useTicketLunchStore } from '../store/ticketLunchStore'

export const ContentTicket = () => {
  const empleados = useTicketLunchStore(state => state.empleados);

  return (
    <div>
      <button>
        {/* Generar Tickets */}
      </button>
      <MyQRCodeComponent empleados={empleados} />
    </div>
  )
}
