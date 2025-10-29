import {create} from "zustand";
import { persist } from 'zustand/middleware';

// 💡 1. DEFINICIÓN DEL ESTADO INICIAL (TODOS LOS VALORES A RESETEAR)
const initialState = {
    empleados: [],
    summary: {
        countAlmuerzos: 0,
        countAlmuerzosAutorizados: 0,
        countParaLlevar: 0,
        countCubiertos: 0,
        totalPagar: 0,
    },
    referenceNumber: '',
    selectedEmpleadosSummary: [],
    // Flags para habilitar tabs
    isResumenEnabled: false,
    isTicketEnabled: false,
    // Estado para rastrear el origen del pedido
    orderOrigin: null, // Puede ser 'mi-ticket' o 'seleccion'
    // Estado para guardar el objeto de la orden recibida del backend
    orderId: null,
    // Guardar objeto completo de la orden tal como lo devuelve el backend
    orderData: null,
    // Estado para guardar el objeto qrData para el QR individual
    qrData: null,
    // Estado para guardar el array de datos de QR por lote
    qrBatchData: null,
    // Controla si se muestra la imagen/ticket en Profile (Asumo que también debe resetearse)
    showTicketImage: false,
};

export const useTicketLunchStore = create(
    persist(
        (set) => ({
            ...initialState, // 👈 Se usa el estado inicial para el setup
            
            // Setters existentes
            setEmpleados: (empleados) => set({ empleados }),
            setSummary: (summary) => set({ summary }),
            setReferenceNumber: (referenceNumber) => set({ referenceNumber }),
            setSelectedEmpleadosSummary: (selectedEmpleadosSummary) => set({ selectedEmpleadosSummary }),
            setResumenEnabled: (enabled) => set({ isResumenEnabled: enabled }),
            setTicketEnabled: (enabled) => set({ isTicketEnabled: enabled }),
            setOrderOrigin: (origin) => set({ orderOrigin: origin }),
            setOrderId: (orderId) => set({ orderId }),
            setOrderData: (orderData) => set({ orderData }),
            setQrData: (qrData) => set({ qrData }),
            setQrBatchData: ( qrBatchData ) => set( {qrBatchData} ),
            setShowTicketImage: (show) => set({ showTicketImage: show }),
            
            // 🚨 FUNCIÓN CLAVE PARA EL BOTÓN "FINALIZAR Y VOLVER"
            /**
             * Restablece todos los estados relacionados con el pedido a sus valores iniciales.
             * Esto limpia la clave 'ticket-lunch-storage' en LocalStorage.
             */
            resetOrderData: () => set(initialState),
        }),
        {
            name: 'ticket-lunch-storage', // nombre del item en localStorage
        }
    )
);










// import {create} from "zustand";
// import { persist } from 'zustand/middleware';

// export const useTicketLunchStore = create(
//   persist(
//     (set) => ({
//       empleados: [],
//       setEmpleados: (empleados) => set({ empleados }),

//   summary: {
//     countAlmuerzos: 0,
//     countAlmuerzosAutorizados: 0,
//     countParaLlevar: 0,
//     countCubiertos: 0,
//     totalPagar: 0,
//   },

//   setSummary: (summary) => set({ summary }),

//   referenceNumber: '',
//   setReferenceNumber: (referenceNumber) => set({ referenceNumber }),

//   selectedEmpleadosSummary: [],
//   setSelectedEmpleadosSummary: (selectedEmpleadosSummary) => set({ selectedEmpleadosSummary }),

//   // Flags para habilitar tabs
//   isResumenEnabled: false,
//   setResumenEnabled: (enabled) => set({ isResumenEnabled: enabled }),
//   isTicketEnabled: false,
//   setTicketEnabled: (enabled) => set({ isTicketEnabled: enabled }),

//   // Nuevo estado para rastrear el origen del pedido
//   orderOrigin: null, // Puede ser 'mi-ticket' o 'seleccion'
//   setOrderOrigin: (origin) => set({ orderOrigin: origin }),

//   // Estado para guardar el objeto de la orden recibida del backend
//   orderId: null,
//   setOrderId: (orderId) => set({ orderId }),

//   // Guardar objeto completo de la orden tal como lo devuelve el backend
//   orderData: null,
//   setOrderData: (orderData) => set({ orderData }),

//   // Estado para guardar el objeto qrData para el QR individual
//   qrData: null,
//   setQrData: (qrData) => set({ qrData }),

//   // Estado para guardar el array de datos de QR por lote
//   qrBatchData: null,
//       setQrBatchData: ( qrBatchData ) => set( {qrBatchData} ),
  
      
//   // Controla si se muestra la imagen/ticket en Profile
//   showTicketImage: false,
//   setShowTicketImage: (show) => set({ showTicketImage: show }),
//     }),
//     {
//       name: 'ticket-lunch-storage', // nombre del item en localStorage
//     }
//   )
// );
