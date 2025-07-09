import React, {useEffect, useState} from 'react';
import {useAuthStore} from '../store/authStore';
import users from '../data/mockDataUsers.json';
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router';
import logoComedor from '/logoComedor.png';

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
        <div className='w-screen h-screen grid grid-cols-1 md:grid-cols-2'>
            {/* Sección izquierda */}
            <div className='flex flex-col items-center gap-3 text-white p-8 border-0'>
                <picture className='w-52'>
                    <img src={logoComedor} alt="Logo" className='img_shadow w-full h-full' />
                </picture>
                <h1 className='text-4xl font-bold mb-2 text-red-700'>TICKETLUNCH</h1>
                <p className='text-lg text-red-800'>Bienvenido a nuestra aplicación.</p>
                <p className='text-lg text-red-800'>Inicia sesión para continuar.</p>
                <img src="/comedor.jpg" alt="image_comedor" className='w-96 rounded-2xl' />
            </div>

            {/* Sección derecha */}
            <div className='flex flex-col justify-center items-center border-l-2'>
                <div className='h-96 border-0 backdrop-blur-lg opacity-80 form_shadow'>
                    <form onSubmit={handleSubmit} className=' bg-white p-8 rounded-lg shadow-2xl w-96 h-full border-0 flex flex-col justify-evenly'>
                        <h2 className='text-2xl font-bold text-center mb-6 text-blue-600'>Iniciar Sesión</h2>
                        <input
                            type="email"
                            value={email}
                            onChange={( e ) => setEmail( e.target.value )}
                            placeholder="Correo electrónico"
                            required
                            className='mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={( e ) => setPassword( e.target.value )}
                            placeholder="Contraseña"
                            required
                            className='mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
                        />
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