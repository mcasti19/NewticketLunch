import {useTicketLunchStore} from '../store/ticketLunchStore';

export const useBuildDataToQR = () => {
    // 1. Desestructurar las partes del estado necesarias
    const {selectedEmpleadosSummary, summary, setQrData, orderData, referenceNumber} = useTicketLunchStore();

    console.log(orderData);
    
    

    // 2. Definir la función para construir y guardar los datos
    const builderDataQR = () => {
        // Validación básica antes de construir
        if ( !selectedEmpleadosSummary || selectedEmpleadosSummary.length === 0 ) {
            console.warn( "No hay empleados seleccionados para construir el QR Data." );
            return;
        }

        // 3. Mapear los datos de los empleados *una sola vez*
        // Esta estructura es la que usas para el array 'Empleado' dentro del QR
        const empleadosData = selectedEmpleadosSummary.map( emp => ( {
            cedula: emp.cedula,
            fullName: emp.fullName,
            extras: emp.extras,
            total_pagar: emp.total_pagar,
            id_autorizado: emp.id_autorizado,
        } ) );

        // 4. Construir el objeto qrData final
        const qrDataFinal = {
            OrderID: orderData || '', // Puedes incluirlo si lo necesitas
            Empleado: empleadosData, // La lista completa de empleados
            total: summary.totalPagar, // El total a pagar de la orden
            // Opcional: Si necesitas el 'autorizado' principal de la orden
            // podrías tomarlo del primer empleado o reevaluar de dónde viene este dato.
            // Para mantener tu estructura, lo he quitado pues está en cada empleado.
            referencia: referenceNumber, // Número de referencia/ID de la orden
        };

        // 5. Guardar el objeto completo en el store de Zustand
        setQrData( qrDataFinal );
        console.log( "QR DATA GUARDADO EN STORE:", qrDataFinal );

        // Opcional: devolver los datos
        return qrDataFinal;
    };

    return {
        builderDataQR
    }
}