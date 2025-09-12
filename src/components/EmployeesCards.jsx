import { EmployeeCard } from './EmployeeCard';
import React from 'react';
import { useEmployeesCardsLogic } from '../hooks/useEmployeesCardsLogic';

export const EmployeesCards = ({
    userGerencia,
    employeeList,
    tasaDia,
    precioLlevar,
    precioCubierto,
    handleToggleField,
    handleAutorizadoChange,
}) => {
    const {
        search,
        handleSearchChange,
        employeesToDisplay,
        filteredEmployees,
        loading,
    } = useEmployeesCardsLogic(employeeList);


    const handleFieldToggle = React.useCallback((emp, field) => {
        handleToggleField(emp, field);
    }, [handleToggleField]);

    const handleAuthorizedChange = React.useCallback((emp, newId) => {
        handleAutorizadoChange(emp, newId);
    }, [handleAutorizadoChange]);

    // Mantener la lógica de getOtherEmployees aquí, ya que depende de employeesToDisplay
    const getOtherEmployees = React.useMemo(() => {
        return employeeList.filter(other =>
            (other.id_management || other.id_gerencia) === (employeeList[0]?.id_management || employeeList[0]?.id_gerencia) &&
            other.cedula !== employeesToDisplay.cedula
        );
    }, [employeeList, employeesToDisplay]);

    return (
        <>
            {/* <h1 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">{userGerencia}</h1> */}
            <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Buscar por nombre o apellido..."
                className="border border-gray-300 rounded px-2 py-1 text-sm w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="grid grid-cols-1 gap-4 pb-24 overflow-y-auto" style={{maxHeight: 'calc(100vh - 320px)'}}>
                {employeesToDisplay.length > 0 ? (
                    <>
                        {employeesToDisplay.map((emp, idx) => (
                            <EmployeeCard
                                key={emp.cedula || idx}
                                emp={emp}
                                idx={idx}
                                handleFieldToggle={handleFieldToggle}
                                handleAuthorizedChange={handleAuthorizedChange}
                                tasaDia={tasaDia}
                                precioLlevar={precioLlevar}
                                getOtherEmployees={getOtherEmployees}
                                precioCubierto={precioCubierto}
                            />
                        ))}
                        {employeesToDisplay.length < filteredEmployees.length && (
                            <>
                                <div id="sentinel" className="h-1 bg-transparent"></div>
                                {loading && (
                                    <div className="flex justify-center py-4">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <div className="text-center text-gray-500 mt-4">
                        No se encontraron empleados con ese nombre.
                    </div>
                )}
            </div>
            {/* <div className="fixed bottom-0 left-0 w-full max-w-3xl mx-auto px-4 pb-4 bg-gradient-to-t from-blue-100/80 via-white/80 to-transparent z-20">
                <button
                    onClick={goToResumeTab}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
                >
                    Resumen y Pago
                </button>
            </div> */}
        </>
    );
}