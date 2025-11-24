import {useState, useEffect} from 'react';
import {useAuthStore} from '../store/authStore';
import {useTicketLunchStore} from '../store/ticketLunchStore';
import {AutorizarSelector} from '../components/AutorizarSelector'; // Asumo que este componente existe
import {useGetEmployees} from '../hooks/useGetEmployees'; // 💡 Ahora usa TanStack Query
import {Spinner} from '../components/Spinner';
import {buildSelectedEmployees, buildResumen} from '../utils/orderUtils';
import {useTasaDia} from '../hooks/useTasaDia';
import {ItemCard} from '../components/ItemOrderCard';

// ⚙️ CONSTANTES: Se asume que estos valores son fijos o importados
const PRECIO_LLEVAR = 15;
const PRECIO_CUBIERTO = 5;

/**
 * Componente principal para la selección del pedido de almuerzo personal.
 */
export const MyOrder = ( {goToResumeTab} ) => {
    const {user} = useAuthStore();
    const {setSelectedEmpleadosSummary, setSummary, setOrderOrigin} = useTicketLunchStore();

    // 💡 USANDO TanStack Query: Obtenemos 'employees', 'isLoading' (en lugar de loadingEmployees) y 'isError'
    const {employees, isLoading: isLoadingEmployees, isError: isEmployeeError} = useGetEmployees();

    const {bcvRate} = useTasaDia()

    // 1. ESTADO LOCAL
    const [ myTicket, setMyTicket ] = useState( null );
    // 💡 Se elimina: const [ loading, setLoading ] = useState( true );
    const [ selectedAutorizado, setSelectedAutorizado ] = useState( null );

    // ⚙️ Construir objeto empleado mínimo
    const employee = user ? {
        fullName: user.fullName || `${ user.first_name || '' } ${ user.last_name || '' }`.trim(),
        cedula: user.cedula || '',
        phone: user.phone || '',
        management: user.management || '',
    } : null;

    // 2. LÓGICA DE CARGA Y PERSISTENCIA (useEffect)
    // 💡 Dependencias simplificadas y condición de ejecución más limpia.
    useEffect( () => {
        // Ejecución condicional: Esperar a que el usuario y los empleados estén cargados y disponibles.
        if ( !user || isLoadingEmployees || employees.length === 0 ) return;

        const storedTicket = localStorage.getItem( 'myOrderSelection' );
        let ticketToSet;

        if ( storedTicket ) {
            ticketToSet = JSON.parse( storedTicket );
            if ( ticketToSet.id_autorizado ) {
                // Buscamos al autorizado solo después de que 'employees' se ha cargado.
                const autorizado = employees.find( emp => emp.cedula === ticketToSet.id_autorizado );
                if ( autorizado && ( !selectedAutorizado || autorizado.cedula !== selectedAutorizado.cedula ) ) {
                    setSelectedAutorizado( autorizado );
                }
            }
        } else {
            // Estado inicial por defecto
            ticketToSet = {
                cedula: user?.cedula || '',
                almuerzo: false,
                para_llevar: false,
                cubiertos: false,
                id_autorizado: null,
                autorizado_por: null,
            };
        }
        setMyTicket( ticketToSet );
        // 💡 Se elimina: setLoading( false );

    }, [ user, isLoadingEmployees, employees, selectedAutorizado ] ); // Dependencias limpias

    // 3. EFECTO DE GUARDADO EN LOCALSTORAGE
    useEffect( () => {
        // 💡 Simplificamos: Si myTicket no es null, guardar. No necesitamos 'loading'.
        if ( myTicket ) {
            localStorage.setItem( 'myOrderSelection', JSON.stringify( myTicket ) );
        }
    }, [ myTicket ] );

    // ... (4. HANDLERS Y UTILIDADES - El resto del código se mantiene)

    const calculateCost = () => {
        if ( !myTicket ) return 0;
        let cost = 0;
        // La tasa del día (bcvRate) se usa como el costo base del almuerzo
        if ( myTicket.almuerzo ) {
            cost += bcvRate;
        }
        if ( myTicket.para_llevar ) {
            cost += PRECIO_LLEVAR;
        }
        if ( myTicket.cubiertos ) {
            cost += PRECIO_CUBIERTO;
        }
        return cost;
    };

    const handleToggleOption = ( option ) => {
        setMyTicket( prev => ( {...prev, [ option ]: !prev[ option ]} ) );
    };

    const handleAutorizar = ( autorizado ) => {
        setSelectedAutorizado( autorizado );
        setMyTicket( prev => ( {...prev, id_autorizado: autorizado ? autorizado.cedula : null} ) );
    };

    const handleClearSelection = () => {
        const initialTicketState = {
            cedula: user?.cedula || '',
            almuerzo: false,
            para_llevar: false,
            cubiertos: false,
            id_autorizado: null,
            autorizado_por: null,
        };
        setMyTicket( initialTicketState );
        setSelectedAutorizado( null );
        localStorage.removeItem( 'myOrderSelection' );
    };

    const handleSave = () => {
        if ( !myTicket || !user ) return;
        const total_pagar = calculateCost();

        // Preparar datos para el Resumen
        const empleadosArr = buildSelectedEmployees( {
            employee: employee,
            ticket: {...myTicket, total_pagar},
            autorizado: selectedAutorizado,
            tipo: 'mi-ticket'
        } );
        const resumen = buildResumen( empleadosArr, bcvRate, PRECIO_LLEVAR, PRECIO_CUBIERTO );

        setSelectedEmpleadosSummary( empleadosArr );
        setSummary( resumen );
        setOrderOrigin( 'mi-ticket' );
        localStorage.removeItem( 'myOrderSelection' );
        if ( goToResumeTab ) goToResumeTab();
    };


    // 5. RENDERIZADO CONDICIONAL
    // 💡 Usamos isLoadingEmployees en lugar del 'loading' local.
    if ( isLoadingEmployees || myTicket === null ) {
        return (
            <div className="flex items-center justify-center h-full min-h-[calc(100vh-80px)] text-white">
                <Spinner />
            </div>
        );
    }

    // 💡 Renderizado de Error (manejo de isError de TanStack Query)
    if ( isEmployeeError ) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-80px)] text-white p-4">
                <h2 className="text-2xl font-bold mb-4 text-red-500">❌ Error de Carga</h2>
                <p className="text-lg text-blue-200 text-center">No se pudieron cargar los datos de empleados. Por favor, intente de nuevo más tarde.</p>
            </div>
        );
    }

    // 6. RENDERIZADO PRINCIPAL (Estilizado)
    return (
        <div className='w-full border-0'>
            {/* <div className="
                w-full md:h-full bg-slate-900/10
                rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-blue-700/10 p-6 md:p-8 lg:p-2 
                text-white flex flex-col justify-between space-y-2
            "> */}
            <div className="
                w-full md:h-full flex flex-col justify-between space-y-2
            ">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-400 uppercase tracking-widest mb-2 shadow-text">
                        Mi Orden
                    </h1>
                    {/* <p className="text-lg text-red-500 font-semibold">{user?.fullName || 'Usuario'}</p> */}
                </div>

                {/* --- SECCIÓN DE SELECCIÓN DE PRODUCTOS (GRID RESPONSIVE) --- */}
                <div className={`
                    w-full
                    ${ myTicket?.almuerzo
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center' // Grid para 3 elementos
                        : 'flex flex-col items-center'
                    }
                `}>
                    {/* 1. Tarjeta de ALMUERZO */}
                    <ItemCard
                        title="Almuerzo"
                        imgSrc="/Pabellon-Criollo.png"
                        checked={myTicket?.almuerzo || false}
                        onChange={() => handleToggleOption( 'almuerzo' )}
                        price={bcvRate}
                        className={!myTicket?.almuerzo ? 'w-full max-w-lg' : ''} // Más ancho si es el único
                    />

                    {/* 2. Tarjeta de ENVASE (Solo visible si Almuerzo está seleccionado) */}
                    {myTicket?.almuerzo && (
                        <ItemCard
                            title="Envase para llevar"
                            imgSrc="/envase.png"
                            checked={myTicket?.para_llevar || false}
                            onChange={() => handleToggleOption( 'para_llevar' )}
                            price={PRECIO_LLEVAR}
                        />
                    )}

                    {/* 3. Tarjeta de CUBIERTOS (Solo visible si Almuerzo está seleccionado) */}
                    {myTicket?.almuerzo && (
                        <ItemCard
                            title="Cubiertos desechables"
                            imgSrc="/cubiertos2.png"
                            checked={myTicket?.cubiertos || false}
                            onChange={() => handleToggleOption( 'cubiertos' )}
                            price={PRECIO_CUBIERTO}
                        />
                    )}
                </div>

                {/* --- SECCIÓN DE AUTORIZACIÓN Y RESUMEN --- */}
                <hr className='w-1/2 mx-auto my-2 border-blue-700/50' />


                <div className='w-full flex flex-col items-center space-y-6 pt-6 md:flex-row justify-around outline-0'>
                    {/* Selector de Autorización */}
                    <div className="w-full max-w-sm flex flex-col justify-center items-center outline-0">
                        <span className="font-bold text-xl mb-3 text-blue-950 dark:text-blue-300">
                            Autorizar a otra persona (Opcional)
                        </span>
                        {
                            // 💡 Control de carga y error del listado de empleados
                            ( isLoadingEmployees || isEmployeeError || employees.length === 0 )
                                ? (
                                    <div className="flex items-center justify-center h-full text-white">
                                        <Spinner text={isEmployeeError ? 'Error al cargar empleados' : 'Cargando Empleados'} />
                                    </div>
                                ) : (
                                    <AutorizarSelector
                                        onSelect={handleAutorizar}
                                        selectedAutorizado={selectedAutorizado}
                                        employeeList={employees}
                                        loading={false}
                                        // 💡 Pasa un estilo base que pueda ser absorbido por un componente moderno de selector
                                        className="w-full text-lg p-3 bg-slate-700 text-white rounded-lg border border-blue-500/50 shadow-inner focus:ring-2 focus:ring-red-500"
                                    />
                                )
                        }
                    </div>

                    <div className='outline-0'>
                        {/* Costo Total (Estilo de resumen destacado) */}
                        <div className="w-full max-w-sm p-4 bg-gradient-to-r from-blue-900 to-blue-950 rounded-xl shadow-2xl border border-blue-400/50">
                            <div className="flex justify-between items-center text-2xl font-extrabold space-x-2">
                                <span className='text-blue-200'>COSTO TOTAL:</span>
                                <span className="text-yellow-400"> Bs. {calculateCost().toFixed( 2 )}</span>
                            </div>
                        </div>

                        {/* Botones de Acción (Estilo pulido) */}
                        <div className="flex flex-col md:items-center md:flex-row justify-center gap-4 pt-4 w-full max-w-lg">
                            <button
                                onClick={handleSave}
                                className={`
                                w-full py-3 rounded-xl transition-all font-black text-lg shadow-lg uppercase
                                ${ !myTicket?.almuerzo
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
                                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transform hover:scale-[1.02] ring-2 ring-red-500/50'
                                    }
                            `}
                                disabled={!myTicket?.almuerzo}
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={handleClearSelection}
                                className="w-full py-3 bg-transparent text-red-400 rounded-xl border-2 border-red-500 hover:bg-red-900/40 transition-colors font-black text-lg shadow-lg uppercase"
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};


