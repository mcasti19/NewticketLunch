import { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useTicketLunchStore } from '../store/ticketLunchStore';

// --- Helper Functions --- //

function getSummary(employees, tasaDia) {
    const countAlmuerzos = employees.filter(emp => emp.almuerzo).length;
    const countAlmuerzosAutorizados = employees.filter(emp => emp.id_autorizado).length;
    const countParaLlevar = employees.filter(emp => emp.para_llevar).length;
    const countCubiertos = employees.filter(emp => emp.cubiertos).length;

    const totalPagar = employees.reduce((acc, emp) => {
        const almuerzoCount = emp.almuerzo ? 1 : 0;
        const paraLlevarCount = emp.para_llevar ? 1 : 0;
        const cubiertosCount = emp.cubiertos ? 1 : 0;
        const almuerzoAutorizadoCount = emp.id_autorizado ? 1 : 0;

        const costoAlmuerzos = (almuerzoCount * parseFloat(tasaDia)) + (almuerzoAutorizadoCount * parseFloat(tasaDia));
        const costoParaLlevar = paraLlevarCount * 15;
        const costoCubiertos = cubiertosCount * 20;

        return acc + costoAlmuerzos + costoParaLlevar + costoCubiertos;
    }, 0);

    return { countAlmuerzos, countAlmuerzosAutorizados, countParaLlevar, countCubiertos, totalPagar };
}

function filterEmployees(employees, search) {
    if (!search.trim()) return employees;
    const s = search.trim().toLowerCase();
    return employees.filter(emp =>
        (emp.fullName && emp.fullName.toLowerCase().includes(s)) ||
        (emp.cedula && emp.cedula.includes(s))
    );
}

// --- Custom Hook --- //

export const useEmployeeSelection = (initialEmployees, loading) => {
    const [employeeList, setEmployeeList] = useState([]);
    const [search, setSearch] = useState("");
    const setSummary = useTicketLunchStore(state => state.setSummary);
    const tasaDia = 100; // This could be a prop or from a store if it's dynamic

    useEffect(() => {
        if (!loading && initialEmployees && initialEmployees.length > 0) {
            const storedSelections = localStorage.getItem('empleadosSeleccionados');
            if (storedSelections) {
                const selections = JSON.parse(storedSelections);
                const selectionsMap = new Map(selections.map(emp => [emp.cedula, emp]));
                const mergedList = initialEmployees.map(emp => {
                    const storedEmp = selectionsMap.get(emp.cedula);
                    return {
                        ...emp,
                        almuerzo: storedEmp?.almuerzo || false,
                        para_llevar: storedEmp?.para_llevar || false,
                        cubiertos: storedEmp?.cubiertos || false,
                        id_autorizado: storedEmp?.id_autorizado || null,
                        evento_especial: storedEmp?.evento_especial || false,
                    };
                });
                const guests = selections.filter(emp => emp.invitado);
                setEmployeeList([...mergedList, ...guests]);
            } else {
                setEmployeeList(initialEmployees.map(emp => ({ ...emp, id_autorizado: null, almuerzo: false, para_llevar: false, cubiertos: false, evento_especial: false })));
            }
        }
    }, [initialEmployees, loading]);

    useEffect(() => {
        setSummary(getSummary(employeeList, tasaDia));
    }, [employeeList, tasaDia, setSummary]);

    const filteredEmployees = useMemo(() => filterEmployees(employeeList, search), [employeeList, search]);

    const handleAddGuest = useCallback((newGuest) => {
        setEmployeeList(prev => [...prev, { ...newGuest, invitado: true, evento_especial: false, almuerzo: false, para_llevar: false, cubiertos: false, id_autorizado: null }]);
    }, []);

    const handleToggleField = useCallback((employee, field) => {
        setEmployeeList(prev => prev.map(emp => {
            if (emp.cedula === employee.cedula) {
                let newState = { ...emp, [field]: !emp[field] };
                if (field === 'evento_especial' && !emp.evento_especial) newState.almuerzo = true;
                if (field === 'almuerzo' && !newState.almuerzo) {
                    newState.para_llevar = false;
                    newState.cubiertos = false;
                    newState.id_autorizado = null;
                }
                if (field === 'para_llevar' && !newState.para_llevar) newState.id_autorizado = null;
                return newState;
            }
            return emp;
        }));
    }, []);

    const handleAutorizadoChange = useCallback((employee, newId) => {
        setEmployeeList(prev => prev.map(emp => {
            if (emp.cedula === employee.cedula) {
                return { ...emp, id_autorizado: newId };
            }
            return emp;
        }));
    }, []);

    const handleClearData = useCallback(() => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Se borrará toda la selección actual y no podrás revertirlo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('empleadosSeleccionados');
                localStorage.removeItem('resumenEmpleados');
                setEmployeeList(initialEmployees.map(emp => ({ ...emp, id_autorizado: null, almuerzo: false, para_llevar: false, cubiertos: false, evento_especial: false })));
                Swal.fire('¡Borrado!', 'La selección ha sido limpiada.', 'success');
            }
        });
    }, [initialEmployees]);

    return {
        employeeList,
        filteredEmployees,
        search,
        tasaDia,
        setSearch,
        handleAddGuest,
        handleToggleField,
        handleAutorizadoChange,
        handleClearData
    };
};