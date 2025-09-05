import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router';
import {FaTachometerAlt, FaUser, FaCog, FaFileAlt, FaTicketAlt} from 'react-icons/fa';
import {IoFastFood} from "react-icons/io5";
import {FiLogOut} from 'react-icons/fi'; // Nuevo icono para salir
// import {IoMenu} from "react-icons/io"; // Usando IoMenu para hamburguesa
import {IoMenuOutline} from "react-icons/io5";
import {IoMdClose} from "react-icons/io";
import {RiSunLine, RiMoonLine} from 'react-icons/ri'; // Iconos para modo claro/oscuro
import {MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos} from 'react-icons/md'; // Iconos para colapsar

import {ContentMenu} from './ContentMenu';
import {ContentSeleccion} from './ContentSeleccion';
import {ContentResume} from './ContentResumePago';
import {ContentTicket} from './ContentTicket';
import {ContentSeleccionMobile} from './ContentSeleccionMobile';
import {HeaderLogo} from './HeaderLogo';
import {ExitButton} from './ExitButton'; // Mantener si ExitButton tiene lógica específica, sino integrar aquí
import {initTheme, toggleTheme, getSavedTheme} from '../theme';

export const SideBar = ( {initialTab} ) => {
    const navigate = useNavigate();
    const tabRoutes = [
        '/menu',
        '/seleccion',
        '/resumen-pago',
        '/generar-ticket',
    ];
    const tabs = [
        {
            label: 'Menú',
            icon: <IoFastFood className="w-5 h-5" />,
            content: <ContentMenu />,
        },
        {
            label: 'Selección',
            icon: <FaUser className="w-5 h-5" />,
            content: (
                <>
                    <div className="hidden md:block w-full">
                        <ContentSeleccion goToResumeTab={() => setActiveTab( 2 )} />
                    </div>
                    <div className="block md:hidden">
                        <ContentSeleccionMobile goToResumeTab={() => setActiveTab( 2 )} />
                    </div>
                </>
            ),
        },
        {
            label: 'Resumen y Pago',
            icon: <FaCog className="w-5 h-5" />,
            content: <ContentResume goToTicketTab={() => setActiveTab( 3 )} />,
        },
        {
            label: 'Generar Ticket',
            icon: <FaTicketAlt className="w-5 h-5" />,
            content: <ContentTicket />,
        },
    ];

    const getInitialTabIndex = () => {
        switch ( initialTab ) {
            case 'menu': return 0;
            case 'seleccion': return 1;
            case 'resumen-pago': return 2;
            case 'generar-ticket': return 3;
            default: return 1;
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
            <aside className={`hidden md:flex flex-col bg-gradient-to-t from-blue-950 to-blue-700 text-white shadow-lg transition-all duration-300 ease-in-out ${ isCollapsed ? 'w-16' : 'w-64' }`}>
                <div className={`p-4 border-b border-blue-900 ${ isCollapsed ? 'flex justify-center' : '' }`}>
                    {isCollapsed ? (
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <span className="text-blue-900 font-bold text-sm">M</span>
                        </div>
                    ) : (
                        <HeaderLogo className="text-white" />
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
                                        } ${ isCollapsed ? 'justify-center' : '' }`}
                                    onClick={() => {
                                        setActiveTab( index );
                                        navigate( tabRoutes[ index ] );
                                    }}
                                    title={isCollapsed ? tab.label : ''}
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
                                        }`}
                                    onClick={() => handleSideMenuClick( index )}
                                >
                                    {tab.icon}
                                    <span className="ml-3 font-medium">{tab.label}</span>
                                </button>
                            </li>
                        ) )}
                    </ul>
                </nav>

                <div className="absolute bottom-4 left-4 right-4 flex flex-col space-y-2">
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