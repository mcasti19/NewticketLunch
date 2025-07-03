import React, {useEffect, useState} from 'react';
import {useAuthStore} from '../store/authStore';
import users from '../data/mockDataUsers.json';
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router';

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
        console.log(user);
        
        if ( user ) {
            // Simulate token creation with expiration 1 hour from now
            const token = 'fake-jwt-token';
            const expiration = new Date().getTime() + 5 * 60 * 1000;

            login( user, token, expiration ); // Inicia sesión en Zustand store

            Swal.fire( {
                title: "Successfully logged in",
                text: "Welcome to the System",
                icon: "success"
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
    }, [isAuthenticated, navigate]);

    return (
        <div className='w-screen h-screen bg-slate-950 flex justify-center items-center'>
            <form onSubmit={handleSubmit} className='bg-sky-200 p-8 rounded-lg shadow-lg flex flex-col w-3/4 max-w-[25rem]'>
                <h2 className='text-2xl font-bold text-center mb-6'>Iniciar Sesión</h2>
                <input
                    type="email"
                    value={email}
                    onChange={( e ) => setEmail( e.target.value )}
                    placeholder="Correo electrónico"
                    required
                    className='mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500'
                />
                <input
                    type="password"
                    value={password}
                    onChange={( e ) => setPassword( e.target.value )}
                    placeholder="Contraseña"
                    required
                    className='mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500'
                />
                <button
                    type="submit"
                    className='bg-sky-500 text-white font-semibold py-2 rounded hover:bg-sky-600 transition duration-200'
                >
                    Iniciar Sesión
                </button>
            </form>
        </div>

    );
};

export default LoginPage;
