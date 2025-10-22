import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router';
import {FaUser, FaCog, FaTicketAlt} from 'react-icons/fa';
import {IoFastFood} from "react-icons/io5";
import {IoMenuOutline} from "react-icons/io5";
import {IoMdClose} from "react-icons/io";
import {RiSunLine, RiMoonLine} from 'react-icons/ri';
import {FaUsers} from "react-icons/fa6";
import {MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos} from 'react-icons/md';
import {useTicketLunchStore} from '../store/ticketLunchStore';
import {ImQrcode} from "react-icons/im";
import {MdOutlineEventAvailable} from "react-icons/md";

import {Menu} from '../views/Menu';
import {Selection} from '../views/Selection';
import {PaymentSummary} from '../views/PaymentSummary';
import {Tickets} from '../views/Tickets';
// import {SelectionMobile} from '../views/SelectionMobile';
import {HeaderLogo} from './HeaderLogo';
import {ExitButton} from './ExitButton'; // Mantener si ExitButton tiene lógica específica, sino integrar aquí
import {initTheme, toggleTheme, getSavedTheme} from '../theme';
import {MyTicket} from '../views/MiTicket';
import {Profile} from './Profile';
import {SpecialEvent} from '../views/SpecialEvent';

export const SideBar = ( {initialTab} ) => {
    // Store flags para habilitar/deshabilitar tabs
    const isResumenEnabled = useTicketLunchStore( state => state.isResumenEnabled );
    const setResumenEnabled = useTicketLunchStore( state => state.setResumenEnabled );
    const isTicketEnabled = useTicketLunchStore( state => state.isTicketEnabled );
    const setTicketEnabled = useTicketLunchStore( state => state.setTicketEnabled );
    const navigate = useNavigate();
    const tabRoutes = [
        '/menu',
        '/my-ticket',
        '/profile',
        '/selection',
        '/payment-summary',
        '/tickets',
        '/special-event',
    ];
    const tabs = [
        {
            label: 'Menú',
            icon: <IoFastFood className="w-5 h-5" />,
            content: <Menu />,
            enabled: true,
        },
        {
            label: 'Mi Ticket',
            icon: <ImQrcode className="w-5 h-5" />,
            content: (
                <MyTicket goToResumeTab={() => {
                    setResumenEnabled( true );
                    setActiveTab( 4 ); // Correct tab index for 'Resumen y Pago'
                    navigate( tabRoutes[ 4 ] ); // Navigate to '/payment-summary'
                }} />
            ),
            enabled: true,
        },
        {
            label: 'Perfil',
            icon: <FaUser className="w-5 h-5" />,
            content: (
                <>
                    <Profile goToResumeTab={() => {
                        setResumenEnabled( true );
                        setActiveTab( 3 );
                    }} />
                </>
            ),
            enabled: true,
        },
        {
            label: 'Selección',
            icon: <FaUsers className="w-5 h-5" />,
            content: (
                <>
                    <Selection goToResumeTab={() => {
                        setResumenEnabled( true );
                        setActiveTab( 4 );
                    }} />
                </>
            ),
            enabled: true,
        },
        {
            label: 'Resumen y Pago',
            icon: <FaCog className="w-5 h-5" />,
            content: <PaymentSummary
                goToTicketTab={() => {
                    setTicketEnabled( true );
                    setActiveTab( 5 );
                    navigate( tabRoutes[ 5 ] );
                }}
                goBackSelectionTab={() => {
                    setActiveTab( 3 );
                    navigate( tabRoutes[ 2 ] );
                }}
                goBackMiTicketTab={() => {
                    setActiveTab( 1 );
                    navigate( tabRoutes[ 1 ] );
                }}
            />,
            enabled: isResumenEnabled,
        },
        {
            label: 'Generar Ticket',
            icon: <FaTicketAlt className="w-5 h-5" />,
            content: <Tickets />,
            enabled: isTicketEnabled,
        },
        {
            label: 'Eventos Especiales',
            icon: <MdOutlineEventAvailable className="w-5 h-5" />,
            content: <SpecialEvent />,
            enabled: true,
        },
    ];

    const getInitialTabIndex = () => {
        switch ( initialTab ) {
            case 'menu': return 0;
            case 'my-ticket': return 1;
            case 'profile': return 2;
            case 'selection': return 3;
            case 'payment-summary': return 4;
            case 'generar-ticket': return 5;
            case 'special-event': return 6;
            default: return 0;
        }
    };
    const [ activeTab, setActiveTab ] = useState( getInitialTabIndex() );
    const [ sideMenuOpen, setSideMenuOpen ] = useState( false );
    const [ isDarkMode, setIsDarkMode ] = useState( false );
    const [ isCollapsed, setIsCollapsed ] = useState( false );

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

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 w-full">
            {/* Sidebar Navigation - Left Column */}
            <aside className={`hidden md:flex flex-col bg-gradient-to-t from-blue-950 from-80% to-white text-white shadow-lg transition-all duration-300 ease-in-out ${ isCollapsed ? 'w-16' : 'w-64' }`}>
                <div className={`border-0 border-red-500 ${ isCollapsed ? 'flex justify-center' : '' }`}>
                    {isCollapsed ? (
                        <div className="rounded-full flex items-center justify-center">
                            <img src="./MercalMarker.png" alt="Logo Mercal Collapsed" />
                        </div>
                    ) : (
                        // <HeaderLogo className="text-white" />
                        <div className='p-4 text-center'>
                            {/* <h1>TICKET LUNCH</h1> */}
                            <img src="./TicketLunchLogo-removebg-preview.png" alt="Logo Mercal Collapsed" />
                        </div>
                    )}
                </div>

                <nav className="flex-1 p-2">
                    <ul className="space-y-1">
                        {tabs.map( ( tab, index ) => (
                            <li key={index}>
                                <button
                                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${ activeTab === index
                                        ? 'bg-white text-blue-800 shadow-md border-l-4 border-white'
                                        : 'text-white hover:bg-blue-600'
                                        } ${ isCollapsed ? 'justify-center' : '' } ${ !tab.enabled ? 'opacity-50 cursor-not-allowed' : '' }`}
                                    onClick={() => {
                                        if ( !tab.enabled ) return;
                                        setActiveTab( index );
                                        navigate( tabRoutes[ index ] );
                                    }}
                                    title={isCollapsed ? tab.label : ''}
                                    disabled={!tab.enabled}
                                >
                                    {tab.icon}
                                    {!isCollapsed && <span className="ml-3 font-medium text-sm">{tab.label}</span>}
                                </button>
                            </li>
                        ) )}
                    </ul>
                </nav>

                <div className="p-2 flex flex-col items-center space-y-2">
                    {/* Botón de Modo Oscuro/Claro */}
                    <button
                        onClick={toggleDarkMode}
                        className={`p-2 rounded-lg hover:bg-blue-600 transition-colors ${ isCollapsed ? 'w-full flex justify-center' : 'w-full flex items-center' }`}
                        aria-label="Toggle dark mode"
                        title={isCollapsed ? ( isDarkMode ? 'Modo Claro' : 'Modo Oscuro' ) : ''}
                    >
                        {isDarkMode ? <RiSunLine className="w-5 h-5 text-white" /> : <RiMoonLine className="w-5 h-5 text-white" />}
                        {!isCollapsed && <span className="ml-3 font-medium text-sm">Modo {isDarkMode ? 'Claro' : 'Oscuro'}</span>}
                    </button>

                    {/* Botón de Colapsar/Expandir */}
                    <button
                        onClick={toggleCollapse}
                        className={`p-2 rounded-lg hover:bg-blue-600 transition-colors ${ isCollapsed ? 'w-full flex justify-center' : 'w-full flex items-center' }`}
                        aria-label={isCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
                        title={isCollapsed ? "Expandir" : "Colapsar"}
                    >
                        {isCollapsed ? (
                            <MdOutlineArrowForwardIos className="w-5 h-5 text-white" />
                        ) : (
                            <MdOutlineArrowBackIosNew className="w-5 h-5 text-white" />
                        )}
                        {!isCollapsed && <span className="ml-3 font-medium text-sm">{isCollapsed ? 'Expandir' : 'Colapsar'}</span>}
                    </button>

                    {/* Botón de Salir - Integrado */}
                    <ExitButton isCollapsed={isCollapsed} />
                </div>
            </aside>

            {/* Main Content Area - Right Column */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-blue-900 text-white p-4 flex items-center justify-between">
                    <HeaderLogo className="text-white" />
                    <button
                        className="p-2"
                        onClick={toggleSideMenu}
                        aria-label="Open menu"
                    >
                        <IoMenuOutline size={24} />
                    </button>
                </header>

                {/* Content Area */}
                <div className="overflow-y-auto w-full flex flex-col items-center  gap-4 h-screen dark:bg-gray-950 p-4 md:p-8 lg:py-4 shadow-xl">
                    {tabs[ activeTab ].content}
                </div>
            </main>

            {/* Mobile Side Menu */}
            <div
                className={`fixed top-0 -right-0 bottom-0 w-64 z-50 bg-gradient-to-t from-blue-950 to-blue-700 text-white transition-transform duration-500 ease-in-out md:hidden ${ sideMenuOpen ? '-translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-4 border-b border-blue-800 flex justify-between items-center">
                    <HeaderLogo className="text-white" />
                    <button
                        className="text-white p-1"
                        onClick={closeSideMenu}
                        aria-label="Close menu"
                    >
                        <IoMdClose size={25} />
                    </button>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        {tabs.map( ( tab, index ) => (
                            <li key={index}>
                                <button
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${ activeTab === index
                                        ? 'bg-white text-blue-900'
                                        : 'hover:bg-blue-800'
                                        } ${ !tab.enabled ? 'opacity-50 cursor-not-allowed' : '' }`}
                                    onClick={() => {
                                        if ( !tab.enabled ) return;
                                        handleSideMenuClick( index );
                                    }}
                                    disabled={!tab.enabled}
                                >
                                    {tab.icon}
                                    <span className="ml-3 font-medium">{tab.label}</span>
                                </button>
                            </li>
                        ) )}
                    </ul>
                </nav>
                <hr />

                <div className="absolute bottom-4 left-4 right-4 flex flex-col space-y-2 border-2">
                    <button
                        onClick={toggleDarkMode}
                        className="w-full flex justify-center items-center p-3 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                        {isDarkMode ? <RiSunLine className="w-5 h-5 text-white" /> : <RiMoonLine className="w-5 h-5 text-white" />}
                        {/* <span className="ml-3 font-medium text-sm">Modo {isDarkMode ? 'Claro' : 'Oscuro'}</span> */}
                    </button>
                    <ExitButton isCollapsed={isCollapsed} />
                </div>
            </div>
        </div>
    );
};