import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router';
// Íconos
import {IoFastFoodOutline, IoTicketOutline, IoReceiptOutline, IoCalendarOutline, IoSettingsOutline, IoExitOutline, IoCloseOutline, IoMenuOutline, IoChevronBackOutline, IoChevronForwardOutline, IoPersonCircleOutline, IoAlertCircleOutline, IoCloudDownloadOutline} from 'react-icons/io5';
import {RiSunLine, RiMoonLine} from 'react-icons/ri';
// Lógica de estado y tema
import {useTicketLunchStore} from '../store/ticketLunchStore';
import {initTheme, toggleTheme, getSavedTheme} from '../theme';

// Vistas y Componentes
import {Menu} from '../views/Menu';
import {Selection} from '../views/Selection';
import {PaymentSummary} from '../views/PaymentSummary';
import {Tickets} from '../views/Tickets';
import {HeaderLogo} from './HeaderLogo';
import {ExitButton} from './ExitButton';
import {MyTicket} from '../views/MiTicket';
import {Profile} from './Profile'; // Asumo que este es el componente Profile
import {SpecialEvent} from '../views/SpecialEvent';
import {useTasaDia} from '../hooks/useTasaDia';

// --- Componente de Área de Usuario ---
const UserProfileArea = ( {isCollapsed, goToProfile, user = {name: 'John Doe', role: 'Empleado'}} ) => {
    return (
        <button
            onClick={goToProfile}
            className={`w-full flex items-center p-4 transition-colors duration-200 border-b border-blue-800 ${ isCollapsed ? 'justify-center' : 'hover:bg-blue-800' }`}
            title={isCollapsed ? 'Ver Perfil' : ''}
        >
            <IoPersonCircleOutline className="w-8 h-8 rounded-full text-white" />
            {!isCollapsed && (
                <div className="ml-3 text-left">
                    <p className="font-bold text-white text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.role}</p>
                </div>
            )}
        </button>
    );
};

// --- Componente de Tasa BCV ---
const TasaBcvDisplay = ( {bcvRate, isError, isLoading, isCollapsed} ) => {
    let content;
    let icon = <IoCloudDownloadOutline className="w-4 h-4 mr-2" />;

    if ( isLoading ) {
        content = <span className="text-yellow-400">Cargando...</span>;
    } else if ( isError ) {
        icon = <IoAlertCircleOutline className="w-4 h-4 mr-2 text-red-500" />;
        content = <span className="text-red-500">Error Tasa</span>;
    } else {
        content = <strong className="text-white"> Bs. {bcvRate}</strong>;
    }

    return (
        <div className={`py-2 text-xs font-semibold uppercase tracking-wider ${ isCollapsed ? 'text-center' : 'text-left' }`}>
            {!isCollapsed && (
                <div className="flex items-center justify-center text-gray-400">
                    {icon}
                    Tasa BCV:  {content}
                </div>
            )}
            {isCollapsed && ( isLoading || isError ) && (
                <div className="flex justify-center">
                    {icon}
                </div>
            )}
        </div>
    );
};


