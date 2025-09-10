import api from "../api/api";
import {useAuthStore} from "../store/authStore";
import users from "../data/mockDataUsers.json";

import Swal from 'sweetalert2';

// Mapeo de métodos de pago
const paymentMethodMap = {
    'Pago Móvil': 1,
    'Transferencia': 2,
    'Débito': 3,
    'Efectivo': 4,
};

// Función para convertir archivo a base64
export const fileToBase64 = ( file ) => {
    return new Promise( ( resolve, reject ) => {
        const reader = new FileReader();
        reader.onload = () => resolve( reader.result );
        reader.onerror = reject;
        reader.readAsDataURL( file );
    } );
};

// Construye y (futuro) envía la orden al backend
export const createOrder = async ( {
    empleados, // array de empleados seleccionados
    paymentOption, // string
    referenceNumber, // string
    payer, // {nombre, apellido, cedula, gerencia}
    voucher, // File o base64
    totalPagar, // number
} ) => {

    // console.log( "EMPLEADOS EN LA ORDEN:", empleados );

    // Si hay voucher archivo, conviértelo a base64
    let voucherBase64 = null;
    if ( voucher && typeof voucher !== 'string' ) {
        voucherBase64 = await fileToBase64( voucher );
    } else if ( typeof voucher === 'string' ) {
        voucherBase64 = voucher;
    }

    // Obtener extras del backend (o local)
    let extrasList = [];
    try {
        extrasList = await getExtras();
    } catch ( e ) {
        console.warn( 'No se pudieron obtener los extras, se usará demo:', e );
        // Demo fallback
        extrasList = [
            {id_extra: 1, name_extra: 'Envase'},
            {id_extra: 2, name_extra: 'Cubiertos'},
        ];
    }

    // Por cada empleado, crea una orden
    const date_order = new Date().toISOString().slice( 0, 10 );
    const id_payment_method = paymentMethodMap[ paymentOption ] || null;

    // Construir mapa para buscar autorizaciones cruzadas
    const idToEmpleado = {};
    empleados.forEach( emp => {
        // Puede ser IdEmpleado o id_empleado según backend
        const id = emp.id_employee || '';
        idToEmpleado[ id ] = emp;
    } );

    const orders = empleados.map( emp => {
        // console.log("CADA EMPLEADO:", emp);


        // Determinar extras seleccionados para este empleado
        const extras = [];
        if ( emp.para_llevar ) {
            const envase = extrasList.find( e => e.name_extra.toLowerCase().includes( 'envase' ) );
            if ( envase ) extras.push( envase.id_extra.toString() );
        }
        if ( emp.cubiertos ) {
            const cubiertos = extrasList.find( e => e.name_extra.toLowerCase().includes( 'cubierto' ) );
            if ( cubiertos ) extras.push( cubiertos.id_extra.toString() );
        }

        // Datos completos del empleado
        
        const management = ( emp.gerencias && emp.gerencias.management_name ) ? emp.gerencias.management_name : ( payer.gerencia || '' );

        // Total individual
        const total_pagar = emp.total_pagar || 0;

        // Autorizaciones
        // 1. ¿A quién autoriza este empleado?
        // let autoriza_a = '';
        // if (emp.id_autorizado) {
        //     // console.log("SI EXISTE ID_AUTORIZADO:", emp.id_autorizado);
        //     const autorizado = emp.autoriza_a;
        //     console.log("AUTORIZDO:", autorizado);
        //     // if ( autorizado ) {
        //     //     autoriza_a = `${autorizado.first_name || ''} ${autorizado.last_name || ''}`.trim();
        //     // }
        //     // console.log("AUTORIZADO NOMBRE:", emp.id_autorizado);

        // }

        // 2. ¿Quién lo autorizó a él?
        // let autorizado_por = '';
        // const quienAutoriza = empleados.find(e => (e.id_autorizado === id_employee));
        // if (quienAutoriza) {
        //     autorizado_por = `${quienAutoriza.first_name || quienAutoriza.nombre || ''} ${quienAutoriza.last_name || quienAutoriza.apellido || ''}`.trim();
        // }

        return {
            order: {
                special_event: emp.evento_especial ? 'Si' : 'No',
                authorized_person: emp.id_autorizado || '',
                autoriza_a: emp.autoriza_a, // Nombre de a quién autoriza
                autorizado_por: emp.autorizado_por,   // Nombre de quien lo autoriza
                id_payment_method,
                reference: referenceNumber,
                total_amount: total_pagar, // total individual
                id_employee: emp.id_employee,
                id_order_status: 1,
                id_orders_consumption: 2,
                date_order,
                voucher: voucherBase64,
                extras,
            },
            employeePayment: {
                management,
                payer_nombre: payer.nombre,
                payer_apellido: payer.apellido,
                payer_cedula: payer.cedula,
            },
        };
    } );

    // Aquí harías el POST al backend (por ahora solo log)
    // console.log( 'ORDENES A ENVIAR:', orders );
    // Ejemplo de POST:
    // await api.post('/ordenes', orders);
    return orders;
};

export const getManagements = async ( page = 1, pageSize = 5 ) => {
    const {data} = await api.get( '/gerencias', {
        params: {
            page,
            pageSize,
        },
    } );
    // console.log( 'GetManagements :', data );
    return data
}

export const getEmployees = async ( id_gerencia ) => {
    try {
        const params = id_gerencia ? {id_gerencia} : {};
        const response = await api.get( '/empleados', {params} );
        const empleados = response.data.employees || [];
        // console.log( "EMPLEADOS:", empleados     );

        return empleados;
    } catch ( error ) {
        // En caso de fallo, lanza un error para que el hook lo capture
        throw new Error( "API Connection Failed", error );
    }
}


export const getMenu = async () => {
    try {
        // console.log( "CONSULTANDO MENU" );
        const {data} = await api.get( '/menus' );
        // console.log( "RESPONSE", data );
        // Si el backend responde con un mensaje indicando que no hay registros
        if ( data && data.message ) {
            // Puedes lanzar un error personalizado o devolver el mensaje
            throw new Error( data.message );
        }
        const menu = data.menus || [];
        // console.log( "MENU:", menu );
        return menu;
    } catch ( error ) {
        // Si el error es por "No hay registros", lo puedes manejar aquí o dejar que lo capture el hook
        throw new Error( error.message || "API Connection Failed" );
    }
}
export const getExtras = async () => {
    try {
        // console.log( "CONSULTANDO Extas" );
        const {data} = await api.get( '/extras' );
        // console.log( "RESPONSE Extras", data );
        // Si el backend responde con un mensaje indicando que no hay registros
        if ( data && data.message ) {
            // Puedes lanzar un error personalizado o devolver el mensaje
            throw new Error( data.message );
        }
        const extras = data.extras || [];
        // console.log( "Extras:", extras );
        return extras;
    } catch ( error ) {
        // Si el error es por "No hay registros", lo puedes manejar aquí o dejar que lo capture el hook
        throw new Error( error.message || "API Connection Failed" );
    }
}

export const startLogin = async ( {email, password} ) => {
    const {login} = useAuthStore.getState();
    try {
        console.log( "Intentando login con la API..." );
        const response = await api.post( '/users/login', {email, password} );
        // console.log( "RESPONSE", response );

        const {data, token, expiration} = response.data || {};

        if ( token && data ) {
            // console.log( "Login exitoso con la API." );
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