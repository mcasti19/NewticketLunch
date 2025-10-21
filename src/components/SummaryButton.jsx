export const SummaryButton = ({ employeeList, onClick }) => {
    const selectedEmployees = employeeList.filter(emp =>
        emp.almuerzo || emp.para_llevar || emp.cubiertos || emp.id_autorizado
    );
    const isDisabled = selectedEmployees.length === 0;

    return (
        <div className="flex justify-center w-full mt-4">
            <button
                onClick={onClick}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-base shadow"
                disabled={isDisabled}
                title={isDisabled ? 'Debe seleccionar al menos 1 empleado primero' : 'Ir al resumen y pago'}
            >
                Resumen y Pago
            </button>
        </div>
    );
};