import api from "../api/api";
// import empleadosData from '../data/mockDataEmpleados.json';
import users from '../data/mockDataUsers.json';
import {useAuthStore} from "../store/authStore";

import Swal from 'sweetalert2';


export const getManagements = async ( page = 1, pageSize = 5 ) => {
    const {data} = await api.get( '/gerencias', {
        params: {
            page,
            pageSize,
        },
    } );
    console.log( 'GetManagements :', data );
    return data
}

export const getEmployees = async ( id_gerencia ) => {
    try {
        const params = id_gerencia ? {id_gerencia} : {};
        const response = await api.get( '/empleados', {params} );
        const empleados = response.data?.data?.data || [];
        console.log( "EMPLEADOS:", empleados );

        return empleados;
    } catch ( error ) {
        // En caso de fallo, lanza un error para que el hook lo capture
        throw new Error( "API Connection Failed", error );
    }
}

export const getMenu = async ( ) => {
    try {
        // const params = id_gerencia ? {id_gerencia} : {};
        const response = await api.get( '/menus');
        const menu = response.data || [];
        console.log( "MENU:", {menu} );

        return menu;
    } catch ( error ) {
        // En caso de fallo, lanza un error para que el hook lo capture
        throw new Error( "API Connection Failed", error );
    }
}

export const startLogin = async ( {email, password} ) => {
    const {login} = useAuthStore.getState();
    try {
        console.log( "Intentando login con la API..." );
        const response = await api.post( '/users/login', {email, password} );
        const {data, token, expiration} = response.data || {};

        if ( token && data ) {
            console.log( "Login exitoso con la API." );
            const exp = expiration ? Number( expiration ) : Date.now() + 120 * 60 * 1000;
            login( data, token, exp );
            Swal.fire( {
                title: "Successfully logged in",
                text: "Welcome to the System",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            } );
        } else {
            // Este caso es poco probable si la API está bien, pero es una buena práctica manejarlo.
            throw new Error( "Invalid response from API" );
        }
    } catch ( error ) {
        // Manejar errores de la API.
        // Un error de red o de conexión no tendrá response.
        if ( !error.response ) {
            console.log( "Fallo de conexión a la API. Intentando login local..." );
            const user = users.find( u => u.email === email && u.password === password );
            if ( user ) {
                // Simula token y expiración local
                const token = 'fake-jwt-token';
                const expiration = new Date().getTime() + 30 * 60 * 1000;
                login( user, token, expiration );
                Swal.fire( {
                    title: "Login local exitoso",
                    text: "No hubo conexión con la BD (modo offline)",
                    icon: "success",
                    showConfirmButton: true,
                } );
            } else {
                Swal.fire( {
                    title: "Login Error",
                    text: "No se encontró usuario local para el modo offline. Verifique credenciales.",
                    icon: "error"
                } );
            }
        } else {
            // Error de la API (ej. credenciales inválidas, 401 Unauthorized)
            console.log( "Error de credenciales desde la API." );
            Swal.fire( {
                title: "Login Error",
                text: error.response.data.message || error.message || "Verifique sus credenciales e intente de nuevo.",
                icon: "error"
            } );
        }
    }
};