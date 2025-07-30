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
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-slate-900 flex justify-center items-center">
            <div className='w-4/5 h-auto justify-center items-center border-0 border-slate-300 m-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden'>

                {/* Sección superior */}

                < div className='flex flex-col justify-center items-center p-6' >
                    <picture className='md:block w-48'>
                        <img src="/MercalMarker.png" alt="Logo" className='img_shadow w-full h-full' />
                    </picture>
                    <h1 className='text-4xl font-bold mb-2 text-red-600'>TICKETLUNCH</h1>
                </ div>

                <div className='grid grid-cols-1 md:grid-cols-2 items-center'>
                    {/* Sección izquierda */}
                    <div className='md:flex flex-col items-center justify-center gap-3 h-full text-white p-8 border-0 hidden'>
                        <div className='md:flex flex-col items-center gap-2 text-shadow-amber-200 '>
                            {/* <h1 className='text-4xl font-bold mb-2 text-red-700 dark:text-white'>TICKETLUNCH</h1> */}
                            <img src="/comedor.jpg" alt="image_comedor" className='w-96 rounded-2xl' />
                            <p className='text-lg text-white text-center'>Bienvenido a nuestra aplicación.</p>
                            <p className='text-lg text-white text-center'>Inicia sesión para continuar.</p>
                        </div>
                    </div>

                    {/* Sección derecha */}
                    <div className='flex flex-col justify-center items-center p-6 border-2'>
                        {/* <picture className='hidden md:block w-48'>
                        <img src="/MercalMarker.png" alt="Logo" className='img_shadow w-full h-full' />
                    </picture> */}
                        <div className='md:h-96 border-0 w-4/5 md:w-full'>
                            <form onSubmit={handleSubmit} className='bg-white/90 backdrop-blur-lg p-6 rounded-lg h-full border-0 flex flex-col justify-center shadow-lg'>
                                <h2 className='text-2xl font-bold text-center mb-6 text-red-600'>Iniciar Sesión</h2>
                                <div className='relative mb-4'>
                                    <img src="/user.svg" alt="user icon" className='w-5 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none' />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={( e ) => setEmail( e.target.value )}
                                        placeholder="Correo electrónico"
                                        required
                                        className='pl-10 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white/50 text-black placeholder-gray-600'
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
                                        className='pl-10 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white/50 text-black placeholder-gray-600'
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className='bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200 w-full'
                                >
                                    Iniciar Sesión
                                </button>
                                <div className='text-center mt-4'>
                                    <a href='#' className='text-blue hover:underline'>
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;   