import api from "../api/api";
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

export const getemployees = async (id_gerencia) => {
    try {
        // Si el backend soporta filtro por id_gerencia, usarlo como query param
        const params = id_gerencia ? { id_gerencia } : {};
        const response = await api.get('/empleados', { params });
        // El array de empleados está en response.data.data.data
        const empleados = response.data?.data?.data || [];
        return empleados;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const startLogin = async ( {email, password} ) => {
    const {login} = useAuthStore.getState();
    try {
        const response = await api.post( '/users/login', {email, password} );
        const {data, token, expiration} = response.data || {};
        if ( token && data ) {
            // Si el backend envía expiration, úsalo. Si no, usa 30 minutos por defecto
            const exp = expiration ? Number( expiration ) : Date.now() + 30 * 60 * 1000;
            login( data, token, exp );
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
        Swal.fire( {
            title: "Login Error",
            text: error?.response?.data?.message || error.message || "Check Credentials and try again!!!",
            icon: "error"
        } );
    }

    // // Buscar usuario en mockData.json
    // const user = users.find( u => u.email === email && u.password === password );
    // console.log( user );

    // if ( user ) {
    //     // Simulate token creation with expiration 1 hour from now
    //     const token = 'fake-jwt-token';
    //     const expiration = new Date().getTime() + 5 * 60 * 1000;

    //     login( user, token, expiration ); // Inicia sesión en Zustand store

    //     Swal.fire( {
    //         title: "Successfully logged in",
    //         text: "Welcome to the System",
    //         icon: "success",
    //         showConfirmButton: false,
    //         timer: 1500
    //     } );

    // } else {
    //     Swal.fire( {
    //         title: "Invalid Credentials",
    //         text: "Check Credentials and try again!!!",
    //         icon: "error"
    //     } );
    // }
}