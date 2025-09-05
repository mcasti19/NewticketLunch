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
} ) );
