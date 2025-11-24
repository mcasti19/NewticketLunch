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

    // Estilos personalizados para React Select en la tabla (ContentSeleccion) - Se mantienen sin cambios
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
                placeholder="placeholder..."
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
    
    // 💥 NUEVOS ESTILOS PARA EL TEMA OSCURO
    const customDarkStyles = {
        control: ( provided, state ) => ( {
            ...provided,
            backgroundColor: 'rgba(55, 65, 81, 0.7)', // bg-gray-700/70 para el control
            borderColor: state.isFocused ? '#6366F1' : 'rgba(75, 85, 99, 0.8)', // indigo-500 en focus
            boxShadow: state.isFocused ? '0 0 0 1px #6366F1' : 'none',
            color: 'white',
            borderRadius: '0.75rem', // rounded-xl
            cursor: 'pointer',
            padding: '0.25rem 0',
        } ),
        singleValue: ( provided ) => ( {
            ...provided,
            color: 'white',
        } ),
        input: ( provided ) => ( {
            ...provided,
            color: 'white',
        } ),
        placeholder: ( provided ) => ( {
            ...provided,
            color: '#D1D5DB', // gray-300
        } ),
        menu: ( provided ) => ( {
            ...provided,
            backgroundColor: '#1F2937', // bg-gray-800 para el menú
            borderRadius: '0.75rem',
            zIndex: 9999,
        } ),
        option: ( provided, state ) => ( {
            ...provided,
            backgroundColor: state.isFocused 
                ? 'rgba(79, 70, 229, 0.5)' // indigo-600/50 on hover
                : state.isSelected 
                    ? '#4F46E5' // indigo-600 selected
                    : 'transparent',
            color: 'white',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: '#4F46E5',
            }
        } ),
        indicatorSeparator: () => ( { display: 'none' } ),
        dropdownIndicator: ( provided ) => ( {
            ...provided,
            color: '#9CA3AF', // gray-400
        } )
    };

    return (
        <div className="p-0 rounded-lg flex flex-col border-0 w-full">
            <Select
                options={options}
                value={selectedAutorizado ? {value: selectedAutorizado.cedula, label: selectedAutorizado.fullName} : null}
                onChange={handleChange}
                isSearchable={true}
                placeholder={loading ? 'Cargando empleados...' : 'Autoriza a un empleado...'}
                isDisabled={loading}
                // Se eliminan clases de estilo directo y se usa `styles`
                classNamePrefix="react-select"
                styles={customDarkStyles} // 💥 USAMOS LOS NUEVOS ESTILOS OSCUROS
            />
            {selectedAutorizado && (
                <div>
                    {/* Texto de autorización mejorado estéticamente */}
                    <p className="text-sm text-center mt-3 font-medium text-blue-950 dark:text-yellow-300"> 
                        ✅ Autorizado: <span className="font-bold">{selectedAutorizado.fullName}</span>
                    </p>
                </div>
            )}
        </div>
    );
};


// /* eslint-disable react-hooks/rules-of-hooks */
// import React, {useMemo} from 'react';
// import {useAuthStore} from '../store/authStore';
// import Select from 'react-select'; // Importa React Select

// export const AutorizarSelector = ( {
//     // Props para ContentMiTicket (vista individual)
//     onSelect,
//     selectedAutorizado,
//     loading,
//     // Props para ContentSeleccion (la tabla)
//     row,
//     handleAutorizadoChange,
//     paraLlevar,
//     isSelectedBySomeoneElse,
//     employeeList, // Se usa en ambos contextos
// } ) => {
//     const {user} = useAuthStore();

//     // Lógica para el selector en la tabla (ContentSeleccion)
//     if ( row && handleAutorizadoChange && employeeList ) {
//         const uniqueId = `autorizar-select-${ row.original.cedula }`;
//         const selectedId = row.original.id_autorizado;

//         const employeesForSelector = useMemo( () => {
//             if ( !employeeList ) return [];
//             return employeeList.filter( emp => emp.id_gerencia === user?.id_gerencia && emp.cedula !== row.original.cedula );
//         }, [ employeeList, user, row ] );

//         const options = useMemo( () => {
//             return employeesForSelector.map( emp => {
//                 const isUnavailable = employeeList.some( otherEmp => otherEmp.id_autorizado === emp.cedula && otherEmp.cedula !== row.original.cedula );
//                 const hasAuthorizedSomeone = emp.id_autorizado;
//                 return {
//                     value: emp.cedula,
//                     label: emp.fullName,
//                     isDisabled: isUnavailable || hasAuthorizedSomeone, // La prop `isDisabled` se pasa a la opción
//                     ...emp
//                 };
//             } );
//         }, [ employeesForSelector, employeeList, row ] );

//         const selectedOption = options.find( option => option.value === selectedId ) || null;

//         // Estilos personalizados para React Select en la tabla
//         const customStyles = {
//             control: ( provided, state ) => ( {
//                 ...provided,
//                 fontSize: '0.875rem', // text-sm
//                 padding: '0.25rem', // px-2
//                 borderRadius: '0.375rem', // rounded-md
//                 borderColor: state.isDisabled ? '#E5E7EB' : '#D1D5DB', // border-gray-300
//                 backgroundColor: state.isDisabled ? '#F3F4F6' : '#FFFFFF', // bg-gray-100 o bg-white
//                 cursor: state.isDisabled ? 'not-allowed' : 'pointer',
//                 boxShadow: 'none',
//                 '&:hover': {
//                     borderColor: '#D1D5DB',
//                 },
//             } ),
//             singleValue: ( provided ) => ( {
//                 ...provided,
//                 color: 'currentColor',
//             } ),
//             option: ( provided, state ) => ( {
//                 ...provided,
//                 backgroundColor: state.isFocused ? '#E5E7EB' : 'white',
//                 color: 'black',
//             } ),
//             placeholder: ( provided ) => ( {
//                 ...provided,
//                 color: '#6B7280',
//             } ),
//             indicatorSeparator: () => ( {display: 'none'} ), // Oculta el separador
//             dropdownIndicator: ( provided, state ) => ( {
//                 ...provided,
//                 color: state.isDisabled ? '#9CA3AF' : '#6B7280',
//             } )
//         };

//         return (
//             <Select
//                 id={uniqueId}
//                 value={selectedOption}
//                 onChange={selected => handleAutorizadoChange( row.original, selected ? selected.value : null )}
//                 options={options}
//                 isDisabled={!paraLlevar || isSelectedBySomeoneElse}
//                 placeholder="placeholder..."
//                 styles={customStyles}
//                 isSearchable={true}
//             />
//         );
//     }

//     // Lógica para el selector en la vista individual (ContentMiTicket)
//     const filteredEmployees = useMemo( () => {
//         if ( loading || !employeeList ) {
//             return [];
//         }
//         return employeeList.filter(
//             emp => emp.cedula !== user?.cedula && emp.id_gerencia === user?.id_gerencia
//         );
//     }, [ employeeList, loading, user ] );

//     const options = useMemo( () => {
//         return filteredEmployees.map( emp => ( {
//             value: emp.cedula,
//             label: emp.fullName,
//             ...emp
//         } ) );
//     }, [ filteredEmployees ] );

//     const handleChange = ( selectedOption ) => {
//         onSelect( selectedOption );
//     };

//     return (
//         <div className=" p-0 rounded-lg flex flex-col border-0 w-full">
//             <Select
//                 options={options}
//                 value={selectedAutorizado ? {value: selectedAutorizado.cedula, label: selectedAutorizado.fullname} : null}
//                 onChange={handleChange}
//                 isSearchable={true}
//                 placeholder={loading ? 'Cargando empleados...' : 'Autoriza a un empleado...'}
//                 isDisabled={loading}
//                 className="text-white m-auto"
//                 classNamePrefix="react-select"
                
//                 // Aquí se pueden añadir estilos personalizados con `styles` si es necesario
//                 theme={( theme ) => ( {
//                     ...theme,
//                     colors: {
//                         ...theme.colors,
//                         primary: '#3B82F6', // Color de focus/selección
//                         primary25: '#3B82F6', // Color al pasar el mouse por las opciones
//                         neutral80: 'white',
//                         neutral0: '#1F2937', // Color de fondo del control
//                         // neutral: '#D1D5DC', // Color de fondo del control
//                     },
//                 } )}
//             />
//             {selectedAutorizado && (
//                 <div>
//                     <p className="text-sm text-gray-800 dark:text-amber-50 mt-1 text-center">
//                         Autorizado:<br></br> {selectedAutorizado.fullName}
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// };