// import {useState, useEffect} from 'react';
// import {useAuthStore} from '../store/authStore';
// import {useTicketLunchStore} from '../store/ticketLunchStore';
// import {AutorizarSelector} from '../components/AutorizarSelector';
// import {useGetEmployees} from '../hooks/useGetEmployees'; // 💡 Ahora usa TanStack Query
// import {Spinner} from '../components/Spinner';
// import {buildSelectedEmployees, buildResumen} from '../utils/orderUtils';
// import {useTasaDia} from '../hooks/useTasaDia';
// import {ItemCard} from '../components/ItemOrderCard';

// // ⚙️ CONSTANTES: Se asume que estos valores son fijos o importados
// const PRECIO_LLEVAR = 15;
// const PRECIO_CUBIERTO = 5;

// /**
//  * Componente principal para la selección del pedido de almuerzo personal.
//  */
// export const MyOrder = ( {goToResumeTab} ) => {
//     const {user} = useAuthStore();
//     const {setSelectedEmpleadosSummary, setSummary, setOrderOrigin} = useTicketLunchStore();

//     // 💡 USANDO TanStack Query: Obtenemos 'employees', 'isLoading' (en lugar de loadingEmployees) y 'isError'
//     const {employees, isLoading: isLoadingEmployees, isError: isEmployeeError} = useGetEmployees();

