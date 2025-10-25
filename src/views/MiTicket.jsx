import {useState, useEffect} from 'react';
import {useAuthStore} from '../store/authStore';
import {useTicketLunchStore} from '../store/ticketLunchStore';
import {AutorizarSelector} from '../components/AutorizarSelector';
import {useGetEmployees} from '../hooks/useGetEmployees';
import {Spinner} from '../components/Spinner';
import {buildSelectedEmployees, buildResumen} from '../utils/orderUtils';
// Nota: `user` en el store ahora está normalizado (email, cedula, fullName, management, phone, position, state, type_employee)

export const MyTicket = ( {goToResumeTab} ) => {
    const {user} = useAuthStore();
    const {setSelectedEmpleadosSummary, setSummary, setOrderOrigin} = useTicketLunchStore();

    // Construir un objeto empleado mínimo a partir del user normalizado en el store
    const employee = user ? {
        fullName: user.fullName || `${ user.first_name || '' } ${ user.last_name || '' }`.trim(),
        cedula: user.cedula || '',
        phone: user.phone || '',
        management: user.management || '',
    } : null;

    const [ myTicket, setMyTicket ] = useState( null );
    const [ loading, setLoading ] = useState( true );
    const [ selectedAutorizado, setSelectedAutorizado ] = useState( null );

    const {employees} = useGetEmployees();

    const tasaDia = 100;
    const precioLlevar = 15;
    const precioCubierto = 5;

    // Cargar estado desde localStorage o inicializar
    useEffect( () => {
        console.log( "USER:", user );
        // console.log( "Employee", employee );
        if ( !user || !Array.isArray( employees ) || employees.length === 0 ) return;

        const storedTicket = localStorage.getItem( 'miTicketSeleccion' );
        let ticketToSet;

        if ( storedTicket ) {
            ticketToSet = JSON.parse( storedTicket );
            if ( ticketToSet.id_autorizado ) {
                const autorizado = employees.find( emp => emp.cedula === ticketToSet.id_autorizado );
                if ( autorizado && ( !selectedAutorizado || autorizado.cedula !== selectedAutorizado.cedula ) ) {
                    setSelectedAutorizado( autorizado );
                }
            }
        } else {
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
        setLoading( false );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ employees ] );

    // Guardar estado en localStorage cuando cambie
    useEffect( () => {
        if ( myTicket && !loading ) {
            localStorage.setItem( 'miTicketSeleccion', JSON.stringify( myTicket ) );
        }
    }, [ myTicket, loading ] );


    // HACER TOGGLE EN CHECKBOXS
    const handleToggleOption = ( option ) => {
        // console.log( "ERRROR" );
        setMyTicket( prev => ( {...prev, [ option ]: !prev[ option ]} ) );
    };

    const handleAutorizar = ( autorizado ) => {
        setSelectedAutorizado( autorizado );
        setMyTicket( prev => ( {...prev, id_autorizado: autorizado ? autorizado.cedula : null} ) );
    };

    const handleSave = () => {
        if ( !myTicket || !user ) return;
        // Calcula el total individual
        const total_pagar = calculateCost();
        // Construye el array estandarizado
        const empleadosArr = buildSelectedEmployees( {
            employee: employee,
            ticket: {...myTicket, total_pagar},
            autorizado: selectedAutorizado,
            tipo: 'mi-ticket'
        } );
        // Calcula el resumen estandarizado
        const resumen = buildResumen( empleadosArr, tasaDia, precioLlevar, precioCubierto );
        setSelectedEmpleadosSummary( empleadosArr );
        setSummary( resumen );
        setOrderOrigin( 'mi-ticket' );
        localStorage.removeItem( 'miTicketSeleccion' );
        if ( goToResumeTab ) goToResumeTab();
    };

    const calculateCost = () => {
        if ( !myTicket ) return 0;
        let cost = 0;
        if ( myTicket.almuerzo ) {
            cost += tasaDia;
        }
        if ( myTicket.para_llevar ) {
            cost += precioLlevar;
        }
        if ( myTicket.cubiertos ) {
            cost += precioCubierto;
        }
        return cost;
    };

    if ( loading ) {
        return (
            <div className="flex items-center justify-center h-full text-white">
                <Spinner />
            </div>
        );
    }

    if ( !employees || employees.length === 0 ) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white">
                <h2 className="text-2xl font-bold mb-4">No se encontraron empleados para tu gerencia.</h2>
                <p className="text-lg">Verifica tu usuario o la conexión con el servidor.</p>
            </div>
        );
    }

    return (
        <div className='border-0 w-full md:h-full'>
            <div className="p-4 rounded-lg shadow-xl text-white w-full md:h-full m-auto border-0 border-gray-700 flex flex-col
        // **bg-gradient-to-t from-blue-950 from-50% to-red-600"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-400 dark:text-red-700">Mi Ticket</h1>
                <div className="flex flex-col items-center mb-6">
                    <h2 className="text-xl md:text-2xl font-semibold text-black dark:text-white mb-2">
                        {user?.fullName}
                    </h2>
                </div>
                <div className="flex flex-col md:flex-row w-full gap-4 justify-center items-center border-0 m-auto">
                    <div className="w-80 p-4 rounded-lg flex flex-col items-center justify-between shadow-lg bg-gray-300 dark:bg-slate-800">
                        <span className="font-medium text-lg text-black dark:text-white">Almuerzo</span>
                        <picture>
                            {/* <source srcSet="/Pabellon-Criollo.png" media="(min-width: 600px)" />
                            <source srcSet="/Pabellon-Criollo.png" type="image/jpeg" /> */}
                            <img src="/Pabellon-Criollo.png" alt="Descripción de la imagen" className='w-72' />
                        </picture>
                        <input
                            type="checkbox"
                            checked={myTicket?.almuerzo || false}
                            onChange={() => handleToggleOption( 'almuerzo' )}
                            className="form-checkbox h-6 w-6 text-blue-600 rounded-md bg-gray-600 border-gray-500 cursor-pointer"
                        />
                    </div>

                    {myTicket?.almuerzo && (
                        <>
                            <div className="w-80  p-4 rounded-lg flex flex-col items-center justify-between shadow-lg bg-gray-300 dark:bg-slate-800">
                                <span className="font-medium text-lg text-black dark:text-white">Envase</span>
                                <picture>
                                    {/* <source srcSet="/envase.png" media="(min-width: 600px)" type="image/avif" />
                                    <source srcSet="/envase.png" media="(min-width: 600px)" />
                                    <source srcSet="/envase.png" type="image/jpeg" /> */}
                                    <img src="/envase.png" alt="Descripción de la imagen" className='w-72' />
                                </picture>
                                <input
                                    type="checkbox"
                                    checked={myTicket?.para_llevar || false}
                                    onChange={() => handleToggleOption( 'para_llevar' )}
                                    className="form-checkbox h-6 w-6 text-blue-600 rounded-md bg-gray-600 border-gray-500 cursor-pointer"
                                />
                            </div>
                            <div className="w-80 p-4 rounded-lg flex flex-col items-center justify-between shadow-lg bg-gray-300 dark:bg-slate-800">
                                <span className="font-medium text-lg text-black dark:text-white">Cubiertos</span>
                                <picture>
                                    {/* <source srcSet="/cubiertos2.png" media="(min-width: 1000px)" type="image/avif" />
                                    <source srcSet="/cubiertos2.png" media="(min-width: 600px)" />
                                    <source srcSet="/cubiertos2.png" type="image/jpeg" /> */}
                                    <img src="/cubiertos2.png" alt="Descripción de la imagen" className='w-72' />
                                </picture>
                                <input
                                    type="checkbox"
                                    checked={myTicket?.cubiertos || false}
                                    onChange={() => handleToggleOption( 'cubiertos' )}
                                    className="form-checkbox h-6 w-6 text-blue-600 rounded-md bg-gray-600 border-gray-500 cursor-pointer"
                                />
                            </div>
                        </>
                    )}
                </div>


                <div className='flex flex-col justify-center items-center gap-2'>
                    <div className="border- w-full max-w-md p-4  flex flex-col justify-center items-center mt-2 mx-auto">
                        <span className="font-medium text-lg mb-2 text-black dark:text-white">Autorizar a otra persona</span>
                        <AutorizarSelector
                            onSelect={handleAutorizar}
                            selectedAutorizado={selectedAutorizado}
                            employeeList={employees}
                            loading={loading}
                        />
                    </div>

                    <div className="w-xs p-2 rounded-lg shadow-inner m-auto">
                        {/* <h3 className="text-xl font-semibold text-blue-400 mb-2">Resumen</h3> */}
                        <div className="flex justify-between items-center text-lg text-blue-400">
                            <span>Costo total:</span>
                            <span className="font-bold ">${calculateCost().toFixed( 2 )}</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleSave}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-base shadow-lg"
                            disabled={!myTicket?.almuerzo}
                        >
                            Confirmar Selección
                        </button>
                    </div>
                </div>

            </div>
        </div>

    );
};