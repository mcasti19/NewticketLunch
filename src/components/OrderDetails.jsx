import React, {useEffect} from 'react'
import {useTicketLunchStore} from '../store/ticketLunchStore';
import {useGetEmployees} from '../hooks/useGetEmployees';
import empleadosData from '../data/mockDataEmpleados.json';

export const OrderDetails = () => {
    const summary = useTicketLunchStore( state => state.summary );
    const selectedEmpleadosSummary = useTicketLunchStore( state => state.selectedEmpleadosSummary );
    // Obtener empleados desde API o mock
    const {employees,
        // loading
    } = useGetEmployees();
    // Usar empleados cargados en memoria, si no hay, usar mock
    const empleados = employees && employees.length > 0 ? employees : empleadosData;
    // Crear un mapa cedula -> first_name para búsqueda rápida
    const cedulaToNombre = React.useMemo( () => {
        const map = {};
        empleados.forEach( emp => {
            map[ emp.cedula ] = emp.first_name;
        } );
        return map;
    }, [ empleados ] );


useEffect(() => {

console.log("selectedEmpleadosSummary", selectedEmpleadosSummary);

}, [])









    return (
        <div className="rounded-2xl shadow p-4 border-blue-100 w-full max-6xl">
            <div className='flex justify-between'>
                <h2 className="text-xl md:text-2xl font-extrabold mb-4 text-center text-blue-700 tracking-tight">Detalles de la Orden</h2>
                <div className="text-right font-bold text-lg text-blue-800 mt-2">
                    Total a pagar: <span className="text-green-600">Bs. {summary.totalPagar?.toFixed( 2 ) ?? '0.00'}</span>
                </div>
            </div>
            <div className="overflow-x-auto bg-white dark:bg-gray-200 rounded-lg shadow-lg w-full">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-blue-600 dark:bg-blue-900 text-white">
                            <th className="px-2 py-2 text-left text-xs md:text-sm font-semibold cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">Empleado</th>
                            <th className="px-2 py-2 text-left text-xs md:text-sm font-semibold cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">Almuerzo</th>
                            <th className="px-2 py-2 text-left text-xs md:text-sm font-semibold cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">Para Llevar</th>
                            <th className="px-2 py-2 text-left text-xs md:text-sm font-semibold cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">Cubiertos</th>
                            <th className="px-2 py-2 text-left text-xs md:text-sm font-semibold cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">Retira</th>
                            <th className="px-2 py-2 text-left text-xs md:text-sm font-semibold cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">Evento Especial</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedEmpleadosSummary.map( ( emp, idx ) => (
                            <tr
                                key={idx}
                                className={`${ idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900' } hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:text-amber-50 transition-colors`}
                            >
                                <td className="px-2 py-2 text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100">{emp.nombre}</td>
                                <td className="px-2 py-2 text-xs md:text-sm ">{emp.almuerzo ? 'Sí' : 'No'}</td>
                                <td className="px-2 py-2 text-xs md:text-sm ">{emp.para_llevar ? 'Sí' : 'No'}</td>
                                <td className="px-2 py-2 text-xs md:text-sm ">{emp.cubiertos ? 'Sí' : 'No'}</td>
                                <td className="px-2 py-2 text-xs md:text-sm ">
                                    {emp.id_autorizado ? cedulaToNombre[ emp.id_autorizado ] || 'N/A' : 'Mismo Empleado'}
                                </td>
                                <td className="px-2 py-2 text-xs md:text-sm ">{emp.evento_especial ? 'Sí' : 'No'}</td>
                            </tr>
                        ) )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}