export const SideBar = ( {initialTab} ) => {
    // --- LÓGICA DE ESTADO Y HOOKS ---
    const isResumenEnabled = useTicketLunchStore( state => state.isResumenEnabled );
    const setResumenEnabled = useTicketLunchStore( state => state.setResumenEnabled );
    const isTicketEnabled = useTicketLunchStore( state => state.isTicketEnabled );
    const setTicketEnabled = useTicketLunchStore( state => state.setTicketEnabled );
    const navigate = useNavigate();

    const {
        bcvRate,
        isError,
        isLoading,
    } = useTasaDia();


    // 🛑 ATENCIÓN: Esta lista de rutas DEBE coincidir 1:1 con el orden de los objetos en el array 'tabs'
    const tabRoutes = [
        '/menu',
        '/my-ticket',
        '/selection',
        '/payment-summary',
        '/tickets',
        '/special-event',
        '/profile', // Índice 6 (oculto en navegación)
    ];


    const tabs = [
        {
            label: 'Menú',
            icon: <IoFastFoodOutline className="w-5 h-5" />,
            content: <Menu />,
            enabled: true,
            group: 'Daily Use'
        }, // Index 0
        {
            label: 'Mi Pedido',
            icon: <IoTicketOutline className="w-5 h-5" />,
            content: (
                <MyTicket goToResumeTab={() => {
                    setResumenEnabled( true );
                    setActiveTab( 3 ); // Corregido: Índice 3 es '/payment-summary'
                    navigate( tabRoutes[ 3 ] );
                }} />
            ),
            enabled: true,
            group: 'Daily Use'
        }, // Index 1
        {
            label: 'Selección',
            icon: <IoReceiptOutline className="w-5 h-5" />,
            content: (
                <>
                    <Selection goToResumeTab={() => {
                        setResumenEnabled( true );
                        setActiveTab( 3 ); // Corregido: Índice 3 es '/payment-summary'
                        navigate( tabRoutes[ 3 ] );
                    }} />
                </>
            ),
            enabled: true,
            group: 'Process'
        }, // Index 2
        {
            label: 'Resumen y Pago',
            icon: <IoSettingsOutline className="w-5 h-5" />,
            content: <PaymentSummary
                goToTicketTab={() => {
                    setTicketEnabled( true );
                    setActiveTab( 4 ); // Índice 4 es '/tickets'
                    navigate( tabRoutes[ 4 ] );
                }}
                goBackSelectionTab={() => {
                    setActiveTab( 2 ); // Corregido: Índice 2 es '/selection'
                    navigate( tabRoutes[ 2 ] );
                }}
                goBackMiTicketTab={() => {
                    setActiveTab( 1 ); // Índice 1 es '/my-ticket'
                    navigate( tabRoutes[ 1 ] );
                }}
            />,
            enabled: isResumenEnabled,
            group: 'Process'
        }, // Index 3
        {
            label: 'Generar Ticket',
            icon: <IoTicketOutline className="w-5 h-5" />,
            content: <Tickets />,
            enabled: isTicketEnabled,
            group: 'Process'
        }, // Index 4
        {
            label: 'Eventos Especiales',
            icon: <IoCalendarOutline className="w-5 h-5" />,
            content: <SpecialEvent />,
            enabled: true,
            group: 'Extra'
        }, // Index 5
        // Perfil (contenido accesible por el UserProfileArea, pero no mostrado en el nav)
        {
            label: 'Perfil',
            icon: null,
            content: <Profile goToResumeTab={() => {setResumenEnabled( true ); setActiveTab( 2 ); /* Volver a Selection */}} />,
            enabled: true,
            group: 'Hidden'
        } // Index 6
    ];

    const tabGroups = [ 'Daily Use', 'Process', 'Extra' ];

    // --- Lógica de Estado y Handlers ---
    const getInitialTabIndex = () => {
        const indexMap = {
            'menu': 0, 'my-ticket': 1, 'selection': 2, 'payment-summary': 3,
            'tickets': 4, 'special-event': 5, 'profile': 6
        };
        return indexMap[ initialTab ] !== undefined ? indexMap[ initialTab ] : 0;
    };

    const [ activeTab, setActiveTab ] = useState( getInitialTabIndex() );
    const [ sideMenuOpen, setSideMenuOpen ] = useState( false );
    const [ isDarkMode, setIsDarkMode ] = useState( false );
    const [ isCollapsed, setIsCollapsed ] = useState( false );

    // Función para navegar al perfil (utilizada por UserProfileArea)
    const goToProfile = () => {
        setActiveTab( 6 ); // Índice del tab Perfil
        navigate( tabRoutes[ 6 ] );
        closeSideMenu();
    }

    // Resto de funciones (useEffect, toggleDarkMode, toggleSideMenu, closeSideMenu, handleSideMenuClick, toggleCollapse) se mantienen.
    useEffect( () => {
        initTheme();
        const savedTheme = getSavedTheme();
        setIsDarkMode( savedTheme === 'dark' );

        const handleResize = () => {
            if ( window.innerWidth < 768 ) {
                setIsCollapsed( true );
            } else if ( window.innerWidth < 1024 ) {
                setIsCollapsed( true );
            } else {
                setIsCollapsed( false );
            }
        };

        handleResize();
        window.addEventListener( 'resize', handleResize );
        return () => window.removeEventListener( 'resize', handleResize );
    }, [] );

    const toggleDarkMode = () => {
        toggleTheme();
        setIsDarkMode( prev => !prev );
    };

    const toggleSideMenu = () => {
        setSideMenuOpen( !sideMenuOpen );
    };

    const closeSideMenu = () => {
        setSideMenuOpen( false );
    };

    const handleSideMenuClick = ( index ) => {
        setActiveTab( index );
        navigate( tabRoutes[ index ] );
        closeSideMenu();
    };

    const toggleCollapse = () => {
        setIsCollapsed( !isCollapsed );
    };

    // --- Renderizado de Elementos ---

    const GroupDivider = ( {isCollapsed} ) => (
        <div className={`my-3 px-3 ${ isCollapsed ? 'hidden' : '' }`}>
            <hr className="border-t border-blue-700/50" />
        </div>
    );

    const renderTabs = () => {
        // Solo iteramos sobre los grupos visibles
        return tabGroups.map( ( group, groupIndex ) => {
            const groupTabs = tabs.filter( tab => tab.group === group );
            if ( groupTabs.length === 0 ) return null;

            return (
                <div key={groupIndex}>
                    {groupIndex > 0 && <GroupDivider isCollapsed={isCollapsed} />}
                    <ul className="space-y-1">
                        {groupTabs.map( ( tab ) => {
                            const tabIndex = tabs.findIndex( t => t.label === tab.label ); // Obtener el índice real
                            return (
                                <li key={tabIndex}>
                                    <button
                                        className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 
                                            ${ activeTab === tabIndex
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'text-gray-300 hover:bg-blue-800'
                                            } ${ isCollapsed ? 'justify-center' : '' } ${ !tab.enabled ? 'opacity-50 cursor-not-allowed' : '' }`}
                                        onClick={() => {
                                            if ( !tab.enabled ) return;
                                            handleSideMenuClick( tabIndex );
                                        }}
                                        title={isCollapsed ? tab.label : ''}
                                        disabled={!tab.enabled}
                                    >
                                        {tab.icon}
                                        {!isCollapsed && <span className="ml-3 font-medium text-sm">{tab.label}</span>}
                                    </button>
                                </li>
                            );
                        } )}
                    </ul>
                </div>
            );
        } );
    };

    // --- RENDERIZADO FINAL ---
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-950 w-full border-0">
            {/* Sidebar Navigation - Left Column */}
            <aside className={`hidden md:flex flex-col bg-blue-950 text-white shadow-xl transition-all duration-300 ease-in-out ${ isCollapsed ? 'w-20' : 'w-72' }`}>

                {/* Logo Area */}
                <div className={`p-4 ${ isCollapsed ? 'flex justify-center' : '' } border-b border-blue-800`}>
                    {isCollapsed ? (
                        <div className="flex items-center justify-center p-1">
                            <img src="./MercalMarker.png" alt="Logo Mercal Collapsed" className="w-8 h-8 rounded-full" />
                        </div>
                    ) : (
                        <div className='text-center'>
                            <img src="./TicketLunchLogo-WHITE.png" alt="Logo Ticket Lunch" className="w-auto h-16 mx-auto" />
                        </div>
                    )}
                </div>

                {/* Área de Perfil de Usuario (Acceso a Perfil) */}
                <UserProfileArea isCollapsed={isCollapsed} goToProfile={goToProfile} />

                {/* Navigation Links */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    {renderTabs()}
                </nav>

                {/* Footer/Utility Area */}
                <div className='p-4 border-t border-blue-800 flex flex-col space-y-2 text-gray-400'>

                    {/* Tasa BCV - Integrada */}
                    <TasaBcvDisplay bcvRate={bcvRate} isError={isError} isLoading={isLoading} isCollapsed={isCollapsed} />

                    {/* Botón de Modo Oscuro/Claro */}
                    <button
                        onClick={toggleDarkMode}
                        className={`p-3 rounded-lg hover:bg-blue-800 transition-colors ${ isCollapsed ? 'w-full flex justify-center' : 'w-full flex items-center' }`}
                        aria-label="Toggle dark mode"
                        title={isCollapsed ? ( isDarkMode ? 'Modo Claro' : 'Modo Oscuro' ) : ''}
                    >
                        {isDarkMode ? <RiSunLine className="w-5 h-5 text-white" /> : <RiMoonLine className="w-5 h-5 text-white" />}
                        {!isCollapsed && <span className="ml-3 font-medium text-sm">Modo {isDarkMode ? 'Claro' : 'Oscuro'}</span>}
                    </button>

                    {/* Botón de Colapsar/Expandir */}
                    <button
                        onClick={toggleCollapse}
                        className={`p-3 rounded-lg hover:bg-blue-800 transition-colors ${ isCollapsed ? 'w-full flex justify-center' : 'w-full flex items-center' }`}
                        aria-label={isCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
                        title={isCollapsed ? "Expandir" : "Colapsar"}
                    >
                        {isCollapsed ? (
                            <IoChevronForwardOutline className="w-5 h-5 text-white" />
                        ) : (
                            <IoChevronBackOutline className="w-5 h-5 text-white" />
                        )}
                        {!isCollapsed && <span className="ml-3 font-medium text-sm">{isCollapsed ? 'Expandir' : 'Colapsar'}</span>}
                    </button>

                    {/* Botón de Salir */}
                    <ExitButton isCollapsed={isCollapsed} />
                </div>
            </aside>

            {/* Main Content Area - Right Column */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header (Mantenido) */}
                <header className="md:hidden bg-blue-950 text-white p-4 flex items-center justify-between shadow-md">
                    <HeaderLogo className="text-white" />
                    <button
                        className="p-2 rounded-lg hover:bg-blue-800 transition-colors"
                        onClick={toggleSideMenu}
                        aria-label="Open menu"
                    >
                        <IoMenuOutline size={28} />
                    </button>
                </header>

                {/* Content Area */}
                <div className="overflow-y-auto w-full flex flex-col items-center gap-4 h-screen dark:bg-gray-950 p-4 md:p-8 lg:py-4 shadow-xl">
                    {tabs[ activeTab ].content}
                </div>
            </main>

            {/* Mobile Side Menu (Mantenido) */}
            <div
                className={`fixed top-0 -right-0 bottom-0 w-64 z-50 bg-blue-950 text-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${ sideMenuOpen ? '-translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* ... (Mobile Header/Cierre sin cambios) ... */}

                <div className="p-4 border-b border-blue-800 flex justify-between items-center">
                    <HeaderLogo className="text-white" />
                    <button
                        className="text-white p-2 rounded-lg hover:bg-blue-800 transition-colors"
                        onClick={closeSideMenu}
                        aria-label="Close menu"
                    >
                        <IoCloseOutline size={28} />
                    </button>
                </div>

                <nav className="p-4 overflow-y-auto h-full">
                    <UserProfileArea isCollapsed={false} goToProfile={goToProfile} />
                    <ul className="space-y-2">
                        {/* Se ajustó el mapeo para evitar iterar sobre el tab 'Perfil' que tiene icon: null */}
                        {tabs.filter( t => t.icon ).map( ( tab ) => {
                            const tabIndex = tabs.findIndex( t => t.label === tab.label ); // Obtener el índice real
                            return (
                                <li key={tabIndex}>
                                    <button
                                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${ activeTab === tabIndex
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'hover:bg-blue-800 text-gray-300'
                                            } ${ !tab.enabled ? 'opacity-50 cursor-not-allowed' : '' }`}
                                        onClick={() => {
                                            if ( !tab.enabled ) return;
                                            handleSideMenuClick( tabIndex );
                                        }}
                                        disabled={!tab.enabled}
                                    >
                                        {tab.icon}
                                        <span className="ml-3 font-medium">{tab.label}</span>
                                    </button>
                                </li>
                            )
                        } )}
                    </ul>

                    <div className="absolute bottom-4 left-4 right-4 flex flex-col space-y-2 border-t border-blue-800 pt-4">
                        <TasaBcvDisplay bcvRate={bcvRate} isError={isError} isLoading={isLoading} isCollapsed={false} />
                        <button
                            onClick={toggleDarkMode}
                            className="w-full flex items-center p-3 rounded-lg hover:bg-blue-800 transition-colors text-white"
                        >
                            {isDarkMode ? <RiSunLine className="w-5 h-5" /> : <RiMoonLine className="w-5 h-5" />}
                            <span className="ml-3 font-medium text-sm">Modo {isDarkMode ? 'Claro' : 'Oscuro'}</span>
                        </button>
                        <ExitButton isCollapsed={false} />
                    </div>

                </nav>
            </div>
        </div>
    );
};