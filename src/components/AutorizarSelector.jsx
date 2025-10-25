/* eslint-disable react-hooks/rules-of-hooks */
import React, {useMemo} from 'react';
import {useAuthStore} from '../store/authStore';
import Select from 'react-select'; // Importa React Select

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
    employeeList, // Se usa en ambos contextos
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

        const options = useMemo( () => {
            return employeesForSelector.map( emp => {
                const isUnavailable = employeeList.some( otherEmp => otherEmp.id_autorizado === emp.cedula && otherEmp.cedula !== row.original.cedula );
                const hasAuthorizedSomeone = emp.id_autorizado;
                return {
                    value: emp.cedula,
                    label: emp.fullName,
                    isDisabled: isUnavailable || hasAuthorizedSomeone, // La prop `isDisabled` se pasa a la opción
                    ...emp
                };
            } );
        }, [ employeesForSelector, employeeList, row ] );

        const selectedOption = options.find( option => option.value === selectedId ) || null;

        // Estilos personalizados para React Select en la tabla
        const customStyles = {
            control: ( provided, state ) => ( {
                ...provided,
                fontSize: '0.875rem', // text-sm
                padding: '0.25rem', // px-2
                borderRadius: '0.375rem', // rounded-md
                borderColor: state.isDisabled ? '#E5E7EB' : '#D1D5DB', // border-gray-300
                backgroundColor: state.isDisabled ? '#F3F4F6' : '#FFFFFF', // bg-gray-100 o bg-white
                cursor: state.isDisabled ? 'not-allowed' : 'pointer',
                boxShadow: 'none',
                '&:hover': {
                    borderColor: '#D1D5DB',
                },
            } ),
            singleValue: ( provided ) => ( {
                ...provided,
                color: 'currentColor',
            } ),
            option: ( provided, state ) => ( {
                ...provided,
                backgroundColor: state.isFocused ? '#E5E7EB' : 'white',
                color: 'black',
            } ),
            placeholder: ( provided ) => ( {
                ...provided,
                color: '#6B7280',
            } ),
            indicatorSeparator: () => ( {display: 'none'} ), // Oculta el separador
            dropdownIndicator: ( provided, state ) => ( {
                ...provided,
                color: state.isDisabled ? '#9CA3AF' : '#6B7280',
            } )
        };

        return (
            <Select
                id={uniqueId}
                value={selectedOption}
                onChange={selected => handleAutorizadoChange( row.original, selected ? selected.value : null )}
                options={options}
                isDisabled={!paraLlevar || isSelectedBySomeoneElse}
                placeholder="Seleccione..."
                styles={customStyles}
                isSearchable={true}
            />
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

    const options = useMemo( () => {
        return filteredEmployees.map( emp => ( {
            value: emp.cedula,
            label: emp.fullName,
            ...emp
        } ) );
    }, [ filteredEmployees ] );

    const handleChange = ( selectedOption ) => {
        onSelect( selectedOption );
    };

    return (
        <div className=" p-0 rounded-lg flex flex-col border-2 w-full">
            <Select
                options={options}
                value={selectedAutorizado ? {value: selectedAutorizado.cedula, label: selectedAutorizado.fullname} : null}
                onChange={handleChange}
                isSearchable={true}
                placeholder={loading ? 'Cargando empleados...' : 'Seleccione o busque...'}
                isDisabled={loading}
                className="text-white"
                classNamePrefix="react-select"
                
                // Aquí se pueden añadir estilos personalizados con `styles` si es necesario
                theme={( theme ) => ( {
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: '#3B82F6', // Color de focus/selección
                        primary25: '#3B82F6', // Color al pasar el mouse por las opciones
                        neutral80: 'white',
                        neutral0: '#1F2937', // Color de fondo del control
                        // neutral: '#D1D5DC', // Color de fondo del control
                    },
                } )}
            />
            {selectedAutorizado && (
                <div>
                    <p className="text-sm text-gray-800 dark:text-amber-50 mt-1 text-center">
                        Autorizado:<br></br> {selectedAutorizado.fullName}
                    </p>
                </div>
            )}
        </div>
    );
};