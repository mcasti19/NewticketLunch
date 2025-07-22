import React, {useEffect, useState} from 'react';
import {useAuthStore} from '../store/authStore';
import users from '../data/mockDataUsers.json';
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router';
// import logoComedor from '../../public/logoComedor.png';

const LoginPage = () => {
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const login = useAuthStore( ( state ) => state.login );
    const isAuthenticated = useAuthStore( ( state ) => state.isAuthenticated );
    const navigate = useNavigate();

    const handleSubmit = ( e ) => {
        e.preventDefault();
        // Buscar usuario en mockData.json
        const user = users.find( u => u.email === email && u.password === password );
        console.log( user );

        if ( user ) {
            // Simulate token creation with expiration 1 hour from now
            const token = 'fake-jwt-token';
            const expiration = new Date().getTime() + 5 * 60 * 1000;

            login( user, token, expiration ); // Inicia sesión en Zustand store

            Swal.fire( {
                title: "Successfully logged in",
                text: "Welcome to the System",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            } );

        } else {
            Swal.fire( {
                title: "Invalid Credentials",
                text: "Check Credentials and try again!!!",
                icon: "error"
            } );
        }
    };

    useEffect( () => {
        if ( isAuthenticated ) {
            navigate( '/home' );
        }
    }, [ isAuthenticated, navigate ] );

    return (
        <div className='w-4/5 h-screen grid grid-cols-1 md:grid-cols-2 justify-center items-center border-1 border-slate-300 m-auto'>
            {/* Sección izquierda */}
            <div className='flex flex-col items-center justify-center gap-3 text-white p-8 border-0'>

                <div className='flex flex-col items-center gap-2 text-shadow-amber-200'>
                    <h1 className='text-4xl font-bold mb-2 text-red-700 dark:text-white'>TICKETLUNCH</h1>
                    <img src="/comedor.jpg" alt="image_comedor" className='w-96 rounded-2xl' />
                    <p className='text-lg text-red-800 dark:text-white text-center'>Bienvenido a nuestra aplicación.</p>
                    <p className='text-lg text-red-800 dark:text-white text-center'>Inicia sesión para continuar.</p>
                </div>
            </div>

            {/* Sección derecha */}
            <div className='flex flex-col justify-center items-center border-l-0'>
                <picture className='hidden md:block w-48'>
                    <img src="/MercalMarker.png" alt="Logo" className='img_shadow w-full h-full' />
                </picture>
                <div className='md:h-96 border-0 backdrop-blur-lg opacity-80 form_shadow w-4/5 md:w-[60%]'>
                    <form onSubmit={handleSubmit} className=' bg-white p-8 rounded-lg h-full border-0 flex flex-col justify-evenly'>
                        <h2 className='text-2xl font-bold text-center mb-6 text-blue-600'>Iniciar Sesión</h2>
                        <div className='relative mb-4'>
                            <img src="/user.svg" alt="user icon" className='w-5 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none' />
                            <input
                                type="email"
                                value={email}
                                onChange={( e ) => setEmail( e.target.value )}
                                placeholder="Correo electrónico"
                                required
                                className='pl-10 p-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
                            />
                        </div>
                        <div className='relative mb-4'>
                            <img src="/pass.svg" alt="password icon" className='w-5 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none' />
                            <input
                                type="password"
                                value={password}
                                onChange={( e ) => setPassword( e.target.value )}
                                placeholder="Contraseña"
                                required
                                className='pl-10 p-2 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
                            />
                        </div>
                        <button
                            type="submit"
                            className='bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200 w-full'
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
