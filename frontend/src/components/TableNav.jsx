import React, {useState, useEffect} from 'react';
import {FaTachometerAlt, FaUser, FaCog, FaFileAlt, FaTicketAlt} from 'react-icons/fa';
import {ContentMenu} from './ContentMenu';
import {ContentSeleccion} from './ContentSeleccion';
import {ContentResume} from './ContentResume';
import {ContentPago} from './ContentPago';
import {ContentTicket} from './ContentTicket';
import {ContentSeleccionMobile} from './ContentSeleccionMobile';
import {HeaderLogo} from './HeaderLogo';
import {HeaderExit} from './HeaderExit';
import {initTheme, toggleTheme, getSavedTheme} from '../theme';
import {IoMdClose} from "react-icons/io";
import {GiHamburgerMenu} from "react-icons/gi";



export const TableNav = () => {
    const tabs = [
        {
            label: 'Menú',
            icon: <FaTachometerAlt className="w-4 h-4 mr-1.5 text-gray" />,
            content: <ContentMenu />,
        },
        {
            label: 'Selección',
            icon: <FaUser className="w-4 h-4 mr-1.5 text-gray" />,
            content: (
                <>
                    <ContentSeleccion /> <ContentSeleccionMobile />
                </>
            ),
        },
        {
            label: 'Resumen y Pago',
            icon: <FaCog className="w-4 h-4 ml-1.5 text-gray" />,
            content: <ContentResume />,
        },
        {
            label: 'Generar Ticket',
            icon: <FaTicketAlt className="w-4 h-4 ml-1.5 text-gray" />,
            content: <ContentTicket />,
        },
    ];

    const [ activeTab, setActiveTab ] = useState( 0 );
    const [ sideMenuOpen, setSideMenuOpen ] = useState( false );
    const [ isDarkMode, setIsDarkMode ] = useState( false );

    useEffect( () => {
        initTheme();
        const savedTheme = getSavedTheme();
        setIsDarkMode( savedTheme === 'dark' );
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
        closeSideMenu();
    };

    return (
        <>
            {/* Fixed navbar container */}
            <nav className="fixed h-20 top-0 left-0 w-full z-50 bg-[#0D6EFD]">
                <div className="w-[90vw] mx-auto flex items-center justify-between py-0">
                    <HeaderLogo className="hidden md:block" />
                    {/* Tab grid for md and up */}
                    <div className="hidden md:flex gap-4 w-[70vw] max-w-5xl mx-auto">
                        {tabs.map( ( tab, index ) => (
                            <span key={index} className="flex-auto text-center">
                                <button
                                    className={`flex items-center justify-center w-full px-0 py-2 mb-0 text-sm transition-all ease-in-out border-0 rounded-md cursor-pointer ${ activeTab === index
                                        ? 'text-black border-b-2  bg-white'
                                        : 'text-slate-100 bg-inherit hover:text-gray-400 hover:border-gray-300'
                                        }`}
                                    onClick={() => setActiveTab( index )}
                                    role="tab"
                                    aria-selected={activeTab === index}
                                >
                                    {tab.icon}
                                    <span className="ml-1">{tab.label}</span>
                                </button>
                            </span>
                        ) )}
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className="hidden md:block mr-4 p-2 rounded transition cursor-pointer"
                        aria-label="Toggle dark mode"
                    >
                        {
                            isDarkMode
                                ? <img src='./sun-icon.png' alt='' className='w-5' />
                                : <img src='./moon-icon.png' alt='' className='w-5' />
                        }
                    </button>
                    <HeaderExit className="hidden md:block cursor-pointer " color="white" />

                    {/* Hamburger menu button for small screens */}
                    <button
                        className="md:hidden flex items-center justify-center p-2 text-slate-100"
                        onClick={toggleSideMenu}
                        aria-label="Open menu"
                    >
                        <GiHamburgerMenu />
                    </button>
                </div>

                {/* Side menu sliding from right */}
                <div
                    className={`fixed top-0 right-0 bottom-0 w-64 z-50 bg-blue-100 dark:bg-slate-950 text-gray-900 dark:text-amber-50 transition-transform duration-500 ease-in-out ${ sideMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        } flex flex-col py-28 px-6 md:hidden border-0`}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-8 right-8"
                        onClick={closeSideMenu}
                        aria-label="Close menu"
                    >
                        <IoMdClose color='black' size={25} />
                    </button>

                    {/* Side menu tabs */}
                    <ul className="flex flex-col gap-10 text-center items-center">
                        <HeaderLogo className="" />
                        {tabs.map( ( tab, index ) => (
                            <li key={index} className='cursor-pointer'>
                                <button
                                    className={`w-full text-left text-lg transition-colors ${ activeTab === index ? 'text-blue-500' : 'hover:text-gray-400 cursor-pointer'
                                        }`}
                                    onClick={() => handleSideMenuClick( index )}
                                >
                                    <span className="inline-flex items-center">
                                        {tab.icon}
                                        <span className="ml-2">{tab.label}</span>
                                    </span>
                                </button>
                            </li>
                        ) )}
                    </ul>


                    <div className='mt-5 border-0  w-full flex gap-5 flex-col justify-center items-center'>
                        <div></div>
                        <button
                            onClick={toggleDarkMode}
                            className="border-0 block grow md:hidden rounded transition cursor-pointer"
                            aria-label="Toggle dark mode"
                        >
                            {
                                isDarkMode
                                    ? <img src='./sun-icon.png' alt='' className='w-5' />
                                    : <img src='./moon-icon.png' alt='' className='w-5' />
                            }
                        </button>
                        <HeaderExit className="border-0 block md:hidden"
                            color={
                                isDarkMode
                                    ? "White"
                                    : "black"
                            }
                        />
                    </div>
                </div>
            </nav>

            {/* Spacer div to prevent content being hidden behind fixed navbar */}
            <div className="h-24"></div>

            {/* Active tab content */}
            <div className="border-0 border-blue-800 w-full rounded-md shadow-2xl text-black dark:text-amber-50 max-w-[90vw]">
                {tabs[ activeTab ].content}
            </div>
        </>
    );
};