//     const {bcvRate} = useTasaDia()

//     // 1. ESTADO LOCAL
//     const [ myTicket, setMyTicket ] = useState( null );
//     // 💡 Se elimina: const [ loading, setLoading ] = useState( true );
//     const [ selectedAutorizado, setSelectedAutorizado ] = useState( null );

//     // ⚙️ Construir objeto empleado mínimo
//     const employee = user ? {
//         fullName: user.fullName || `${ user.first_name || '' } ${ user.last_name || '' }`.trim(),
//         cedula: user.cedula || '',
//         phone: user.phone || '',
//         management: user.management || '',
//     } : null;

//     // 2. LÓGICA DE CARGA Y PERSISTENCIA (useEffect)
//     // 💡 Dependencias simplificadas y condición de ejecución más limpia.
//     useEffect( () => {
//         // Ejecución condicional: Esperar a que el usuario y los empleados estén cargados y disponibles.
//         if ( !user || isLoadingEmployees || employees.length === 0 ) return;

//         const storedTicket = localStorage.getItem( 'myOrderSelection' );
//         let ticketToSet;

//         if ( storedTicket ) {
//             ticketToSet = JSON.parse( storedTicket );
//             if ( ticketToSet.id_autorizado ) {
//                 // Buscamos al autorizado solo después de que 'employees' se ha cargado.
//                 const autorizado = employees.find( emp => emp.cedula === ticketToSet.id_autorizado );
//                 if ( autorizado && ( !selectedAutorizado || autorizado.cedula !== selectedAutorizado.cedula ) ) {
//                     setSelectedAutorizado( autorizado );
//                 }
//             }
//         } else {
//             // Estado inicial por defecto
//             ticketToSet = {
//                 cedula: user?.cedula || '',
//                 almuerzo: false,
//                 para_llevar: false,
//                 cubiertos: false,
//                 id_autorizado: null,
//                 autorizado_por: null,
//             };
//         }
//         setMyTicket( ticketToSet );
//         // 💡 Se elimina: setLoading( false );

