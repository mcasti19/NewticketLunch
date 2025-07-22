import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import empleadosData from "../data/mockDataEmpleados.json";
import { useAuthStore } from '../store/authStore';
import { useTicketLunchStore } from '../store/ticketLunchStore';
import { useTasaDia } from '../hooks/useTasaDia';

export const ContentSeleccion = () => {
  const [empleados, setEmpleados] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data: tasaDia, isLoading } = useTasaDia();
  const { user } = useAuthStore();
  const userGerencia = user?.gerencia || null;
  const setSummary = useTicketLunchStore(state => state.setSummary);

  const precioLlevar = 15;
  const precioCubierto = 20;

  useEffect(() => {
    setEmpleados(empleadosData);
  }, []);

  const filteredEmpleados = useMemo(() => {
    return userGerencia
      ? empleados.filter(emp => emp.gerencia === userGerencia)
      : [];
  }, [empleados, userGerencia]);

  const toggleEmpleadoField = useCallback((empleadoOriginal, field) => {
    setEmpleados(prevEmpleados =>
      prevEmpleados.map(emp =>
        emp.nombre === empleadoOriginal.nombre && emp.apellido === empleadoOriginal.apellido
          ? { ...emp, [field]: !emp[field] }
          : emp
      )
    );
  }, []);

  const updateAlmuerzosAutorizados = useCallback((empleadoOriginal, selectedAutorizados) => {
    setEmpleados(prevEmpleados =>
      prevEmpleados.map(emp =>
        emp.nombre === empleadoOriginal.nombre && emp.apellido === empleadoOriginal.apellido
          ? { ...emp, almuerzos_autorizados: selectedAutorizados }
          : emp
      )
    );
  }, []);

  useEffect(() => {
    const countAlmuerzos = empleados.filter(emp => emp.almuerzo).length;
    const countAlmuerzosAutorizados = empleados.reduce((acc, emp) => acc + (emp.almuerzos_autorizados ? emp.almuerzos_autorizados.length : 0), 0);
    const countParaLlevar = empleados.filter(emp => emp.para_llevar || emp.cubiertos).length;
    const countCubiertos = empleados.filter(emp => emp.para_llevar || emp.cubiertos).length;
    const totalPagar = empleados.reduce((acc, emp) => {
      const almuerzoCount = emp.almuerzo ? 1 : 0;
      const almuerzosAutorizadosCount = emp.almuerzos_autorizados ? emp.almuerzos_autorizados.length : 0;
      const paraLlevarCount = emp.para_llevar ? 1 : 0;
      const cubiertosCount = emp.cubiertos ? 1 : 0;
      return acc + (almuerzoCount + almuerzosAutorizadosCount) * parseFloat(tasaDia || 0) + paraLlevarCount * 15 + cubiertosCount * 20;
    }, 0);
    setSummary({ countAlmuerzos, countAlmuerzosAutorizados, countParaLlevar, countCubiertos, totalPagar });
  }, [empleados, tasaDia, setSummary]);

  const toggleDropdown = (rowId) => {
    setDropdownOpen(prev => (prev === rowId ? null : rowId));
  };

  const handleExtraToggle = (rowOriginal, extraName) => {
    const currentAutorizados = rowOriginal.almuerzos_autorizados || [];
    let newAutorizado;
    if (currentAutorizados.includes(extraName)) {
      newAutorizado = currentAutorizados.filter(e => e !== extraName);
    } else {
      newAutorizado = [...currentAutorizados, extraName];
    }
    updateAlmuerzosAutorizados(rowOriginal, newAutorizado);
  };

  const columns = useMemo(() => [
    {
      header: 'Nombre',
      accessorKey: 'nombre',
      cell: ({ row }) => (
        <span className="text-gray-900 dark:text-gray-100">{row.getValue('nombre')}</span>
      ),
    },
    {
      header: 'Apellido',
      accessorKey: 'apellido',
      cell: ({ row }) => (
        <span className="text-gray-900 dark:text-gray-100">{row.getValue('apellido')}</span>
      ),
    },
    {
      header: `Almuerzo Bs. ${tasaDia}`,
      accessorKey: 'almuerzo',
      cell: ({ row }) => {
        const checked = row.getValue('almuerzo');
        const fullName = row.original.nombre + ' ' + row.original.apellido;
        const selectedInExtras = new Set();
        empleados.forEach(emp => {
          if (emp.almuerzos_autorizados && emp !== row.original) {
            emp.almuerzos_autorizados.forEach(name => selectedInExtras.add(name));
          }
        });
        const isDisabled = selectedInExtras.has(fullName);
        return (
          <div className='w-full flex justify-center items-center'>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleEmpleadoField(row.original, 'almuerzo')}
              disabled={isDisabled}
              className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </div>
        );
      }
    },
    {
      header: `Para llevar Bs. ${precioLlevar}`,
      accessorKey: 'para_llevar',
      cell: ({ row }) => {
        const checked = row.getValue('para_llevar');
        const almuerzo = row.getValue('almuerzo');
        return (
          <div className='w-full flex justify-center items-center'>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleEmpleadoField(row.original, 'para_llevar')}
              disabled={!almuerzo}
              className="form-checkbox h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
            />
          </div>
        );
      }
    },
    {
      header: `Cubiertos Bs. ${precioCubierto}`,
      accessorKey: 'cubiertos',
      cell: ({ row }) => {
        const checked = row.getValue('cubiertos');
        const almuerzo = row.getValue('almuerzo');
        return (
          <div className='w-full flex justify-center items-center'>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleEmpleadoField(row.original, 'cubiertos')}
              disabled={!almuerzo}
              className="form-checkbox h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
            />
          </div>
        );
      }
    },
    {
      header: 'Autorizado',
      accessorKey: 'autorizado',
      cell: ({ row }) => {
        const checked = row.getValue('autorizado');
        const fullName = row.original.nombre + ' ' + row.original.apellido;
        const selectedInExtras = new Set();
        empleados.forEach(emp => {
          if (emp.almuerzos_autorizados && emp !== row.original) {
            emp.almuerzos_autorizados.forEach(name => selectedInExtras.add(name));
          }
        });
        const isDisabled = selectedInExtras.has(fullName);
        return (
          <div className='w-full flex justify-center items-center'>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleEmpleadoField(row.original, 'autorizado')}
              disabled={isDisabled}
              className="form-checkbox h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
            />
          </div>
        );
      }
    },
    {
      header: 'Almuerzos Autorizados',
      accessorKey: 'almuerzos_autorizados',
      cell: ({ row }) => {
        const selectedAutorizados = row.getValue('almuerzos_autorizados') || [];
        const rowId = row.id;
        const autorizado = row.getValue('autorizado');
        return (
          <div className="relative">
            <div
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
                ${autorizado 
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800' 
                  : 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'}`}
              onClick={() => autorizado && toggleDropdown(rowId)}
            >
              {selectedAutorizados.length > 0 ? selectedAutorizados.join(', ') : 'Seleccione'}
            </div>
            {dropdownOpen === rowId && autorizado && (
              <div className="absolute z-20 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                <div className="py-1">
                  {(() => {
                    const selectedInOtherRows = new Set();
                    empleados.forEach(emp => {
                      if (emp.almuerzos_autorizados && emp !== row.original) {
                        emp.almuerzos_autorizados.forEach(name => selectedInOtherRows.add(name));
                      }
                    });
                    return empleados
                      .filter(emp => {
                        const fullName = emp.nombre + ' ' + emp.apellido;
                        return emp.gerencia === userGerencia &&
                          fullName !== (row.original.nombre + ' ' + row.original.apellido) &&
                          (!selectedInOtherRows.has(fullName) || selectedAutorizados.includes(fullName));
                      })
                      .map(emp => {
                        const fullName = emp.nombre + ' ' + emp.apellido;
                        const checked = selectedAutorizados.includes(fullName);
                        return (
                          <label key={fullName} className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleExtraToggle(row.original, fullName)}
                              className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-3"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{fullName}</span>
                          </label>
                        );
                      });
                  })()}
                </div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: 'Total Almuerzos',
      accessorKey: 'total_almuerzos',
      cell: ({ row }) => {
        const almuerzo = row.getValue('almuerzo') ? 1 : 0;
        const almuerzosAutorizadosCount = (row.getValue('almuerzos_autorizados') || []).length;
        return (
          <div className='w-full flex justify-center items-center'>
            <span className="font-semibold text-gray-900 dark:text-white">{almuerzo + almuerzosAutorizadosCount}</span>
          </div>
        )
      }
    },
    {
      header: 'Total a Pagar (Bs.)',
      accessorKey: 'total_pagar',
      cell: ({ row }) => {
        if (!tasaDia) return '0.00';
        const almuerzoCount = row.getValue('almuerzo') ? 1 : 0;
        let paraLLevar = row.getValue('para_llevar') ? 1 : 0;
        paraLLevar = paraLLevar * precioLlevar;
        let cubiertos = row.getValue('cubiertos') ? 1 : 0;
        cubiertos = cubiertos * precioCubierto;
        const almuerzosAutorizadosCount = (row.getValue('almuerzos_autorizados') || []).length;
        let totalMontoAlmuerzosAutorizados = almuerzosAutorizadosCount > 0 ? almuerzosAutorizadosCount * parseFloat(tasaDia) + precioLlevar : 0;

        const preTotal = almuerzoCount * parseFloat(tasaDia) + totalMontoAlmuerzosAutorizados + paraLLevar + cubiertos;
        const total = preTotal.toFixed(2);
        return (
          <div className='w-full flex justify-center items-center'>
            <span className="font-bold text-green-600 dark:text-green-400">Bs. {total}</span>
          </div>
        )
      },
    },
  ], [empleados, dropdownOpen, toggleEmpleadoField, updateAlmuerzosAutorizados, tasaDia, userGerencia]);

  const table = useReactTable({
    data: filteredEmpleados,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  return (
    <div className="w-full h-full mx-auto p-4 md:p-6 border-0 rounded-2xl">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Gerencia {userGerencia}
      </h1>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando datos...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white dark:bg-gray-200 rounded-lg shadow-lg">
            <table className="min-w-full">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="bg-blue-600 dark:bg-blue-900 text-white">
                    {headerGroup.headers.map(column => (
                      <th
                        key={column.id}
                        className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                        onClick={column.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center">
                          {flexRender(column.column.columnDef.header, column.getContext())}
                          {column.column.getIsSorted() && (
                            <span className="ml-1 text-xs">
                              {column.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {table.getRowModel().rows.map((row, index) => (
                  <tr 
                    key={row.id} 
                    className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'} hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors`}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando {table.getRowModel().rows.length} de {filteredEmpleados.length} empleados
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
