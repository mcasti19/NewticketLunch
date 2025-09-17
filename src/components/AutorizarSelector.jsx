/* eslint-disable react-hooks/rules-of-hooks */
import React, {useMemo} from 'react';
import {useAuthStore} from '../store/authStore';


export const AutorizarSelector = ( {
    // Props para ContentMiTicket (vista individual)
    onSelect,
    selectedAutorizado,
    loading,
    // Props para ContentSeleccion (la tabla)
    row,
    handleAutorizadoChange,
    paraLlevar,
    isSelectedBySomeoneElse,
    employeeList
} ) => {
    const {user} = useAuthStore();
    // Lógica para el selector en la tabla (ContentSeleccion)
    if ( row && handleAutorizadoChange && employeeList ) {
        const uniqueId = `autorizar-select-${ row.original.cedula }`;
        const selectedId = row.original.id_autorizado;

        const employeesForSelector = useMemo( () => {
            if ( !employeeList ) return [];
            return employeeList.filter( emp => emp.id_gerencia === user?.id_gerencia && emp.cedula !== row.original.cedula );
        }, [ employeeList, user, row ] );

        return (
            <select
                id={uniqueId}
                value={selectedId || ''}
                onChange={e => handleAutorizadoChange( row.original, e.target.value || null )}
                disabled={!paraLlevar || isSelectedBySomeoneElse}
                className={`px-2 py-1 text-sm rounded-md border focus:outline-none focus:ring-2
                    ${ !paraLlevar || isSelectedBySomeoneElse ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600' }`}
            >
                <option value="">Seleccione...</option>
                {employeesForSelector.map( emp => {
                    const isUnavailable = employeeList.some( otherEmp => otherEmp.id_autorizado === emp.cedula && otherEmp.cedula !== row.original.cedula );
                    const hasAuthorizedSomeone = emp.id_autorizado;
                    return (
                        <option
                            key={emp.cedula}
                            value={emp.cedula}
                            disabled={isUnavailable || hasAuthorizedSomeone}
                        >
                            {emp.first_name}
                        </option>
                    );
                } )}
            </select>
        );
    }

    // Lógica para el selector en la vista individual (ContentMiTicket)
    const filteredEmployees = useMemo( () => {
        if ( loading || !employeeList ) {
            return [];
        }
        return employeeList.filter(
            emp => emp.cedula !== user?.cedula && emp.id_gerencia === user?.id_gerencia
        );
    }, [ employeeList, loading, user ] );

    return (
        <div className="bg-gray-700 p-4 rounded-lg flex flex-col shadow-md">
            <select
                id="autorizar-select"
                value={selectedAutorizado?.cedula || ''}
                onChange={( e ) => {
                    const selectedId = e.target.value;
                    const selectedEmp = selectedId
                        ? filteredEmployees.find( emp => emp.cedula === selectedId )
                        : null;
                    onSelect( selectedEmp );
                }}
                className="w-full px-3 py-2 text-white bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                disabled={loading}
            >
                <option value="">
                    {loading ? 'Cargando empleados...' : 'Seleccione...'}
                </option>
                {filteredEmployees.map( emp => (
                    <option key={emp.cedula} value={emp.cedula}>
                        {emp.first_name} {emp.last_name}
                    </option>
                ) )}
            </select>
            {selectedAutorizado && (
                <p className="text-sm text-gray-400 mt-2">
                    Autorizado: **{selectedAutorizado.first_name} {selectedAutorizado.last_name}**
                </p>
            )}
        </div>
    );
};