//     }, [ user, isLoadingEmployees, employees, selectedAutorizado ] ); // Dependencias limpias

//     // 3. EFECTO DE GUARDADO EN LOCALSTORAGE
//     useEffect( () => {
//         // 💡 Simplificamos: Si myTicket no es null, guardar. No necesitamos 'loading'.
//         if ( myTicket ) {
//             localStorage.setItem( 'myOrderSelection', JSON.stringify( myTicket ) );
//         }
//     }, [ myTicket ] );

//     // ... (4. HANDLERS Y UTILIDADES - El resto del código se mantiene)

//     const calculateCost = () => {
//         if ( !myTicket ) return 0;
//         let cost = 0;
//         // La tasa del día (bcvRate) se usa como el costo base del almuerzo
//         if ( myTicket.almuerzo ) {
//             cost += bcvRate;
//         }
//         if ( myTicket.para_llevar ) {
//             cost += PRECIO_LLEVAR;
//         }
//         if ( myTicket.cubiertos ) {
//             cost += PRECIO_CUBIERTO;
//         }
//         return cost;
//     };

//     const handleToggleOption = ( option ) => {
//         setMyTicket( prev => ( {...prev, [ option ]: !prev[ option ]} ) );
//     };

//     const handleAutorizar = ( autorizado ) => {
//         setSelectedAutorizado( autorizado );
//         setMyTicket( prev => ( {...prev, id_autorizado: autorizado ? autorizado.cedula : null} ) );
//     };

