import {create} from "zustand";

export const useTicketLunchStore = create( ( set ) => ( {
  empleados: [],
  setEmpleados: ( empleados ) => set( {empleados} ),

  summary: {
    countAlmuerzos: 0,
    countAlmuerzosAutorizados: 0,
    countParaLlevar: 0,
    countCubiertos: 0,
    totalPagar: 0,
  },

  setSummary: ( summary ) => set( {summary} ),

  referenceNumber: '',
  setReferenceNumber: ( referenceNumber ) => set( {referenceNumber} ),

  selectedEmpleadosSummary: [],
  setSelectedEmpleadosSummary: ( selectedEmpleadosSummary ) => set( {selectedEmpleadosSummary} ),

  // Flags para habilitar tabs
  isResumenEnabled: false,
  setResumenEnabled: (enabled) => set({ isResumenEnabled: enabled }),
  isTicketEnabled: false,
  setTicketEnabled: (enabled) => set({ isTicketEnabled: enabled }),

  // Nuevo estado para rastrear el origen del pedido
  orderOrigin: null, // Puede ser 'mi-ticket' o 'seleccion'
  setOrderOrigin: (origin) => set({ orderOrigin: origin }),
} ) );
