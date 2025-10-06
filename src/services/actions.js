import api from "../api/api";
import {useAuthStore} from "../store/authStore";
import users from "../data/mockDataUsers.json";

import Swal from 'sweetalert2';



// Función para convertir archivo a base64
export const fileToBase64 = ( file ) => {
    return new Promise( ( resolve, reject ) => {
        const reader = new FileReader();
        reader.onload = () => resolve( reader.result );
        reader.onerror = reject;
        reader.readAsDataURL( file );
    } );
};

// Mapeo de métodos de pago
const paymentMethodMap = {
    'Pago Móvil': 1,
    'Transferencia': 2,
    'Débito': 3,
    'Efectivo': 4,
};

export const createOrderBatch = async ( {
    employees,
    paymentOption,
    referenceNumber,
    payer,
    voucher,
} ) => {
    const id_payment_method = paymentMethodMap[ paymentOption ] || null;
    const dataToSend = new FormData();

    // Append top-level payment info
    dataToSend.append( 'reference', referenceNumber );
    if ( id_payment_method ) {
        dataToSend.append( 'id_payment_method', String( id_payment_method ) );
    }
    if ( voucher instanceof File ) {
        dataToSend.append( 'payment_support', voucher );
    }

    // Append payer info
    if ( payer && payer.cedula ) {
        dataToSend.append( 'payer[cedula]', payer.cedula );
        dataToSend.append( 'payer[nombre]', payer.nombre );
        dataToSend.append( 'payer[apellido]', payer.apellido );
        dataToSend.append( 'payer[telefono]', payer.telefono );
        dataToSend.append( 'payer[gerencia]', payer.gerencia );
    }

    const extrasList = await getExtras();

    employees.forEach( ( employee, index ) => {
        const orderPrefix = `orders[${ index }]`;

        dataToSend.append( `${ orderPrefix }[cedula]`, String( employee.cedula || '' ) );
        dataToSend.append( `${ orderPrefix }[total_amount]`, String( employee.total_pagar || '0' ) );
        dataToSend.append( `${ orderPrefix }[special_event]`, employee.evento_especial ? 'si' : 'no' );
        dataToSend.append( `${ orderPrefix }[authorized]`, employee.id_autorizado ? 'si' : 'no' );
        dataToSend.append( `${ orderPrefix }[authorized_person]`, employee.id_autorizado || 'no' );
        dataToSend.append( `${ orderPrefix }[id_order_status]`, '1' );
        dataToSend.append( `${ orderPrefix }[id_orders_consumption]`, '1' );

        const extrasForEmployee = [];
        if ( employee.para_llevar ) {
            const envase = extrasList.find( e => e.name_extra.toLowerCase().includes( 'envase' ) );
            if ( envase ) extrasForEmployee.push( envase.id_extra.toString() );
        }
        if ( employee.cubiertos ) {
            const cubiertos = extrasList.find( e => e.name_extra.toLowerCase().includes( 'cubierto' ) );
            if ( cubiertos ) extrasForEmployee.push( cubiertos.id_extra.toString() );
        }

        extrasForEmployee.forEach( extraId => {
            dataToSend.append( `${ orderPrefix }[extras][]`, extraId );
        } );
    } );

    // NOTE TO USER: The backend needs to have a '/pedidos/batch' endpoint to handle this request.
    // const response = await api.post( '/pedidos/batch', dataToSend, {
    //     headers: {'Content-Type': 'multipart/form-data'}
    // } );

    const response = {
        data: 123
    }
    return response.data;
};


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

export const getUsers = async () => {
    const {data} = await api.get( '/users' );
    console.log( 'GetUsers :', data.data );

    return data;
}


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
    // Se valida que exista el ID de la gerencia antes de hacer el get
    if ( !id_gerencia ) {
        console.error( "ID de gerencia no proporcionado." );
        return [];
    }

    try {
        const response = await api.get( `/empleados`, {
            params: {management: id_gerencia}, // Se usa el params como buena practica
        } );

        // Se desestructura para un código más limpio.
        const {employees = []} = response.data;

        // console.log( "Empleados desde FUNCIÓN:", employees );
        return employees;

    } catch ( error ) {
        console.error( "Error al obtener empleados:", error.message );
        throw error;
    }
};


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
    ;
}



