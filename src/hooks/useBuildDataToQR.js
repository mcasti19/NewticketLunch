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
        // Permitir construir desde backend aunque selectedEmpleadosSummary esté vacío.
        if ((!selectedEmpleadosSummary || selectedEmpleadosSummary.length === 0) && !orderData) {
            console.warn("No hay empleados seleccionados ni orderData para construir el QR Data.");
            return null;
        }

        const extractOrderID = (od) => {
            if (!od) return '';
            return od.id || od.orderID || od.order_id || od.orderNumber || od.number || od.number_order || od.code || '';
        };

        const buildEmpleadoFromOrder = (o) => {
            if (!o) return { cedula: '', fullName: '', extras: [], total_pagar: 0, autorizado: null };
            return {
                cedula: o.cedula || o.cedula_employee || o.employee_cedula || '',
                fullName: o.name_employee || o.fullName || o.employee_name || o.full_name || '',
                extras: o.extras || [],
                total_pagar: Number(o.total_amount || o.total || o.amount || 0),
                autorizado: o.authorized_person || o.authorized || null,
            };
        };

        // Si backend ya devolvió orderData, construir desde allí
        if (orderData) {
            // Algunas respuestas vienen como { status, order: { ... } }
            const od = orderData.order ? orderData.order : orderData;
            // Si orderData es un array (varios pedidos)
            if (Array.isArray(od)) {
                const batch = od.map(o => {
                    const orderID = extractOrderID(o);
                    const emp = buildEmpleadoFromOrder(o);
                    return {
                        orderID: String(orderID || ''),
                        empleados: [emp],
                        total: Number(o.total_amount || emp.total_pagar || 0),
                        referencia: o.reference || o.referencia || referenceNumber || ''
                    };
                });
                setQrBatchData(batch);
                setQrData(null);
                return batch;
            }

            // orderData es objeto individual (o viene dentro de `order`)
            const orderID = extractOrderID(od);

            // Caso concreto de tu backend (según JSON que pegaste):
            // - od.number_order
            // - od.employees (objeto con first_name/last_name/cedula)
            // - od.employee_payment (phone, name)
            // - od.extras (array)

            // Construir empleados desde `od.employees` o `od.employee_payment`
            let empleadosArr = [];
            if (od.employees) {
                // Si viene como objeto con first_name/last_name
                const e = od.employees;
                const fullName = (e.first_name || '') + (e.last_name ? ' ' + e.last_name : '');
                empleadosArr.push({
                    cedula: e.cedula || '',
                    fullName: fullName.trim() || (od.employee_payment?.name_employee || ''),
                    extras: od.extras || [],
                    total_pagar: Number(od.total_amount || od.total || 0),
                    autorizado: od.authorized_person || od.authorized || null,
                });
            } else if (od.employee_payment) {
                const ep = od.employee_payment;
                empleadosArr.push({
                    cedula: ep.cedula_employee || ep.cedula || '',
                    fullName: ep.name_employee || '',
                    extras: od.extras || [],
                    total_pagar: Number(od.total_amount || od.total || 0),
                    autorizado: od.authorized_person || od.authorized || null,
                });
            } else if (od.cedula) {
                empleadosArr.push({
                    cedula: od.cedula || '',
                    fullName: od.fullName || '',
                    extras: od.extras || [],
                    total_pagar: Number(od.total_amount || od.total || 0),
                    autorizado: od.authorized_person || od.authorized || null,
                });
            }

            const qr = {
                orderID: String(orderID || ''),
                empleados: empleadosArr,
                total: Number(od.total_amount || od.total || summary.totalPagar || 0),
                referencia: od.reference || od.referencia || od.reference || referenceNumber || ''
            };
            setQrData(qr);
            setQrBatchData(null);
            return qr;
        }

        // Fallback (cliente)
        if (orderOrigin === 'mi-ticket' || selectedEmpleadosSummary.length === 1) {
            const emp = selectedEmpleadosSummary[0];
            const qrDataFinal = {
                orderID: '',
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
            setQrData(qrDataFinal);
            setQrBatchData(null);
            return qrDataFinal;
        }

        if (orderOrigin === 'seleccion' && selectedEmpleadosSummary.length > 1) {
            const batchQR = selectedEmpleadosSummary.map(emp => ({
                orderID: '',
                empleados: [{
                    cedula: emp.cedula,
                    fullName: emp.fullName,
                    extras: emp.extras,
                    total_pagar: emp.total_pagar,
                    autorizado: emp.id_autorizado || null,
                }],
                total: emp.total_pagar,
                referencia: referenceNumber,
            }));
            setQrBatchData(batchQR);
            setQrData(null);
            return batchQR;
        }

        return null;
    };

    return {
        builderDataQR
    };
};