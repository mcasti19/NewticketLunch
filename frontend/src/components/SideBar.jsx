import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router';
import {FaTachometerAlt, FaUser, FaCog, FaFileAlt, FaTicketAlt} from 'react-icons/fa';
import { IoFastFood } from "react-icons/io5";

import {ContentMenu} from './ContentMenu';
import {ContentSeleccion} from './ContentSeleccion';
import {ContentResume} from './ContentResume';
// import {ContentPago} from './ContentPago';
import {ContentTicket} from './ContentTicket';
import {ContentSeleccionMobile} from './ContentSeleccionMobile';
import {HeaderLogo} from './HeaderLogo';
import {ExitButton} from './ExitButton';
import {initTheme, toggleTheme, getSavedTheme} from '../theme';
import {IoMdClose} from "react-icons/io";
import {GiHamburgerMenu} from "react-icons/gi";

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
                    <div className="hidden md:block">
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

    // Determinar tab inicial por prop
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

        // Detect screen size for sidebar behavior
        const handleResize = () => {
            if ( window.innerWidth < 768 ) {
                setIsCollapsed( true ); // Completely hidden on small screens
            } else if ( window.innerWidth < 1024 ) {
                setIsCollapsed( true ); // Collapsed on medium screens
            } else {
                setIsCollapsed( false ); // Expanded on large screens
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
            <aside className={`hidden md:flex flex-col bg-[#0D6EFD] text-white shadow-lg transition-all duration-300 ease-in-out ${ isCollapsed ? 'w-16' : 'w-64' }`}>
                <div className={`p-4 border-b border-blue-600 ${ isCollapsed ? 'flex justify-center' : '' }`}>
                    {isCollapsed ? (
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <span className="text-[#0D6EFD] font-bold text-sm">M</span>
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
                                        ? 'bg-white text-[#0D6EFD] shadow-md'
                                        : 'text-white hover:bg-blue-600 hover:text-white'
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

                <div className={`p-2 border-t border-blue-600 ${ isCollapsed ? 'flex flex-col items-center space-y-2' : '' }`}>
                    <button
                        onClick={toggleDarkMode}
                        className={`p-2 rounded-lg hover:bg-blue-600 transition-colors ${ isCollapsed ? 'w-full flex justify-center' : '' }`}
                        aria-label="Toggle dark mode"
                    >
                        {
                            isDarkMode
                                ? <img src='./sun-icon.png' alt='' className='w-5' />
                                : <img src='./moon-icon.png' alt='' className='w-5' />
                        }
                    </button>
                    {!isCollapsed && <div className="border-t border-blue-600 my-2"></div>}
                    <button
                        onClick={toggleCollapse}
                        className={`p-2 rounded-lg hover:bg-blue-600 transition-colors ${ isCollapsed ? 'w-full flex justify-center' : 'w-full' }`}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        )}
                    </button>
                    {!isCollapsed && <ExitButton className="cursor-pointer mt-2" color="white" />}
                </div>
            </aside>

            {/* Main Content Area - Right Column */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-[#0D6EFD] text-white p-4 flex items-center justify-between">
                    <HeaderLogo className="text-white" />
                    <button
                        className="p-2"
                        onClick={toggleSideMenu}
                        aria-label="Open menu"
                    >
                        <GiHamburgerMenu size={24} />
                    </button>
                </header>

                {/* Content Area */}
                <div className="overflow-y-auto lg:overflow-y-hidden w-full flex flex-col items-center justify-between md:justify-center gap-4 h-screen dark:bg-gray-950 p-4 md:p-8 lg:py-4 shadow-xl">
                    {tabs[ activeTab ].content}
                </div>
            </main>

            {/* Mobile Side Menu */}
            <div
                className={`fixed top-0 left-0 bottom-0 w-64 z-50 bg-blue-100 dark:bg-slate-950 text-gray-900 dark:text-amber-50 transition-transform duration-500 ease-in-out md:hidden ${ sideMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <button
                        className="absolute top-4 right-4"
                        onClick={closeSideMenu}
                        aria-label="Close menu"
                    >
                        <IoMdClose color='black' size={25} />
                    </button>
                    <HeaderLogo className="" />
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        {tabs.map( ( tab, index ) => (
                            <li key={index}>
                                <button
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${ activeTab === index
                                        ? 'text-blue-500 bg-blue-50 dark:bg-gray-700'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    onClick={() => handleSideMenuClick( index )}
                                >
                                    {tab.icon}
                                    <span className="ml-3">{tab.label}</span>
                                </button>
                            </li>
                        ) )}
                    </ul>
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            {
                                isDarkMode
                                    ? <img src='./sun-icon.png' alt='' className='w-5' />
                                    : <img src='./moon-icon.png' alt='' className='w-5' />
                            }
                        </button>
                        <ExitButton className="cursor-pointer" color="black" />
                    </div>
                </div>
            </div>
        </div>
    );
};