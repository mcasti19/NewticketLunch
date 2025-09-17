import React, {useState, useEffect, useMemo, useCallback} from 'react';
import ModalAgregarInvitado from './ModalAgregarInvitado';
import {useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel} from '@tanstack/react-table';
import {useAuthStore} from '../store/authStore';
import {useTicketLunchStore} from '../store/ticketLunchStore';
import {useGetEmployees} from '../hooks/useGetEmployees';
import {EmployeesTable} from "./EmployeesTable";
import Swal from 'sweetalert2';
import {EmployeesCards} from './EmployeesCards';
import {getExtras} from '../services/actions';
import {AutorizarSelector} from "./AutorizarSelector";
import {Spinner} from './Spinner';

// Utilidad para calcular resumen
function getSummary( employees, tasaDia ) {
  const countAlmuerzos = employees.filter( emp => emp.almuerzo ).length;
  const countAlmuerzosAutorizados = employees.filter( emp => emp.id_autorizado ).length;
  const countParaLlevar = employees.filter( emp => emp.para_llevar ).length;
  const countCubiertos = employees.filter( emp => emp.cubiertos ).length;

  const totalPagar = employees.reduce( ( acc, emp ) => {
    const almuerzoCount = emp.almuerzo ? 1 : 0;
    const paraLlevarCount = emp.para_llevar ? 1 : 0;
    const cubiertosCount = emp.cubiertos ? 1 : 0;
    const almuerzoAutorizadoCount = emp.id_autorizado ? 1 : 0;

    // El costo del almuerzo solo se aplica si el empleado lo marcó (almuerzo) o si se autorizó a alguien (id_autorizado)
    const costoAlmuerzos = ( almuerzoCount * parseFloat( tasaDia ) ) + ( almuerzoAutorizadoCount * parseFloat( tasaDia ) );
    const costoParaLlevar = paraLlevarCount * 15;
    const costoCubiertos = cubiertosCount * 20;

    return acc + costoAlmuerzos + costoParaLlevar + costoCubiertos;
  }, 0 );

  return {countAlmuerzos, countAlmuerzosAutorizados, countParaLlevar, countCubiertos, totalPagar};
}

// Utilidad para filtrar empleados
function filterEmployees( employees, search ) {
  if ( !search.trim() ) return employees;
  const s = search.trim().toLowerCase();
  return employees.filter( emp =>
    ( emp.first_name && emp.first_name.toLowerCase().includes( s ) ) ||
    ( emp.last_name && emp.last_name.toLowerCase().includes( s ) ) ||
    ( emp.cedula.includes( s ) )
  );
}

export const ContentSeleccion = ( {goToResumeTab} ) => {
  const {user} = useAuthStore();
  const userGerencia = user?.management?.management_name || null;
  // const idGerencia = user?.id_gerencia || user?.gerencia?.id_gerencia || null;
  const idGerencia = user?.id_management || null;
  const {employees, loading} = useGetEmployees( idGerencia );
  const [ employeeList, setEmployeeList ] = useState( [] );
  const [ modalInvitadoOpen, setModalInvitadoOpen ] = useState( false );
  const [ search, setSearch ] = useState( "" );
  const [ sorting, setSorting ] = useState( [] );
  const [ pagination, setPagination ] = useState( {pageIndex: 0, pageSize: 10} );
  const setSummary = useTicketLunchStore( state => state.setSummary );
  const setOrderOrigin = useTicketLunchStore( state => state.setOrderOrigin );
  const setSelectedEmpleadosSummary = useTicketLunchStore( state => state.setSelectedEmpleadosSummary );
  const setResumenEnabled = useTicketLunchStore( state => state.setResumenEnabled );
  const tasaDia = 100;
  const precioLlevar = 15;
  const precioCubierto = 5;


  useEffect( () => {
    getExtras();
  }, [] );

  // useEffect( () => {
  //   if ( !loading ) {
  //     // console.log( "EMPLEADOSsssss", employees );
  //     console.log( "USER", user );
  //     console.log( "ID GERENCIA", idGerencia );
  //   }
  // }, [ idGerencia, loading, user ] );

  useEffect( () => {
    if ( !loading && employees && employees.length > 0 ) {
      const storedSelections = localStorage.getItem( 'empleadosSeleccionados' );
      if ( storedSelections ) {
        const selections = JSON.parse( storedSelections );
        const selectionsMap = new Map( selections.map( emp => [ emp.cedula, emp ] ) );
        const mergedList = employees.map( emp => {
          const storedEmp = selectionsMap.get( emp.cedula );
          return {
            ...emp,
            almuerzo: storedEmp?.almuerzo || false,
            para_llevar: storedEmp?.para_llevar || false,
            cubiertos: storedEmp?.cubiertos || false,
            id_autorizado: storedEmp?.id_autorizado || null,
            evento_especial: storedEmp?.evento_especial || false,
          };
        } );
        const guests = selections.filter( emp => emp.invitado );
        const finalEmployeeList = [ ...mergedList, ...guests ];
        setEmployeeList( finalEmployeeList );
        // console.log( "employeeList: ", employeeList );
      } else {
        setEmployeeList( employees.map( emp => ( {...emp, id_autorizado: null, almuerzo: false, para_llevar: false, cubiertos: false, evento_especial: false} ) ) );
      }
    }
  }, [ employees, loading ] );

  useEffect( () => {
    setSummary( getSummary( employeeList, tasaDia ) );
  }, [ employeeList, tasaDia, setSummary ] );

  const filteredEmployees = useMemo( () => filterEmployees( employeeList, search ), [ employeeList, search ] );

  const handleAddGuest = useCallback( ( newGuest ) => {
    setEmployeeList( prev => {
      const updated = [ ...prev, {...newGuest, invitado: true, evento_especial: false, almuerzo: false, para_llevar: false, cubiertos: false, id_autorizado: null} ];
      return updated;
    } );
  }, [] );

  const handleToggleField = useCallback( ( employee, field ) => {
    setEmployeeList( prev => {
      const updated = prev.map( emp => {
        if ( emp.cedula === employee.cedula ) {
          let newState = {...emp, [ field ]: !emp[ field ]};
          if ( field === 'evento_especial' && !emp.evento_especial ) {
            newState.almuerzo = true;
          }
          if ( field === 'almuerzo' && !newState.almuerzo ) {
            newState.para_llevar = false;
            newState.cubiertos = false;
            newState.id_autorizado = null;
          }
          if ( field === 'para_llevar' && !newState.para_llevar ) {
            newState.id_autorizado = null;
          }
          return newState;
        }
        return emp;
      } );
      return updated;
    } );
  }, [] );

  const handleAutorizadoChange = useCallback( ( employee, newId ) => {
    setEmployeeList( prev => {
      const updated = prev.map( emp => {
        if ( emp.cedula === employee.cedula ) {
          return {...emp, id_autorizado: newId};
        }
        return emp;
      } );
      return updated;
    } );
  }, [] );

  const handleClearData = useCallback( () => {
    Swal.fire( {
      title: '¿Estás seguro?',
      text: "Se borrará toda la selección actual y no podrás revertirlo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar!',
      cancelButtonText: 'Cancelar'
    } ).then( ( result ) => {
      if ( result.isConfirmed ) {
        localStorage.removeItem( 'empleadosSeleccionados' );
        localStorage.removeItem( 'resumenEmpleados' );
        setEmployeeList( employees.map( emp => ( {...emp, id_autorizado: null, almuerzo: false, para_llevar: false, cubiertos: false, evento_especial: false} ) ) );
        Swal.fire(
          '¡Borrado!',
          'La selección ha sido limpiada.',
          'success'
        );
      }
    } );
  }, [ employees ] );

  const handleGoNext = () => {
    console.log( "GO NEXT" );

    const selectedEmployees = employeeList.filter( emp =>
      emp.almuerzo || emp.para_llevar || emp.cubiertos || emp.id_autorizado
    );

    setResumenEnabled( selectedEmployees.length > 0 );
    if ( selectedEmployees.length === 0 ) return;

    const cedulaToEmpleado = {};
    employeeList.forEach( emp => {
      cedulaToEmpleado[ emp.cedula ] = emp;
    } );

    const resumenEmpleados = selectedEmployees.map( emp => {
      const extras = [];
      if ( emp.para_llevar ) extras.push( 1 );
      if ( emp.cubiertos ) extras.push( 2 );

      const almuerzoCount = emp.almuerzo ? 1 : 0;
      const paraLlevarCount = emp.para_llevar ? 1 : 0;
      const cubiertosCount = emp.cubiertos ? 1 : 0;
      const almuerzoAutorizadoCount = emp.id_autorizado ? 1 : 0;
      const total_pagar = ( almuerzoCount * tasaDia ) + ( almuerzoAutorizadoCount * tasaDia ) + ( paraLlevarCount * precioLlevar ) + ( cubiertosCount * precioCubierto );

      let autoriza_a = '';
      if ( emp.id_autorizado ) {
        const autorizado = cedulaToEmpleado[ emp.id_autorizado ];
        if ( autorizado ) {
          autoriza_a = `${ autorizado.first_name || autorizado.nombre || '' } ${ autorizado.last_name || autorizado.apellido || '' }`.trim();
        }
      }
      let autorizado_por = '';
      const quienAutoriza = employeeList.find( e => ( e.id_autorizado === emp.cedula ) );
      if ( quienAutoriza ) {
        autorizado_por = `${ quienAutoriza.first_name || quienAutoriza.nombre || '' } ${ quienAutoriza.last_name || quienAutoriza.apellido || '' }`.trim();
      }

      let orderSumary = {
        nombre: emp.first_name || emp.nombre || '',
        apellido: emp.last_name || emp.apellido || '',
        cedula: emp.cedula,
        id_employee: emp.id_employee || emp.IdEmpleado || emp.id || '',
        almuerzo: emp.almuerzo || false,
        para_llevar: emp.para_llevar || false,
        cubiertos: emp.cubiertos || false,
        id_autorizado: emp.id_autorizado || null,
        evento_especial: emp.evento_especial || false,
        extras,
        total_pagar,
        autoriza_a,
        autorizado_por,
      };

      // console.log( "orderSumary", orderSumary );

      return orderSumary
    } );

    setSelectedEmpleadosSummary( resumenEmpleados );
    setOrderOrigin( 'seleccion' ); // Etiquetar el origen
    localStorage.setItem( 'empleadosSeleccionados', JSON.stringify( employeeList ) );
    localStorage.setItem( 'resumenEmpleados', JSON.stringify( resumenEmpleados ) );
    if ( goToResumeTab ) goToResumeTab();
  };

  const columns = useMemo( () => [
    {
      header: 'Evento Especial',
      accessorKey: 'evento_especial',
      cell: ( {row} ) => {
        const checked = row.original.evento_especial || false;
        const uniqueId = `eventoEspecial-${ row.original.cedula }-${ row.index }`;
        return (
          <div className="w-full flex justify-center items-center">
            <button
              id={uniqueId}
              type="button"
              aria-pressed={checked}
              onClick={() => handleToggleField( row.original, 'evento_especial' )}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${ checked ? 'bg-blue-600' : 'bg-gray-300' }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${ checked ? 'translate-x-6' : 'translate-x-1' }`}
              />
            </button>
          </div>
        );
      },
    },
    {
      header: 'Empleado',
      accessorKey: 'first_name',
      cell: ( {row} ) => <span className="text-gray-900 dark:text-gray-100 hover group-hover:text-white">
        {row.original.first_name}
      </span>,
    },
    {
      header: `Almuerzo Bs. ${ tasaDia }`,
      accessorKey: 'almuerzo',
      cell: ( {row} ) => {
        const checked = row.getValue( 'almuerzo' );
        const uniqueId = `almuerzo-${ row.original.cedula }-${ row.index }`
        return (
          <div className='w-full flex justify-center items-center'>
            <input
              id={uniqueId}
              type="checkbox"
              checked={checked}
              onChange={() => handleToggleField( row.original, 'almuerzo' )}
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
        const uniqueId = `ToGo-${ row.original.cedula }-${ row.index }`;
        return (
          <div className='w-full flex justify-center items-center'>
            <input
              id={uniqueId}
              type="checkbox"
              checked={checked}
              onChange={() => handleToggleField( row.original, 'para_llevar' )}
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
        const uniqueId = `cubiertos-${ row.original.cedula }-${ row.index }`;
        return (
          <div className='w-full flex justify-center items-center'>
            <input
              id={uniqueId}
              type="checkbox"
              checked={checked}
              onChange={() => handleToggleField( row.original, 'cubiertos' )}
              disabled={!almuerzo}
              className="form-checkbox h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
            />
          </div>
        );
      }
    },
    {
      header: 'Persona Autorizada',
      accessorKey: 'id_autorizado',
      cell: ( {row} ) => {
        const selectedId = row.getValue( 'id_autorizado' );
        const paraLlevar = row.original.para_llevar;
        const isSelectedBySomeoneElse = employeeList.some( emp => emp.id_autorizado === row.original.cedula && emp.cedula !== row.original.cedula );
        const uniqueId = `authorized-${ row.original.cedula }-${ row.index }`;

        return (
          <AutorizarSelector
            uniqueId={uniqueId}
            selectedId={selectedId}
            handleAutorizadoChange={handleAutorizadoChange}
            paraLlevar={paraLlevar}
            isSelectedBySomeoneElse={isSelectedBySomeoneElse}
            employeeList={employeeList}
            user={user}
            row={row}
          />


        );
      },
    },
    {
      header: 'Total a Pagar (Bs.)',
      accessorKey: 'total_pagar',
      cell: ( {row} ) => {
        if ( !tasaDia ) return '0.00';
        const almuerzoCount = row.getValue( 'almuerzo' ) ? 1 : 0;
        const paraLlevarCount = row.getValue( 'para_llevar' ) ? 1 : 0;
        const cubiertosCount = row.getValue( 'cubiertos' ) ? 2 : 0;
        const almuerzoAutorizadoCount = row.getValue( 'id_autorizado' ) ? 1 : 0;
        const total = ( almuerzoCount * parseFloat( tasaDia ) ) +
          ( almuerzoAutorizadoCount * parseFloat( tasaDia ) ) +
          ( paraLlevarCount * precioLlevar ) +
          ( cubiertosCount * precioCubierto );

        return (
          <div className='w-full flex justify-end items-center'>
            <span className="font-bold text-green-800 dark:text-green-400 group-hover:text-white dark:group-hover:text-gray-100">Bs. {total.toFixed( 2 )}</span>
          </div>
        );
      },
    },
  ], [ handleToggleField, employeeList, handleAutorizadoChange, user ] );

  const table = useReactTable( {
    data: filteredEmployees,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {sorting, pagination},
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  } );

  if ( loading ) {
    return (
      <div className="text-center py-8 flex justify-center items-center w-full h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full h-full mx-auto p-2 md:p-3 border-0 rounded-2xl flex flex-col items-center justify-start min-h-[90vh]">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">
        {userGerencia}
      </h1>
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <div className="hidden md:flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            id='findByName'
            type="text"
            value={search}
            onChange={e => setSearch( e.target.value )}
            placeholder="Buscar por nombre o apellido..."
            className="border border-gray-300 rounded px-2 py-1 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 dark:placeholder:text-gray-400 dark:text-amber-300"
          />
          <select
            id='pageSelector'
            value={pagination.pageSize}
            onChange={e => setPagination( p => ( {...p, pageSize: Number( e.target.value ), pageIndex: 0} ) )}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500 dark:text-gray-200 dark:bg-black"
          >
            <option value={5} >5 por página</option>
            <option value={10} >10 por página</option>
            <option value={20} >20 por página</option>
          </select>
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow w-full md:w-auto"
            onClick={() => setModalInvitadoOpen( true )}
          >
            Agregar Invitado
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded shadow w-full md:w-auto"
            onClick={handleClearData}
          >
            Limpiar Selección
          </button>
        </div>
      </div>

      <EmployeesTable
        table={table}
        modalInvitadoOpen={modalInvitadoOpen}
        setModalInvitadoOpen={setModalInvitadoOpen}
        handleAddInvitado={handleAddGuest}
        employeeList={employeeList}
        ModalAgregarInvitado={ModalAgregarInvitado}
      />

      <div className='md:hidden scroll-auto'>
        <EmployeesCards
          userGerencia={userGerencia}
          modalInvitadoOpen={modalInvitadoOpen}
          setModalInvitadoOpen={setModalInvitadoOpen}
          handleAddInvitado={handleAddGuest}
          employeeList={employeeList}
          ModalAgregarInvitado={ModalAgregarInvitado}
          goToResumeTab={goToResumeTab}
          tasaDia={tasaDia}
          precioLlevar={precioLlevar}
          precioCubierto={precioCubierto}
          handleToggleField={handleToggleField}
          handleAutorizadoChange={handleAutorizadoChange}
        />
      </div>

      <div className="hidden md:flex mt-4  flex-col md:flex-row justify-between items-center w-full gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
            Mostrando {table.getRowModel().rows.length} de {filteredEmployees.length} empleados
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
        {( () => {
          const selectedEmployees = employeeList.filter( emp =>
            emp.almuerzo || emp.para_llevar || emp.cubiertos || emp.id_autorizado
          );
          const isDisabled = selectedEmployees.length === 0;
          return (
            <button
              onClick={handleGoNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-base shadow"
              disabled={isDisabled}
              title={isDisabled ? 'Debe seleccionar al menos 1 empleado primero' : ''}
            >
              Resumen y Pago
            </button>
          );
        } )()}
      </div>
    </div>
  );
};