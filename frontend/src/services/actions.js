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
        console.log("EMPLEADOS:", empleados);
        
        return empleados;
    } catch ( error ) {
        // En caso de fallo, lanza un error para que el hook lo capture
        throw new Error( "API Connection Failed", error );
    }
}

export const startLogin = async ( {email, password} ) => {
    const {login} = useAuthStore.getState();
    try {
        console.log( "Entrando login API" );
        const response = await api.post( '/users/login', {email, password} );
        const {user, token, expiration} = response.data || {};
        console.log( "RESPUESTA DE LA API", response );

        console.log( "TOKEN Y DATA:", token, user );
        if ( token && user ) {
            // Si el backend envía expiration, úsalo. Si no, usa 30 minutos por defecto
            const exp = expiration ? Number( expiration ) : Date.now() + 30 * 60 * 1000;
            login( user, token, exp );
            console.log( "login exitoso" );

            Swal.fire( {
                title: "Successfully logged in",
                text: "Welcome to the System",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            } );
        } else {
            throw new Error( "Invalid Credentials" );
        }
    } catch ( error ) {
        // Si la API falla, intentar login local
        const user = users.find( u => u.email === email && u.password === password );
        if ( user ) {
            // Simula token y expiración local
            const token = 'fake-jwt-token';
            const expiration = new Date().getTime() + 30 * 60 * 1000;
            console.log( "login LOCAL" );
            login( user, token, expiration );
            Swal.fire( {
                title: "Login local exitoso",
                text: "No hubo conexion con la BD (modo offline)",
                icon: "success",
                showConfirmButton: true,
                // timer: 1900
            } );
        } else {
            Swal.fire( {
                title: "Login Error",
                text: error?.response?.data?.message || error.message || "Check Credentials and try again!!!",
                icon: "error"
            } );
        }
    }
}