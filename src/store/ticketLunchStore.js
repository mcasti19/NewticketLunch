import {create} from "zustand";
import { persist } from 'zustand/middleware';

export const useTicketLunchStore = create(
  persist(
    (set) => ({
      empleados: [],
      setEmpleados: (empleados) => set({ empleados }),

  summary: {
    countAlmuerzos: 0,
    countAlmuerzosAutorizados: 0,
    countParaLlevar: 0,
    countCubiertos: 0,
    totalPagar: 0,
  },

  setSummary: (summary) => set({ summary }),

  referenceNumber: '',
  setReferenceNumber: (referenceNumber) => set({ referenceNumber }),

  selectedEmpleadosSummary: [],
  setSelectedEmpleadosSummary: (selectedEmpleadosSummary) => set({ selectedEmpleadosSummary }),

  // Flags para habilitar tabs
  isResumenEnabled: false,
  setResumenEnabled: (enabled) => set({ isResumenEnabled: enabled }),
  isTicketEnabled: false,
  setTicketEnabled: (enabled) => set({ isTicketEnabled: enabled }),

  // Nuevo estado para rastrear el origen del pedido
  orderOrigin: null, // Puede ser 'mi-ticket' o 'seleccion'
  setOrderOrigin: (origin) => set({ orderOrigin: origin }),

  // Estado para guardar el objeto de la orden recibida del backend
  orderId: null,
  setOrderId: (orderId) => set({ orderId }),

  // Estado para guardar el objeto qrData para el QR individual
  qrData: null,
  setQrData: (qrData) => set({ qrData }),

  // Estado para guardar el array de datos de QR por lote
  qrBatchData: null,
  setQrBatchData: (qrBatchData) => set({ qrBatchData }),
  // Controla si se muestra la imagen/ticket en Profile
  showTicketImage: false,
  setShowTicketImage: (show) => set({ showTicketImage: show }),
    }),
    {
      name: 'ticket-lunch-storage', // nombre del item en localStorage
    }
  )
);