//     const handleClearSelection = () => {
//         const initialTicketState = {
//             cedula: user?.cedula || '',
//             almuerzo: false,
//             para_llevar: false,
//             cubiertos: false,
//             id_autorizado: null,
//             autorizado_por: null,
//         };
//         setMyTicket( initialTicketState );
//         setSelectedAutorizado( null );
//         localStorage.removeItem( 'myOrderSelection' );
//     };

//     const handleSave = () => {
//         if ( !myTicket || !user ) return;
//         const total_pagar = calculateCost();

//         // Preparar datos para el Resumen
//         const empleadosArr = buildSelectedEmployees( {
//             employee: employee,
//             ticket: {...myTicket, total_pagar},
//             autorizado: selectedAutorizado,
//             tipo: 'mi-ticket'
//         } );
//         const resumen = buildResumen( empleadosArr, bcvRate, PRECIO_LLEVAR, PRECIO_CUBIERTO );

//         setSelectedEmpleadosSummary( empleadosArr );
//         setSummary( resumen );
//         setOrderOrigin( 'mi-ticket' );
//         localStorage.removeItem( 'myOrderSelection' );
//         if ( goToResumeTab ) goToResumeTab();
//     };


//     // 5. RENDERIZADO CONDICIONAL
//     // 💡 Usamos isLoadingEmployees en lugar del 'loading' local.
//     if ( isLoadingEmployees || myTicket === null ) {
//         return (
//             <div className="flex items-center justify-center h-full min-h-[calc(100vh-80px)] text-white">
//                 <Spinner />
//             </div>
//         );
//     }

//     // 💡 Renderizado de Error (manejo de isError de TanStack Query)
//     if ( isEmployeeError ) {
//         return (
//             <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-80px)] text-white p-4">
//                 <h2 className="text-2xl font-bold mb-4 text-red-500">❌ Error de Carga</h2>
//                 <p className="text-lg text-blue-200 text-center">No se pudieron cargar los datos de empleados. Por favor, intente de nuevo más tarde.</p>
//             </div>
//         );
//     }


//     // 6. RENDERIZADO PRINCIPAL (Estilizado)
//     return (
//         // ... (el JSX de renderizado principal se mantiene sin cambios)
//         <div className='w-full md:h-full border-0'>
//             <div className="
//                 w-full md:h-full bg-gradient-to-br from-blue-900/20 to-blue-950/20
//                 rounded-xl shadow-2xl border-0 border-blue-700/50 p-6 md:p-8 lg:p-10 
//                 text-white flex flex-col justify-between space-y-6
//             ">
//                 <div className="text-center">
//                     <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-blue-200 uppercase tracking-wider mb-1">
//                         Mi Orden
//                     </h1>
//                     {/* <h2 className="text-xl md:text-2xl font-semibold text-red-500 dark:text-red-400">
//                         {user?.fullName || 'Usuario'}
//                     </h2> */}
//                 </div>

