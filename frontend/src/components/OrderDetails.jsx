import React from 'react'
import {useTicketLunchStore} from '../store/ticketLunchStore';

export const OrderDetails = () => {
    const summary = useTicketLunchStore( state => state.summary );


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
                            <th className="px-2 py-2 text-left text-xs md:text-sm font-semibold cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">Autorizado</th>
                            <th className="px-2 py-2 text-left text-xs md:text-sm font-semibold cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">Evento Especial</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {useTicketLunchStore.getState().selectedEmpleadosSummary.map( ( emp, idx ) => (
                            <React.Fragment key={idx}>
                                <tr
                                    className={`${ idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900' } hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:text-amber-50 transition-colors`}
                                >
                                    <td className="px-2 py-2 text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100">{emp.nombre} {emp.apellido}</td>
                                    <td className="px-2 py-2 text-xs md:text-sm ">{emp.almuerzo ? 'Sí' : 'No'}</td>
                                    <td className="px-2 py-2 text-xs md:text-sm ">{emp.para_llevar ? 'Sí' : 'No'}</td>
                                    <td className="px-2 py-2 text-xs md:text-sm ">{emp.cubiertos ? 'Sí' : 'No'}</td>
                                    <td className="px-2 py-2 text-xs md:text-sm ">{emp.autorizado ? 'Sí' : 'No'}</td>
                                    <td className="px-2 py-2 text-xs md:text-sm ">{emp.evento_especial ? 'Sí' : 'No'}</td>
                                </tr>
                                {emp.autorizado && Array.isArray( emp.almuerzos_autorizados ) && emp.almuerzos_autorizados.length > 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-2 border bg-blue-50 text-left">
                                            <div className="ml-4">
                                                <span className="font-semibold">Empleados asociados autorizados:</span>
                                                <ul className="list-disc ml-6">
                                                    {emp.almuerzos_autorizados.map( ( asoc, i ) => (
                                                        <li key={i}>{asoc}</li>
                                                    ) )}
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ) )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


//  <div className="overflow-x-auto bg-white dark:bg-gray-200 rounded-lg shadow-lg w-full">
//     <table className="min-w-full">
//       <thead>
//         {table.getHeaderGroups().map( headerGroup => (
//           <tr key={headerGroup.id} className="bg-blue-600 dark:bg-blue-900 text-white">
//             {headerGroup.headers.map( column => (
//               <th
//                 key={column.id}
//                 className="px-2 py-2 text-left text-xs md:text-sm font-semibold cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
//                 onClick={column.column.getToggleSortingHandler()}
//               >
//                 <div className="flex items-center">
//                   {flexRender( column.column.columnDef.header, column.getContext() )}
//                   {column.column.getIsSorted() && (
//                     <span className="ml-1 text-xs">
//                       {column.column.getIsSorted() === 'asc' ? '↑' : '↓'}
//                     </span>
//                   )}
//                 </div>
//               </th>
//             ) )}
//           </tr>
//         ) )}
//       </thead>
//       <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//         {table.getRowModel().rows.map( ( row, index ) => {
//           const isInvitado = row.original && row.original.invitado;
//           return (
//             <tr
//               key={row.id}
//               className={`${ index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900' } hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors`}
//             >
//               {row.getVisibleCells().map( cell => (
//                 <td key={cell.id} className="px-2 py-2 text-xs md:text-sm">
//                   {flexRender( cell.column.columnDef.cell, cell.getContext() )}
//                   {cell.column.id === 'nombre' && isInvitado && (
//                     <span className="ml-2 px-2 py-1 text-xs bg-yellow-300 text-yellow-900 rounded font-bold">INVITADO</span>
//                   )}
//                 </td>
//               ) )}
//             </tr>
//           );
//         })}
//   <ModalAgregarInvitado
//     isOpen={modalInvitadoOpen}
//     onRequestClose={() => setModalInvitadoOpen(false)}
//     onAddInvitado={handleAddInvitado}
//   />
//       </tbody>
//     </table>
//   </div>