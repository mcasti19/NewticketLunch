import {flexRender} from '@tanstack/react-table';
import ModalAgregarInvitado from './ModalAgregarInvitado';

export const EmployeesTable = ( {
  table,
  modalInvitadoOpen,
  setModalInvitadoOpen,
  handleAddInvitado,
  employeeList,
  // ModalAgregarInvitado
} ) => {
  return (
    <div className="hidden md:flex overflow-x-auto bg-white dark:bg-gray-200 rounded-lg shadow-lg w-full"
      style={{
        maxHeight: 'calc(100vh - 25vh)', // Ajusta este valor según el header, filtros y margen deseado
        minHeight:'200px',
        overflowY: 'auto',
        marginBottom: '1rem',
      }}
    >
      <table className="min-w-full">
        <thead>
          {table.getHeaderGroups().map( headerGroup => (
            <tr key={headerGroup.id} className="bg-blue-600 dark:bg-blue-900 text-white">
              {headerGroup.headers.map( column => (
                <th
                  key={column.id}
                  className="px-2 py-2 text-left text-xs md:text-sm font-semibold cursor-pointer  transition-colors"
                  onClick={column.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center">
                    {flexRender( column.column.columnDef.header, column.getContext() )}
                    {column.column.getIsSorted() && (
                      <span className="ml-1 text-xs">
                        {column.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ) )}
            </tr>
          ) )}
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.map( ( row, index ) => {
            const isInvitado = row.original && row.original.invitado;
            return (
              <tr
                key={row.id}
                className={`${ index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900' } hover:bg-blue-600 dark:hover:bg-blue-950 transition-colors group-hover:`}
              >
                {row.getVisibleCells().map( cell => (
                  <td key={cell.id} className="px-2 py-2 text-xs md:text-sm dark:text-amber-50">
                    {flexRender( cell.column.columnDef.cell, cell.getContext() )}
                    {cell.column.id === 'first_name' && isInvitado && (
                      <span className="ml-2 px-2 py-1 text-xs bg-yellow-300 text-yellow-900 rounded font-bold">INVITADO</span>
                    )}
                  </td>
                ) )}
              </tr>
            );
          } )}
          <ModalAgregarInvitado
            isOpen={modalInvitadoOpen}
            onRequestClose={() => setModalInvitadoOpen( false )}
            onAddInvitado={handleAddInvitado}
            employeeList={employeeList}
          />
        </tbody>
      </table>
    </div>
  );
}