//                 {/* --- SECCIÓN DE SELECCIÓN DE PRODUCTOS (GRID RESPONSIVE) --- */}
//                 <div className={`
//                     w-full
//                     ${ myTicket?.almuerzo
//                         ? 'grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center'
//                         : 'flex flex-col items-center'
//                     }
//                 `}>
//                     {/* 1. Tarjeta de ALMUERZO */}
//                     <ItemCard
//                         title="Almuerzo"
//                         imgSrc="/Pabellon-Criollo.png"
//                         checked={myTicket?.almuerzo || false}
//                         onChange={() => handleToggleOption( 'almuerzo' )}
//                         price={bcvRate}
//                         className={!myTicket?.almuerzo ? 'w-full max-w-sm' : ''}
//                     />

//                     {/* 2. Tarjeta de ENVASE (Solo visible si Almuerzo está seleccionado) */}
//                     {myTicket?.almuerzo && (
//                         <ItemCard
//                             title="Envase para llevar"
//                             imgSrc="/envase.png"
//                             checked={myTicket?.para_llevar || false}
//                             onChange={() => handleToggleOption( 'para_llevar' )}
//                             price={PRECIO_LLEVAR}
//                         />
//                     )}

//                     {/* 3. Tarjeta de CUBIERTOS (Solo visible si Almuerzo está seleccionado) */}
//                     {myTicket?.almuerzo && (
//                         <ItemCard
//                             title="Cubiertos desechables"
//                             imgSrc="/cubiertos2.png"
//                             checked={myTicket?.cubiertos || false}
//                             onChange={() => handleToggleOption( 'cubiertos' )}
//                             price={PRECIO_CUBIERTO}
//                         />
//                     )}
//                 </div>

//                 {/* --- SECCIÓN DE AUTORIZACIÓN Y RESUMEN --- */}
//                 <div className='w-full  h-full flex flex-col items-center space-y-2 pt-4 border-t border-blue-700/50'>

//                     {/* Selector de Autorización */}
//                     <div className="w-full max-w-sm flex flex-col justify-center items-center">
//                         <span className="font-semibold text-lg mb-3 text-blue-900 dark:text-blue-200">
//                             Autorizar a otra persona
//                         </span>
//                         {
//                             // 💡 Control de carga y error del listado de empleados
//                             ( isLoadingEmployees || isEmployeeError || employees.length === 0 )
//                                 ? (
//                                     <div className="flex items-center justify-center h-full text-white">
//                                         <Spinner text={isEmployeeError ? 'Error al cargar empleados' : 'Cargando Empleados'} />
//                                     </div>
//                                 ) : (
//                                     <AutorizarSelector
//                                         onSelect={handleAutorizar}
//                                         selectedAutorizado={selectedAutorizado}
//                                         employeeList={employees}
//                                         loading={false} // 💡 La carga ahora se maneja arriba
//                                     />
//                                 )
//                         }
//                     </div>

//                     {/* Costo Total */}
//                     <div className="w-full max-w-sm p-3 bg-blue-900/60 rounded-lg shadow-inner border border-blue-700">
//                         <div className="flex justify-between items-center text-xl font-bold">
//                             <span className=''>Costo total:</span>
//                             <span className="">Bs. {calculateCost().toFixed( 2 )}</span>
//                         </div>
//                     </div>

//                     {/* Botones de Acción */}
//                     <div className="flex flex-col md:items-center md:flex-row justify-center gap-4 pt-4 w-full max-w-md">
//                         <button
//                             onClick={handleSave}
//                             className={`
//                                 flex-1 px-6 py-3 rounded-lg transition-all font-bold text-base shadow-lg
//                                 ${ !myTicket?.almuerzo
//                                     ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
//                                     : 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-[1.02]'
//                                 }
//                             `}
//                             disabled={!myTicket?.almuerzo}
//                         >
//                             Confirmar Selección
//                         </button>
//                         <button
//                             onClick={handleClearSelection}
//                             className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold text-base shadow-lg"
//                         >
//                             Limpiar Selección
//                         </button>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };