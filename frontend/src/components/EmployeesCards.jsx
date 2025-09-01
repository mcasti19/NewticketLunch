import React, {useState} from 'react'

export const EmployeesCards = ( {
    userGerencia,
    ModalAgregarInvitado,
    modalInvitadoOpen,
    setModalInvitadoOpen,
    handleAddInvitado,
    employeeList,
    goToResumeTab,
    tasaDia,
    precioLlevar,
    precioCubierto
} ) => {
    const [ dropdownOpen, setDropdownOpen ] = useState( null );
    
    console.log(employeeList);
    
    return (
        <div className="md:hidden w-full max-w-3xl mx-auto bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:bg-gray-950 rounded-3xl shadow-xl p-4 flex flex-col gap-4 min-h-[90vh] relative">
            <h1 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">{userGerencia}</h1>
            <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow w-full mb-2"
                onClick={() => setModalInvitadoOpen( true )}
            >
                Agregar Invitado
            </button>
            <ModalAgregarInvitado
                isOpen={modalInvitadoOpen}
                onRequestClose={() => setModalInvitadoOpen( false )}
                onAddInvitado={handleAddInvitado}
            />
            <div className="grid grid-cols-1 gap-4 pb-24">
                {employeeList.map( ( empleado ) => (
                    <div key={empleado.nombre + empleado.apellido} className="bg-white/90 rounded-2xl shadow-md border border-blue-100 p-4 flex flex-col gap-2 relative">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-blue-700">{empleado.nombre} {empleado.apellido}</h3>
                            {empleado.invitado && (
                                <span className="ml-2 px-2 py-1 text-xs bg-yellow-300 text-yellow-900 rounded font-bold">INVITADO</span>
                            )}
                        </div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={empleado.almuerzo}
                                onChange={() => toggleEmpleadoField( empleado, 'almuerzo' )}
                                className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span>Almuerzo: <span className="font-semibold">Bs. {tasaDia}</span></span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={empleado.para_llevar}
                                onChange={() => toggleEmpleadoField( empleado, 'para_llevar' )}
                                disabled={!empleado.almuerzo}
                                className="form-checkbox h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                            />
                            <span>Para llevar: <span className="font-semibold">Bs. {precioLlevar}</span></span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={empleado.cubiertos}
                                onChange={() => toggleEmpleadoField( empleado, 'cubiertos' )}
                                disabled={!empleado.almuerzo}
                                className="form-checkbox h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                            />
                            <span>Cubiertos: <span className="font-semibold">Bs. {precioCubierto}</span></span>
                        </label>
                        {!empleado.invitado && (
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={empleado.autorizado}
                                    onChange={() => toggleEmpleadoField( empleado, 'autorizado' )}
                                    className="form-checkbox h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                                />
                                <span>Autorizado</span>
                            </label>
                        )}
                        {!empleado.invitado && (
                            <div className="relative mt-2">
                                <div
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
                    ${ empleado.autorizado
                                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                            : 'bg-gray-100 text-gray-500 cursor-not-allowed' }`}
                                    onClick={() => empleado.autorizado && setDropdownOpen( dropdownOpen === empleado.nombre ? null : empleado.nombre )}
                                >
                                    {empleado.almuerzos_autorizados && empleado.almuerzos_autorizados.length > 0
                                        ? empleado.almuerzos_autorizados.join( ', ' )
                                        : 'Seleccione'}
                                </div>
                                {dropdownOpen === empleado.nombre && empleado.autorizado && (
                                    <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-auto w-48 text-black">
                                        {empleados
                                            .filter( emp => emp.gerencia === userGerencia && emp !== empleado )
                                            .map( emp => {
                                                const fullName = emp.nombre + ' ' + emp.apellido;
                                                const checked = empleado.almuerzos_autorizados.includes( fullName );
                                                return (
                                                    <label key={fullName} className="flex items-center px-2 py-1 hover:bg-gray-200 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={() => {
                                                                const newAutorizados = checked
                                                                    ? empleado.almuerzos_autorizados.filter( name => name !== fullName )
                                                                    : [ ...empleado.almuerzos_autorizados, fullName ];
                                                                updateAlmuerzosAutorizados( empleado, newAutorizados );
                                                            }}
                                                            className="mr-2"
                                                        />
                                                        {fullName}
                                                    </label>
                                                );
                                            } )}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex flex-col gap-1 mt-2">
                            <span className="text-sm font-medium text-blue-700">Total Almuerzos: <span className="font-bold">{empleado.almuerzo ? 1 : 0} + {( empleado.almuerzos_autorizados || [] ).length}</span></span>
                            <span className="text-sm font-medium text-green-700">Total a Pagar (Bs.): <span className="font-bold">{
                                ( ( empleado.almuerzo ? 1 : 0 ) * parseFloat( tasaDia || 0 ) +
                                    ( empleado.almuerzos_autorizados || [] ).length * parseFloat( tasaDia || 0 ) +
                                    ( empleado.para_llevar ? precioLlevar : 0 ) +
                                    ( empleado.cubiertos ? precioCubierto : 0 ) ).toFixed( 2 )
                            }</span></span>
                        </div>
                    </div>
                ) )}
            </div>
            <div className="fixed bottom-0 left-0 w-full max-w-3xl mx-auto px-4 pb-4 bg-gradient-to-t from-blue-100/80 via-white/80 to-transparent z-20">
                <button
                    onClick={goToResumeTab}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
                >
                    Resumen y Pago
                </button>
            </div>
        </div>
    );
}
