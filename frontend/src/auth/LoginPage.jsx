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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex justify-center items-center px-2 py-4">
        <div className="w-full max-w-3xl mx-auto bg-white/80 shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row border border-blue-200">
          {/* Lado Derecho: Login (en mobile va primero) */}
          <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-4 md:p-10 bg-white/90 order-1 md:order-none">
            <div className="flex flex-col items-center mb-4">
              <img src="/MercalMarker.png" alt="Logo" className="w-20 h-20 mb-2 drop-shadow-md" />
              <h2 className="text-2xl font-bold text-blue-700 mb-1 tracking-wide">Iniciar Sesión</h2>
            </div>
            <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-4 mx-auto">
              <div className="relative">
                <img src="/user.svg" alt="user icon" className="w-5 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-70" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  required
                  className="pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full bg-white text-gray-800 placeholder-gray-500 shadow-sm"
                />
              </div>
              <div className="relative">
                <img src="/pass.svg" alt="password icon" className="w-5 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-70" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                  className="pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full bg-white text-gray-800 placeholder-gray-500 shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-200 w-full shadow-md text-lg tracking-wide"
              >
                Iniciar Sesión
              </button>
              <div className="text-center mt-2">
                <a href="#" className="text-blue-600 hover:underline text-sm">¿Olvidaste tu contraseña?</a>
              </div>
            </form>
          </div>
          {/* Lado Izquierdo: Imagen y bienvenida (en mobile va debajo) */}
          <div className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-blue-400 text-white p-6 md:p-8 w-full md:w-1/2 order-2 md:order-none">
            <img src="/comedor.jpg" alt="image_comedor" className="w-40 h-40 md:w-60 md:h-60 object-cover rounded-2xl shadow-lg mb-4 md:mb-6 border-4 border-white/30" />
            <h1 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">TICKETLUNCH</h1>
            <p className="text-base md:text-lg text-white text-center mb-1 md:mb-2">Bienvenido a nuestra aplicación.</p>
            <p className="text-sm md:text-base text-blue-100 text-center">Inicia sesión para continuar.</p>
          </div>
        </div>
      </div>
    );
}
export default LoginPage;