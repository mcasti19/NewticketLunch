import React, {useState, useEffect, useMemo, useCallback} from 'react';
import ModalAgregarInvitado from './ModalAgregarInvitado';
import {useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel} from '@tanstack/react-table';
import empleadosData from "../data/mockDataEmpleados.json";
import {useAuthStore} from '../store/authStore';
import {useTicketLunchStore} from '../store/ticketLunchStore';
// import {useTasaDia} from '../hooks/useTasaDia';
// import {useNavigate} from 'react-router';

export const ContentSeleccion = ({ goToResumeTab }) => {
  // Intenta cargar del localStorage
  const [empleados, setEmpleados] = useState(() => {
    const saved = localStorage.getItem('empleadosSeleccionados');
    return saved ? JSON.parse(saved) : [];
  });
  const [modalInvitadoOpen, setModalInvitadoOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleAddInvitado = useCallback((nuevoInvitado) => {
    setEmpleados(prev => {
      const updated = [...prev, { ...nuevoInvitado, invitado: true, evento_especial: false }];
      localStorage.setItem('empleadosSeleccionados', JSON.stringify(updated));
      return updated;
    });
  }, []);
  const [ dropdownOpen, setDropdownOpen ] = useState( null );
  const [ sorting, setSorting ] = useState( [] );
  const [ pagination, setPagination ] = useState( {pageIndex: 0, pageSize: 10} );

  // const navigate = useNavigate();

  // const {data: tasaDia, isLoading} = useTasaDia();
  // const {isLoading} = useTasaDia();
  const {user} = useAuthStore();
  const userGerencia = user?.gerencia || null;
  const setSummary = useTicketLunchStore( state => state.setSummary );
  const setSelectedEmpleadosSummary = useTicketLunchStore( state => state.setSelectedEmpleadosSummary );

  const tasaDia = 119.67;
  const isLoading = false;





  const precioLlevar = 15;
  const precioCubierto = 20;

  useEffect(() => {
    if (!empleados || empleados.length === 0) {
      setEmpleados(empleadosData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goNext = () => {
    // Gather selected employees with relevant details
    const selectedEmpleados = empleados.filter( emp => emp.almuerzo || emp.para_llevar || emp.cubiertos || emp.autorizado || ( emp.almuerzos_autorizados && emp.almuerzos_autorizados.length > 0 ) );
    // Map to JSON with desired fields, including evento_especial
    const resumenEmpleados = selectedEmpleados.map( emp => ( {
      nombre: emp.nombre,
      apellido: emp.apellido,
      almuerzo: emp.almuerzo || false,
      para_llevar: emp.para_llevar || false,
      cubiertos: emp.cubiertos || false,
      autorizado: emp.autorizado || false,
      almuerzos_autorizados: emp.almuerzos_autorizados || [],
      evento_especial: emp.evento_especial || false
    } ) );

    setSelectedEmpleadosSummary( resumenEmpleados );
    // Guardar selección en localStorage
    localStorage.setItem('empleadosSeleccionados', JSON.stringify(empleados));
    localStorage.setItem('resumenEmpleados', JSON.stringify(resumenEmpleados));
    if (goToResumeTab) goToResumeTab();
    console.log( "Resumen de Empleados:", JSON.stringify( resumenEmpleados, null, 2 ) );
  }

  const filteredEmpleados = useMemo(() => {
    let base = userGerencia
      ? empleados.filter(emp => emp.gerencia === userGerencia || emp.invitado)
      : empleados.filter(emp => emp.invitado); // Si no hay gerencia, solo invitados
    if (search.trim() !== "") {
      const s = search.trim().toLowerCase();
      base = base.filter(emp =>
        (emp.nombre && emp.nombre.toLowerCase().includes(s)) ||
        (emp.apellido && emp.apellido.toLowerCase().includes(s))
      );
    }
    return base;
  }, [empleados, userGerencia, search]);

  const toggleEmpleadoField = useCallback((empleadoOriginal, field) => {
    setEmpleados(prevEmpleados => {
      const updated = prevEmpleados.map(emp =>
        emp.nombre === empleadoOriginal.nombre && emp.apellido === empleadoOriginal.apellido
          ? { ...emp, [field]: !emp[field] }
          : emp
      );
      localStorage.setItem('empleadosSeleccionados', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateAlmuerzosAutorizados = useCallback( ( empleadoOriginal, selectedAutorizados ) => {
    setEmpleados( prevEmpleados => {
      const updated = prevEmpleados.map( emp =>
        emp.nombre === empleadoOriginal.nombre && emp.apellido === empleadoOriginal.apellido
          ? {...emp, almuerzos_autorizados: selectedAutorizados}
          : emp
      );
      localStorage.setItem('empleadosSeleccionados', JSON.stringify(updated));
      return updated;
    });
  }, [] );

  useEffect( () => {
    const countAlmuerzos = empleados.filter( emp => emp.almuerzo ).length;
    const countAlmuerzosAutorizados = empleados.reduce( ( acc, emp ) => acc + ( emp.almuerzos_autorizados ? emp.almuerzos_autorizados.length : 0 ), 0 );
    const countParaLlevar = empleados.filter( emp => emp.para_llevar || emp.cubiertos ).length;
    const countCubiertos = empleados.filter( emp => emp.para_llevar || emp.cubiertos ).length;
    const totalPagar = empleados.reduce( ( acc, emp ) => {
      const almuerzoCount = emp.almuerzo ? 1 : 0;
      const almuerzosAutorizadosCount = emp.almuerzos_autorizados ? emp.almuerzos_autorizados.length : 0;
      const paraLlevarCount = emp.para_llevar ? 1 : 0;
      const cubiertosCount = emp.cubiertos ? 1 : 0;
      return acc + ( almuerzoCount + almuerzosAutorizadosCount ) * parseFloat( tasaDia || 0 ) + paraLlevarCount * 15 + cubiertosCount * 20;
    }, 0 );
    setSummary( {countAlmuerzos, countAlmuerzosAutorizados, countParaLlevar, countCubiertos, totalPagar} );
  }, [ empleados, tasaDia, setSummary ] );

  const toggleDropdown = ( rowId ) => {
    setDropdownOpen( prev => ( prev === rowId ? null : rowId ) );
  };

  const handleExtraToggle = ( rowOriginal, extraName ) => {
    const currentAutorizados = rowOriginal.almuerzos_autorizados || [];
    let newAutorizado;
    if ( currentAutorizados.includes( extraName ) ) {
      newAutorizado = currentAutorizados.filter( e => e !== extraName );
    } else {
      newAutorizado = [ ...currentAutorizados, extraName ];
    }
    updateAlmuerzosAutorizados( rowOriginal, newAutorizado );
  };

  const columns = useMemo(() => [
    {
      header: 'Evento Especial',
      accessorKey: 'evento_especial',
      cell: ({ row }) => {
        const checked = row.original.evento_especial || false;
        return (
          <div className="w-full flex justify-center items-center">
            <button
              type="button"
              aria-pressed={checked}
              onClick={() => toggleEmpleadoField(row.original, 'evento_especial')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        );
      },
    },
    {
      header: 'Nombre',
      accessorKey: 'nombre',
      cell: ( {row} ) => (
        <span className="text-gray-900 dark:text-gray-100">{row.getValue( 'nombre' )}</span>
      ),
    },
    {
      header: 'Apellido',
      accessorKey: 'apellido',
      cell: ( {row} ) => (
        <span className="text-gray-900 dark:text-gray-100">{row.getValue( 'apellido' )}</span>
      ),
    },
    {
      header: `Almuerzo Bs. ${ tasaDia }`,
      accessorKey: 'almuerzo',
      cell: ( {row} ) => {
        const checked = row.getValue( 'almuerzo' );
        const fullName = row.original.nombre + ' ' + row.original.apellido;
        const selectedInExtras = new Set();
        empleados.forEach( emp => {
          if ( emp.almuerzos_autorizados && emp !== row.original ) {
            emp.almuerzos_autorizados.forEach( name => selectedInExtras.add( name ) );
          }
        } );
        const isDisabled = selectedInExtras.has( fullName );
        return (
          <div className='w-full flex justify-center items-center'>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleEmpleadoField( row.original, 'almuerzo' )}
              disabled={isDisabled}
              className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </div>
        );
      }
    },
    {
      header: `Para llevar Bs. ${ precioLlevar }`,
      accessorKey: 'para_llevar',
      cell: ( {row} ) => {
        const checked = row.getValue( 'para_llevar' );
        const almuerzo = row.getValue( 'almuerzo' );
        return (
          <div className='w-full flex justify-center items-center'>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleEmpleadoField( row.original, 'para_llevar' )}
              disabled={!almuerzo}
              className="form-checkbox h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
            />
          </div>
        );
      }
    },
    {
      header: `Cubiertos Bs. ${ precioCubierto }`,
      accessorKey: 'cubiertos',
      cell: ( {row} ) => {
        const checked = row.getValue( 'cubiertos' );
        const almuerzo = row.getValue( 'almuerzo' );
        return (
          <div className='w-full flex justify-center items-center'>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleEmpleadoField( row.original, 'cubiertos' )}
              disabled={!almuerzo}
              className="form-checkbox h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
            />
          </div>
        );
      }
    },
    // Mostrar columnas de autorizado solo si no es invitado
    {
      header: 'Autorizado',
      accessorKey: 'autorizado',
      cell: ({ row }) => {
        if (row.original.invitado) return null;
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
      },
    },
    {
      header: 'Almuerzos Autorizados',
      accessorKey: 'almuerzos_autorizados',
      cell: ({ row }) => {
        if (row.original.invitado) return null;
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
      cell: ( {row} ) => {
        const almuerzo = row.getValue( 'almuerzo' ) ? 1 : 0;
        const almuerzosAutorizadosCount = ( row.getValue( 'almuerzos_autorizados' ) || [] ).length;
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
      cell: ( {row} ) => {
        if ( !tasaDia ) return '0.00';
        const almuerzoCount = row.getValue( 'almuerzo' ) ? 1 : 0;
        let paraLLevar = row.getValue( 'para_llevar' ) ? 1 : 0;
        paraLLevar = paraLLevar * precioLlevar;
        let cubiertos = row.getValue( 'cubiertos' ) ? 1 : 0;
        cubiertos = cubiertos * precioCubierto;
        const almuerzosAutorizadosCount = ( row.getValue( 'almuerzos_autorizados' ) || [] ).length;
        let totalMontoAlmuerzosAutorizados = almuerzosAutorizadosCount > 0 ? almuerzosAutorizadosCount * parseFloat( tasaDia ) + precioLlevar : 0;

        const preTotal = almuerzoCount * parseFloat( tasaDia ) + totalMontoAlmuerzosAutorizados + paraLLevar + cubiertos;
        const total = preTotal.toFixed( 2 );
        return (
          <div className='w-full flex justify-center items-center'>
            <span className="font-bold text-green-600 dark:text-green-400">Bs. {total}</span>
          </div>
        )
      },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [ empleados, dropdownOpen, toggleEmpleadoField, updateAlmuerzosAutorizados, tasaDia, userGerencia ] );

  const table = useReactTable( {
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
  } );

  return (
    <div className="w-full h-full mx-auto p-2 md:p-3 border-0 rounded-2xl flex flex-col items-center justify-start min-h-[90vh]">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">
        Gerencia {userGerencia}
      </h1>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando datos...</p>
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nombre o apellido..."
                className="border border-gray-300 rounded px-2 py-1 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <select
                value={pagination.pageSize}
                onChange={e => setPagination(p => ({ ...p, pageSize: Number(e.target.value), pageIndex: 0 }))}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
              </select>
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow w-full md:w-auto"
              onClick={() => setModalInvitadoOpen(true)}
            >
              Agregar Invitado
            </button>
          </div>
          <div className="overflow-x-auto bg-white dark:bg-gray-200 rounded-lg shadow-lg w-full">
            <table className="min-w-full">
              <thead>
                {table.getHeaderGroups().map( headerGroup => (
                  <tr key={headerGroup.id} className="bg-blue-600 dark:bg-blue-900 text-white">
                    {headerGroup.headers.map( column => (
                      <th
                        key={column.id}
                        className="px-2 py-2 text-left text-xs md:text-sm font-semibold cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
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
                      className={`${ index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900' } hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors`}
                    >
                      {row.getVisibleCells().map( cell => (
                        <td key={cell.id} className="px-2 py-2 text-xs md:text-sm">
                          {flexRender( cell.column.columnDef.cell, cell.getContext() )}
                          {cell.column.id === 'nombre' && isInvitado && (
                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-300 text-yellow-900 rounded font-bold">INVITADO</span>
                          )}
                        </td>
                      ) )}
                    </tr>
                  );
                })}
          <ModalAgregarInvitado
            isOpen={modalInvitadoOpen}
            onRequestClose={() => setModalInvitadoOpen(false)}
            onAddInvitado={handleAddInvitado}
          />
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col md:flex-row justify-between items-center w-full gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                Mostrando {table.getRowModel().rows.length} de {filteredEmpleados.length} empleados
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs md:text-sm"
              >
                Anterior
              </button>
              <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs md:text-sm"
              >
                Siguiente
              </button>
            </div>
          </div>
          <div className="flex justify-center w-full mt-4">
            <button
              onClick={goNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-base shadow"
            >
              Resumen y Pago
            </button>
          </div>
        </>
      )}
    </div>
  );
};