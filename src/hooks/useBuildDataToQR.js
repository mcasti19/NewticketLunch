import {useTicketLunchStore} from '../store/ticketLunchStore';

export const useBuildDataToQR = () => {
    // 1. Desestructurar las partes del estado necesarias
    const {
        selectedEmpleadosSummary,
        summary,
        setQrData,
        setQrBatchData,
        orderData,
        referenceNumber,
        orderOrigin
    } = useTicketLunchStore();

    // 2. Definir la función para construir y guardar los datos
    const builderDataQR = () => {
        if ( !selectedEmpleadosSummary || selectedEmpleadosSummary.length === 0 ) {
            console.warn( "No hay empleados seleccionados para construir el QR Data." );
            return;
        }

        // Si es flujo individual
        if ( orderOrigin === 'mi-ticket' || selectedEmpleadosSummary.length === 1 ) {
            const emp = selectedEmpleadosSummary[ 0 ];
            const qrDataFinal = {
                orderID: orderData || '',
                fecha: new Date().toLocaleDateString(),
                empleados: [
                    {
                        cedula: emp.cedula,
                        fullName: emp.fullName,
                        extras: emp.extras,
                        total_pagar: emp.total_pagar,
                        autorizado: emp.id_autorizado || null,
                    }
                ],
                total: summary.totalPagar,
                referencia: referenceNumber,
            };
            setQrData( qrDataFinal );
            setQrBatchData( null ); // Limpiar lote si existía
            return qrDataFinal;
        }

        // Si es flujo por lote
        if ( orderOrigin === 'seleccion' && selectedEmpleadosSummary.length > 1 ) {
            const batchQR = selectedEmpleadosSummary.map( emp => ( {
                orderID: orderData || '',
                fecha: new Date().toLocaleDateString(),
                empleados: [
                    {
                        cedula: emp.cedula,
                        fullName: emp.fullName,
                        extras: emp.extras,
                        total_pagar: emp.total_pagar,
                        autorizado: emp.id_autorizado || null,
                    }
                ],
                total: emp.total_pagar,
                referencia: referenceNumber,
            } ) );
            setQrBatchData( batchQR );
            setQrData( null ); // Limpiar individual si existía
            return batchQR;
        }
    };

    return {
        builderDataQR
    };
}