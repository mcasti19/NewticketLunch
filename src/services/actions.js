import api from "../api/api";
import {useAuthStore} from "../store/authStore";
// import users from "../data/mockDataUsers.json";

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

// // Mapeo de métodos de pago
// const paymentMethodMap = {
//     'Pago Móvil': 1,
//     'Transferencia': 2,
//     'Débito': 3,
//     'Efectivo': 4,
// };

// Importa tu instancia de API (asumiendo que está definida en algún lugar como 'api')
// import api from './api'; 

/**
 * Obtiene los métodos de pago de la API y los transforma en un objeto de mapeo.
 * El objeto resultante tendrá el formato: { 'nombre del método': id_del_método }
 * * @returns {Promise<Object>} Un objeto con la estructura de mapeo de métodos de pago.
 * @throws {Error} Si la llamada a la API falla.
 */
export const getPaymentMethodsMap = async () => {
    try {
        const resp = await api.get( `/metodosPagos` );
        const paymentMethodsArray = resp.data.paymentMethod;

        // Verifica que los datos existan y sean un array
        if ( !Array.isArray( paymentMethodsArray ) ) {
            console.error( "La respuesta de la API no contiene un array de métodos de pago:", resp.data );
            return {}; // Devuelve un objeto vacío si no hay datos válidos
        }

        // 💡 Transformación del array de objetos al mapa usando .reduce()
        const paymentMethodMap = paymentMethodsArray.reduce( ( acc, method ) => {
            // Utilizamos el nombre del método como clave y su ID como valor
            acc[ method.payment_method ] = method.id_payment_method;
            return acc;
        }, {} ); // Inicializa el acumulador como un objeto vacío

        console.log( "MAPEO DE MÉTODOS DE PAGO GENERADO:", paymentMethodMap );

        // Puedes devolver solo el mapa si es lo único que necesitas
        return paymentMethodMap;
    } catch ( error ) {
        console.error( "Error al obtener los métodos de pago:", error );
        // Es importante relanzar el error o devolver un valor que indique el fallo
        throw new Error( "No se pudo obtener el mapeo de métodos de pago." );
    }
}


export const createOrderBatch = async ({
    employees,
    // paymentMethod should be the ID (number or string) of the payment method
    paymentMethod,
    referenceNumber,
    payer,
    voucher,
}) => {
    // Use the provided paymentMethod (already an ID) instead of an undefined map
    const id_payment_method = paymentMethod ? String(paymentMethod) : null;
    const dataToSend = new FormData();

    // Append top-level payment info
    dataToSend.append('reference', referenceNumber || '');
    if (id_payment_method) {
        dataToSend.append('id_payment_method', id_payment_method);
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

        // **Ajuste clave: Duplicar el voucher para cada pedido**
        if ( voucher instanceof File ) {
            // El backend esperará orders[0][payment_support], orders[1][payment_support], etc.
            dataToSend.append( `${ orderPrefix }[payment_support]`, voucher );
        }

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



    // --- INICIO: LOG DETALLADO PARA VERIFICAR FormData ---
    console.log( '--- FormData a enviar (Verificación) ---' );
    let dataCheck = {};
    for ( let pair of dataToSend.entries() ) {
        const key = pair[ 0 ];
        const value = pair[ 1 ];

        if ( value instanceof File ) {
            console.log( key, '[File]', value.name, value.size + ' bytes' );
            dataCheck[ key ] = `[File: ${ value.name }]`;
        } else {
            console.log( key, String( value ) );
            dataCheck[ key ] = String( value );
        }
    }
    // Opcional: imprimir el objeto plano
    console.log( 'Estructura de datos planos:', dataCheck );
    console.log( '-----------------------------------------' );
    // --- FIN: LOG DETALLADO ---

    try {
        const response = await api.post('/pedidos/bluk', dataToSend, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if ((response.status === 200 || response.status === 201) && response.data) {
            // Return the response body so callers can decide what to do
            return response.data;
        }

        throw new Error(response.data?.message || 'Error procesando el lote de órdenes');
    } catch (error) {
        console.error('ERROR ENVIAR POR LOTE:', error);
        throw error;
    }
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
            console.log( "USUARIO LOGUEADO: ", data );

        } else {
            // Este caso es poco probable si la API está bien, pero es una buena práctica manejarlo.
            throw new Error( "Invalid response from API" );
        }
    } catch ( error ) {
        console.log( "Error de credenciales desde la API." );
        Swal.fire( {
            title: "Login Error",
            text: error.response.data.message || error.message || "Verifique sus credenciales e intente de nuevo.",
            icon: "error"
        } );
    }
};

export const getUsers = async () => {
    try {
        const {data} = await api.get( '/users' );
        return data;
    } catch ( error ) {
        console.error( 'Error al obtener usuarios:', error.message || error );
        throw error;
    }
};

export const getEmployees = async () => {
    try {
        const response = await api.get( `/empleados`, {
            // params: {management: id_gerencia}, // Se usa el params como buena practica
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


// services/actions
export const getOrderByid = async ( cedula ) => {
    try {
        if ( !cedula ) {
            throw new Error( 'Cedula no proporcionada' );
        }
        const {data: {order}} = await api.get( `/pedidos/${ cedula }` );
        return order;

    } catch ( error ) {
        const {response} = error;
        // Si el error es 404, lanzamos un nuevo Error con el mensaje personalizado.
        if ( response && response.status === 404 ) {
            // ✅ CORRECCIÓN: Lanzar un nuevo objeto Error con el mensaje personalizado.
            const customError = new Error( "No posee ninguna orden el dia de hoy" );
            console.error( customError.message ); // Registra el mensaje personalizado en la consola
            throw customError;
        }
        // Si es otro tipo de error, o si la respuesta no tiene el formato esperado,
        // lanzamos el error original (que debería ser una instancia de Error).
        throw error;
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
    // 💡 CAMBIADO: Esperamos 'paymentMethod' (que es el ID), NO 'paymentOption' (el nombre)
    paymentMethod, 
    referenceNumber,
    payer,
    voucher,
    extras = [], // Establecer valor por defecto
} ) => {
    // ❌ ELIMINADA la línea que causaba el ReferenceError:
    // const id_payment_method = paymentMethodMap[ paymentOption ] || null;

    // 💡 AHORA: El ID ya viene listo en la variable 'paymentMethod'
    const id_payment_method = paymentMethod;

    // 1. **Determinar el tipo de contenido y el Payload**
    let dataToSend;
    let headers = {};

    // 2. Construir los datos anidados que se convertirán a JSON string
    const orderData = {
        special_event: employee.evento_especial ? 'si' : 'no',
        authorized: employee.id_autorizado ? 'si' : 'no',
        authorized_person: employee.id_autorizado || 'no',
        
        // ✅ USAMOS EL ID QUE YA RECIBIMOS DIRECTAMENTE
        id_payment_method: id_payment_method ? String( id_payment_method ) : '', 
        
        reference: referenceNumber,
        total_amount: String( employee.total_pagar || '' ),
        cedula: String( employee.cedula || '' ),
        id_order_status: '1',
        id_orders_consumption: '1',
        management: employee.management || '',
        // payment_support se manejará en el paso 3
    };

    console.log( "OORRRDERDATAAA:", orderData );


    const employeePaymentData = {
        cedula_employee: employee.cedula || '18467449',
        name_employee: employee.fullName || 'Moises',
        phone_employee: employee.phone || payer.telefono || '0414-2418171',
        management: employee.management || '',
    };

    console.log( "employeePaymentData", employeePaymentData );

    // 3. **Manejar la imagen/voucher**
    // Si voucher es un objeto File, usamos FormData (MÉTODO RECOMENDADO)
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
    if ( voucher instanceof File ) {
        // Agregar el archivo de imagen
        dataToSend.append( 'order[payment_support]', voucher );
    }

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

    // 4. Hacer POST con los datos y headers determinados

    try {
        const response = await api.post( '/pedidos', dataToSend, {headers} );
        console.log( "RESPONSE", response.data.order );

        // Asegurarse de que la respuesta sea exitosa (200 o 201)
        if ( response && ( response.status === 200 || response.status === 201 ) && response.data ) {
            return response.data.order;
        }
        // Si no es un 200/201, lanzar error con mensaje de la API si existe
        throw new Error( response?.data?.message || `Error al guardar la orden (status ${ response?.status })` );

    } catch ( error ) {
        console.log( "ERRRORRRR:", error );
        // Re-lanzar el error para que el llamador (ModalResume) lo maneje
        const message = error?.response?.data?.message || error?.message || 'Error desconocido al guardar la orden';
        throw new Error( message );

    }
};

