import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {useReactTable, getCoreRowModel, flexRender} from '@tanstack/react-table';
// import gerencias from "../data/mockDataGerencias.json";
import empleadosData from "../data/mockDataEmpleados.json";
import {useAuthStore} from '../store/authStore';
import {useTicketLunchStore} from '../store/ticketLunchStore';
import {useTasaDia} from '../hooks/useTasaDia';

export const ContentSeleccion = () => {
  const [ empleados, setEmpleados ] = useState( [] );
  const [ dropdownOpen, setDropdownOpen ] = useState( null ); // track open dropdown by row id

  // const {tasaDia} = useTasaDia();

  const {
    data: tasaDia,
    // error,
    isLoading,
  } = useTasaDia();

  // Import and use global store to update summary
  const setSummary = useTicketLunchStore( state => state.setSummary );

  // const user = useAuthStore( state => state.user );
  const {user} = useAuthStore();
  const userGerencia = user?.gerencia || null;

  const precioLlevar = 15
  const precioCubierto = 20

  useEffect( () => {
    console.log( tasaDia );

    setEmpleados( empleadosData );
    console.log( empleadosData );

  }, [ tasaDia ] );

  // We will filter empleados by authenticated user's gerencia
  const filteredEmpleados = useMemo( () => {
    return userGerencia
      ? empleados.filter( emp => emp.gerencia === userGerencia )
      : [];
  }, [ empleados, userGerencia ] );

  const toggleEmpleadoField = useCallback( ( empleadoOriginal, field ) => {
    setEmpleados( prevEmpleados =>
      prevEmpleados.map( emp =>
        emp.nombre === empleadoOriginal.nombre && emp.apellido === empleadoOriginal.apellido
          ? {...emp, [ field ]: !emp[ field ]}
          : emp
      )
    );
  }, [] );

  const updateAlmuerzosAutorizados = useCallback( ( empleadoOriginal, selectedAutorizados ) => {
    setEmpleados( prevEmpleados =>
      prevEmpleados.map( emp =>
        emp.nombre === empleadoOriginal.nombre && emp.apellido === empleadoOriginal.apellido
          ? {...emp, almuerzos_autorizados: selectedAutorizados}
          : emp
      )
    );
  }, [] );

  // Update summary in global store whenever empleados state changes
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
    setSummary( {countAlmuerzos, countAlmuerzosAutorizados: countAlmuerzosAutorizados, countParaLlevar, countCubiertos, totalPagar} );
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

  const columns = useMemo( () => [
    {
      header: 'Nombre',
      accessorKey: 'nombre',
    },
    {
      header: 'Apellido',
      accessorKey: 'apellido',
    },
    {
      header: `Almuerzo Bs. ${ tasaDia }`,
      accessorKey: 'almuerzo',
      cell: ( {row} ) => {
        const checked = row.getValue( 'almuerzo' );
        const fullName = row.original.nombre + ' ' + row.original.apellido;

        // Compute all selected employees in almuerzos_autorizados except current row
        const selectedInExtras = new Set();
        empleados.forEach( emp => {
          if ( emp.almuerzos_autorizados && emp !== row.original ) {
            emp.almuerzos_autorizados.forEach( name => selectedInExtras.add( name ) );
          }
        } );

        // Disable checkbox if employee is selected in almuerzos_autorizados in another row
        const isDisabled = selectedInExtras.has( fullName );

        return (
          <div className='w-full flex justify-center items-center'>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleEmpleadoField( row.original, 'almuerzo' )}
              disabled={isDisabled}
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
            />
          </div>
        );
      }
    },
    {
      header: 'Autorizado',
      accessorKey: 'autorizado',

      cell: ( {row} ) => {
        const checked = row.getValue( 'autorizado' );
        const fullName = row.original.nombre + ' ' + row.original.apellido;

        // Compute all selected employees in almuerzos_autorizados except current row
        const selectedInExtras = new Set();
        empleados.forEach( emp => {
          if ( emp.almuerzos_autorizados && emp !== row.original ) {
            emp.almuerzos_autorizados.forEach( name => selectedInExtras.add( name ) );
          }
        } );

        // Disable checkbox if employee is selected in almuerzos_autorizados in another row
        const isDisabled = selectedInExtras.has( fullName );

        return (
          <div className='w-full flex justify-center items-center'>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleEmpleadoField( row.original, 'autorizado' )}
              disabled={isDisabled}
            />
          </div>
        );
      }
    },
    {
      header: 'Almuerzos Autorizados',
      accessorKey: 'almuerzos_autorizados',
      cell: ( {row} ) => {
        const selectedAutorizados = row.getValue( 'almuerzos_autorizados' ) || [];
        const rowId = row.id;
        const autorizado = row.getValue( 'autorizado' );
        return (
          <div className="relative">
            <div
              className={`bg-slate-700 text-white p-1 rounded select-none ${ autorizado ? 'cursor-pointer' : 'cursor-not-allowed opacity-50' }`}
              onClick={() => autorizado && toggleDropdown( rowId )}
            >
              {selectedAutorizados.length > 0 ? selectedAutorizados.join( ', ' ) : 'Seleccione'}
            </div>
            {dropdownOpen === rowId && autorizado && (
              <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-auto w-48 text-black">
                {( () => {
                  // Get all selected employees in almuerzos_autorizados except for current row
                  const selectedInOtherRows = new Set();
                  empleados.forEach( emp => {
                    if ( emp.almuerzos_autorizados && emp !== row.original ) {
                      emp.almuerzos_autorizados.forEach( name => selectedInOtherRows.add( name ) );
                    }
                  } );
                  return empleados
                    .filter( emp => {
                      const fullName = emp.nombre + ' ' + emp.apellido;
                      // Filter to only employees in user's gerencia, exclude current row employee, and exclude selected in other rows except current row's selected
                      return emp.gerencia === userGerencia &&
                        fullName !== ( row.original.nombre + ' ' + row.original.apellido ) &&
                        ( !selectedInOtherRows.has( fullName ) || selectedAutorizados.includes( fullName ) );
                    } )
                    .map( emp => {
                      const fullName = emp.nombre + ' ' + emp.apellido;
                      const checked = selectedAutorizados.includes( fullName );
                      return (
                        <label key={fullName} className="flex items-center px-2 py-1 hover:bg-gray-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleExtraToggle( row.original, fullName )}
                            className="mr-2"
                            disabled={!autorizado}
                          />
                          {fullName}
                        </label>
                      );
                    } );
                } )()}
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
            {almuerzo + almuerzosAutorizadosCount}
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
        const total = preTotal.toFixed( 2 )
        return (
          <div className='w-full flex justify-center items-center'>
            {total}
          </div>
        )
      },
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [ empleados, dropdownOpen, toggleEmpleadoField, updateAlmuerzosAutorizados, tasaDia ] );


  const table = useReactTable( {
    data: filteredEmpleados,
    columns,
    getCoreRowModel: getCoreRowModel(),
  } );

  return (
    <div>
      <div className="hidden md:flex overflow-auto h-full w-full">
        <table className="min-w-full border">
          <caption className="text-lg font-semibold mb-2">Empleados, Gerencia {userGerencia}</caption>
          <thead>
            {table.getHeaderGroups().map( headerGroup => (
              <tr key={headerGroup.id} className="bg-gray-900 text-md">
                {headerGroup.headers.map( column => (
                  <th key={column.id} className="border px-4 py-2">
                    {flexRender( column.column.columnDef.header, column.getContext() )}
                  </th>
                ) )}
              </tr>
            ) )}
          </thead>
          {
            isLoading
              ? <h1>Cargando</h1>
              :
              ( <tbody className='bg-blue-950'>
                {table.getRowModel().rows.map( row => (
                  <tr key={row.id} className="hover:bg-gray-900">
                    {row.getVisibleCells().map( cell => (
                      <td key={cell.id}
                        className="border px-4 py-2">{
                          flexRender( cell.column.columnDef.cell, cell.getContext() )
                        }
                      </td>
                    ) )}
                  </tr>
                ) )}
              </tbody> )
          }
        </table>
      </div>
    </div>
  );
};