/**
 * Guarda una orden en el backend, enviando el voucher como archivo si es un objeto File.
 * * @param {object} params
 * @param {object} params.empleado - Objeto con datos del empleado (id, total_pagar, etc.).
 * @param {string} params.paymentOption - Opción de pago (ej: 'pago_movil').
 * @param {string} params.referenceNumber - Número de referencia del pago.
 * @param {object} params.payer - Datos del pagador ({nombre, apellido, cedula, gerencia, telefono}).
 * @param {File|string} params.voucher - El objeto File de la imagen o el string Base64.
 * @param {Array<string>} params.extras - Array de IDs extra.
 */
export const saveOrder = async ( {
    employee,
    paymentOption,
    referenceNumber,
    payer,
    voucher,
    extras = [], // Establecer valor por defecto
} ) => {
    // Mapear método de pago
    console.log( {employee} );

    const id_payment_method = paymentMethodMap[ paymentOption ] || null;

    // 1. **Determinar el tipo de contenido y el Payload**
    let dataToSend;
    let headers = {};

    // 2. Construir los datos anidados que se convertirán a JSON string
    const orderData = {
        special_event: employee.evento_especial ? 'si' : 'no',
        authorized: employee.id_autorizado ? 'si' : 'no',
        authorized_person: employee.id_autorizado || 'no',
        id_payment_method: id_payment_method ? String( id_payment_method ) : '',
        reference: referenceNumber,
        total_amount: String( employee.total_pagar || '' ),
        cedula: String( employee.cedula || '' ),
        id_order_status: '1',
        id_orders_consumption: '1',
        management: employee.id_management || employee.id_gerencia || '',
        // payment_support se manejará en el paso 3
    };

    console.log( "OORRRDERDATAAA:", orderData );


    const employeePaymentData = {
        cedula_employee: employee.cedula || '',
        name_employee: employee.fullName || '',
        phone_employee: employee.phone || payer.telefono || '',
        // management: employee.id_management || employee.id_gerencia || '',
        management: 22,
    };

    // 3. **Manejar la imagen/voucher**

    // Si voucher es un objeto File, usamos FormData (MÉTODO RECOMENDADO)
    if ( voucher instanceof File ) {
        console.log( 'Enviando con FormData...' );
        dataToSend = new FormData();

        // Agregar campos planos de order
        Object.entries( orderData ).forEach( ( [ key, value ] ) => {
            dataToSend.append( `order[${ key }]`, value );
        } );
        // Agregar campos planos de employeePayment
        Object.entries( employeePaymentData ).forEach( ( [ key, value ] ) => {
            dataToSend.append( `employeePayment[${ key }]`, value );
        } );
        // Agregar extras (array, siempre enviar el campo)
        if ( Array.isArray( extras ) && extras.length > 0 ) {
            extras.forEach( e => dataToSend.append( 'extras[]', e ) );
        } else {
            // Si no hay extras seleccionados, enviar '1' (No Aplica)
            dataToSend.append( 'extras[]', '1' );
        }
        // Agregar el archivo de imagen
        dataToSend.append( 'order[payment_support]', voucher );

        // LOG DETALLADO DE FORM DATA
        console.log( '--- FormData a enviar ---' );
        for ( let pair of dataToSend.entries() ) {
            if ( pair[ 1 ] instanceof File ) {
                console.log( pair[ 0 ], '[File]', pair[ 1 ].name, pair[ 1 ].type, pair[ 1 ].size + ' bytes' );
            } else {
                console.log( pair[ 0 ], JSON.stringify( pair[ 1 ] ) );
            }
        }
        console.log( '-------------------------' );

        headers[ 'Content-Type' ] = 'multipart/form-data';
    }

    // 4. Hacer POST con los datos y headers determinados
    const response = await api.post( '/pedidos', dataToSend, {headers} );
    console.log("RESPONSE", response.data.order);

    return response.data.order;

};
