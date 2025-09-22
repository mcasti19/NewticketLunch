import {useState, useEffect} from 'react';
import {useAuthStore} from '../store/authStore';
import {useTicketLunchStore} from '../store/ticketLunchStore';
import {AutorizarSelector} from './AutorizarSelector';
import {useGetEmployees} from '../hooks/useGetEmployees';
import {Spinner} from './Spinner';

export const ContentMiTicket = ( {goToResumeTab} ) => {
    const {user} = useAuthStore();
    const {setSelectedEmpleadosSummary, setSummary, setOrderOrigin} = useTicketLunchStore();

    const [ myTicket, setMyTicket ] = useState( null );
    const [ loading, setLoading ] = useState( true );
    const [ selectedAutorizado, setSelectedAutorizado ] = useState( null );

    const idGerencia = user?.id_management || null;
    const {employees} = useGetEmployees( idGerencia );

    const tasaDia = 100;
    const precioLlevar = 15;
    const precioCubierto = 5;

    // Cargar estado desde localStorage o inicializar
    useEffect( () => {
        if ( !user || !employees || employees.length === 0 ) return;

        const storedTicket = localStorage.getItem( 'miTicketSeleccion' );
        let ticketToSet;

        if ( storedTicket ) {
            ticketToSet = JSON.parse( storedTicket );
            if ( ticketToSet.id_autorizado ) {
                const autorizado = employees.find( emp => emp.cedula === ticketToSet.id_autorizado );
                if ( autorizado ) {
                    setSelectedAutorizado( autorizado );
                }
            }
        } else {
            ticketToSet = {
                id: user.cedula,
                almuerzo: false,
                para_llevar: false,
                cubiertos: false,
                id_autorizado: null,
                autorizado_por: null,
            };
        }
        setMyTicket( ticketToSet );
        setLoading( false );
    }, [ user, employees ] );

    // Guardar estado en localStorage cuando cambie
    useEffect( () => {
        if ( myTicket && !loading ) {
            localStorage.setItem( 'miTicketSeleccion', JSON.stringify( myTicket ) );
        }
    }, [ myTicket, loading ] );

    const handleToggleOption = ( option ) => {
        setMyTicket( prev => ( {...prev, [ option ]: !prev[ option ]} ) );
    };

    const handleAutorizar = ( autorizado ) => {
        setSelectedAutorizado( autorizado );
        setMyTicket( prev => ( {...prev, id_autorizado: autorizado ? autorizado.cedula : null} ) );
    };

    const handleSave = () => {
        if ( !myTicket || !user ) return;

        const total_pagar = calculateCost();

        const selectedEmployee = {
            nombre: user.first_name || '',
            apellido: user.last_name || '',
            cedula: user.cedula,
            id_employee: user.id_employee || user.id || '',
            almuerzo: myTicket.almuerzo,
            para_llevar: myTicket.para_llevar,
            cubiertos: myTicket.cubiertos,
            id_autorizado: myTicket.id_autorizado,
            evento_especial: false,
            extras: [
                ...( myTicket.para_llevar ? [ 1 ] : [] ),
                ...( myTicket.cubiertos ? [ 2 ] : [] )
            ],
            total_pagar: total_pagar,
            autoriza_a: selectedAutorizado ? `${ selectedAutorizado.first_name } ${ selectedAutorizado.last_name }`.trim() : '',
            autorizado_por: '',
        };

        const newSummary = {
            countAlmuerzos: myTicket.almuerzo ? 1 : 0,
            countAlmuerzosAutorizados: myTicket.id_autorizado ? 1 : 0,
            countParaLlevar: myTicket.para_llevar ? 1 : 0,
            countCubiertos: myTicket.cubiertos ? 1 : 0,
            totalPagar: total_pagar,
        };

        setSelectedEmpleadosSummary( [ selectedEmployee ] );
        setSummary( newSummary );

        setOrderOrigin( 'mi-ticket' ); // Etiquetar el origen

        localStorage.removeItem( 'miTicketSeleccion' );

        if ( goToResumeTab ) {
            goToResumeTab();
        }
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

    return (
        <div className="p-4 md:p-8 bg-gray-800 rounded-lg shadow-xl text-white w-[90vw] md:w-[75dvw] mx-auto my-8 border border-gray-700">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-400">Mi Ticket</h1>
            <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl font-semibold">
                        {user?.first_name?.charAt( 0 ).toUpperCase()}{user?.last_name?.charAt( 0 ).toUpperCase()}
                    </span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold">{user?.first_name} {user?.last_name}</h2>
                <p className="text-sm text-gray-400">{user?.name}</p>
            </div>

            <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-between shadow-md">
                    <span className="font-medium text-lg">Almuerzo para hoy</span>
                    <input
                        type="checkbox"
                        checked={myTicket?.almuerzo || false}
                        onChange={() => handleToggleOption( 'almuerzo' )}
                        className="form-checkbox h-6 w-6 text-blue-600 rounded-md bg-gray-600 border-gray-500 cursor-pointer"
                    />
                </div>

                {myTicket?.almuerzo && (
                    <>
                        <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-between shadow-md">
                            <span className="font-medium text-lg">Para llevar</span>
                            <input
                                type="checkbox"
                                checked={myTicket.para_llevar}
                                onChange={() => handleToggleOption( 'para_llevar' )}
                                className="form-checkbox h-6 w-6 text-blue-600 rounded-md bg-gray-600 border-gray-500 cursor-pointer"
                            />
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-between shadow-md">
                            <span className="font-medium text-lg">Desea cubiertos</span>
                            <input
                                type="checkbox"
                                checked={myTicket.cubiertos}
                                onChange={() => handleToggleOption( 'cubiertos' )}
                                className="form-checkbox h-6 w-6 text-blue-600 rounded-md bg-gray-600 border-gray-500 cursor-pointer"
                            />
                        </div>
                    </>
                )}

                <div className="bg-gray-700 p-4 rounded-lg flex flex-col shadow-md">
                    <span className="font-medium text-lg mb-2">Autorizar a otra persona</span>
                    <AutorizarSelector
                        onSelect={handleAutorizar}
                        selectedAutorizado={selectedAutorizado}
                        employeeList={employees}
                        loading={loading}
                    />
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold text-blue-400 mb-2">Resumen</h3>
                <div className="flex justify-between items-center text-lg">
                    <span>Costo total:</span>
                    <span className="font-bold text-blue-400">${calculateCost().toFixed( 2 )}</span>
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-base shadow-lg"
                    disabled={!myTicket?.almuerzo}
                >
                    Confirmar Selección
                </button>
            </div>
        </div>
    );
};