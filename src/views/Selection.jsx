import {useState, useMemo} from 'react';
import {useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel} from '@tanstack/react-table';

import {useAuthStore} from '../store/authStore.js';
import {useTicketLunchStore} from '../store/ticketLunchStore.js';
import {useGetEmployees} from '../hooks/useGetEmployees.js';
import {useEmployeeSelection} from '../hooks/useEmployeeSelection.js';

import {buildSelectedEmployees, buildResumen} from '../utils/orderUtils.js';
import {getSelectionColumns} from '../utils/tableColumns.jsx';
// import {  } from '../components/TableColumns.jsx';

import ModalAgregarInvitado from '../components/ModalAgregarInvitado.jsx';
import {EmployeesTable} from "../components/EmployeesTable.jsx";
import {EmployeesCards} from '../components/EmployeesCards.jsx';
import {Spinner} from '../components/Spinner.jsx';
import {SelectionToolbar} from '../components/SelectionToolbar.jsx';
import {TablePagination} from '../components/TablePagination.jsx';
import {SummaryButton} from '../components/SummaryButton.jsx';

export const Selection = ( {goToResumeTab} ) => {
    const {user} = useAuthStore();
    const {employees, loading} = useGetEmployees();
    const userGerencia = user?.employees?.management.management_name || null;

    const {
        employeeList,
        filteredEmployees,
        search,
        tasaDia,
        setSearch,
        handleAddGuest,
        handleToggleField,
        handleAutorizadoChange,
        handleClearData
    } = useEmployeeSelection( employees, loading );

    const [ modalInvitadoOpen, setModalInvitadoOpen ] = useState( false );
    const [ sorting, setSorting ] = useState( [] );
    const [ pagination, setPagination ] = useState( {pageIndex: 0, pageSize: 10} );

    const setSummary = useTicketLunchStore( state => state.setSummary );
    const setOrderOrigin = useTicketLunchStore( state => state.setOrderOrigin );
    const setSelectedEmpleadosSummary = useTicketLunchStore( state => state.setSelectedEmpleadosSummary );
    const setResumenEnabled = useTicketLunchStore( state => state.setResumenEnabled );

    const precioLlevar = 15;
    const precioCubierto = 5;

    const handleGoNext = () => {
        const selectedEmployees = employeeList.filter( emp =>
            emp.almuerzo || emp.para_llevar || emp.cubiertos || emp.id_autorizado
        );
        setResumenEnabled( selectedEmployees.length > 0 );
        if ( selectedEmployees.length === 0 ) return;

        const empleados = buildSelectedEmployees( {empleados: selectedEmployees, tipo: 'seleccion'} );
        const resumen = buildResumen( empleados, tasaDia, precioLlevar, precioCubierto );

        setSelectedEmpleadosSummary( empleados );
        setSummary( resumen );
        setOrderOrigin( 'seleccion' );

        localStorage.setItem( 'empleadosSeleccionados', JSON.stringify( employeeList ) );
        localStorage.setItem( 'resumenEmpleados', JSON.stringify( empleados ) );

        if ( goToResumeTab ) goToResumeTab();
    };

    const columns = useMemo( () => getSelectionColumns( {
        handleToggleField,
        handleAutorizadoChange,
        employeeList,
        user,
        tasaDia,
        precioLlevar,
        precioCubierto
    } ), [ handleToggleField, handleAutorizadoChange, employeeList, user, tasaDia, precioLlevar, precioCubierto ] );

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

            <SelectionToolbar
                search={search}
                onSearchChange={setSearch}
                pageSize={pagination.pageSize}
                onPageSizeChange={( size ) => setPagination( p => ( {...p, pageSize: size, pageIndex: 0} ) )}
                onAddGuest={() => setModalInvitadoOpen( true )}
                onClearData={handleClearData}
            />

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

            <TablePagination table={table} filteredEmployees={filteredEmployees} />

            <SummaryButton employeeList={employeeList} onClick={handleGoNext} />
        </div>
    );
};