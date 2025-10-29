import {useEffect, useState} from 'react';
// Librerías de terceros y utilidades
import {Spinner} from './Spinner'; // Asumido
import {QRCode} from 'react-qrcode-logo'; // Generador de QR
import {useTicketQR, formatQRText} from '../hooks/useTicketQR'; // Importa el hook principal

const logoUrl = "/MercalMarker.png"; // Usado para el QR

// 💡 FUNCIÓN formatQRText IMPORTADA DE useTicketQR.js PARA EL QR
// const formatQRText = ( qr ) => {
//     if ( !qr ) return '';
//     const emp = Array.isArray( qr.empleados ) ? qr.empleados[ 0 ] : {};
//     return `Orden: ${ qr.orderID }\nReferencia: ${ qr.referencia }\nEmpleado: ${ emp.fullName || '' } (C.I: ${ emp.cedula || '' })\nTotal: Bs. ${ Number( qr.total || 0 ).toFixed( 2 ) }`;
// };


// --- Componente Reutilizable: Campo de Entrada (Input Field) ---
const InputField = ( {label, value, onChange, type = 'text', placeholder, readOnly, className = ''} ) => {
    const inputId = label.replace( /\s/g, '' ).toLowerCase().replace( /[^a-z0-9]/g, '' );

    return (
        <div>
            <label
                htmlFor={inputId}
                className="block text-sm font-medium text-blue-200 dark:text-blue-300 mb-1"
            >
                {label}
            </label>
            <div className="mt-1">
                <input
                    type={type}
                    name={inputId}
                    id={inputId}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    className={`
                        block w-full text-base rounded-md border-gray-600 focus:ring-blue-500 focus:border-blue-500
                        p-2.5 shadow-sm transition-colors duration-200
                        ${ readOnly
                            ? 'bg-slate-700 text-gray-200 cursor-default opacity-90'
                            : 'bg-white text-gray-900 dark:bg-slate-900 dark:text-blue-100 hover:border-blue-500'
                        }
                        ${ className }
                    `}
                />
            </div>
        </div>
    );
};

// --- Componente Reutilizable: Notificación Toast ---
const ToastNotification = ( {message, isVisible, onClose} ) => {
    useEffect( () => {
        let timer;
        if ( isVisible ) {
            timer = setTimeout( () => {
                onClose();
            }, 3000 );
        }
        // Función de limpieza: se ejecuta al desmontar o antes de una nueva ejecución
        return () => {
            clearTimeout( timer );
        };
    }, [ isVisible, onClose ] );
    if ( !isVisible ) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 transition-opacity duration-300">
            <div className="bg-green-600 text-white p-4 rounded-lg shadow-2xl flex items-center space-x-3">
                <span className="text-xl" role="img" aria-label="Éxito">✅</span>
                <p className="font-semibold">{message}</p>
                <button
                    onClick={onClose}
                    className="ml-4 text-white opacity-70 hover:opacity-100 font-bold"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};


// --- Componente Principal de Perfil ---
export const Profile = () => {
    // 1. Lógica y Estado del Hook Personalizado
    const {
        employee,
        isLoading,
        error,
        qrData,
        generateTicket, // Función para iniciar la carga/generación
    } = useTicketQR();

    // 2. Estado Local de la UI
    const [ showTicket, setShowTicket ] = useState( false );
    // Usamos el valor del hook o el ejemplo
    const [ phoneNumber, setPhoneNumber ] = useState( employee?.phone || "" );
    const [ showToast, setShowToast ] = useState( false );

    // Actualiza el estado del teléfono cuando los datos del empleado cambian
    useEffect( () => {
        if ( employee?.phone ) {
            setPhoneNumber( employee.phone );
        }
    }, [ employee ] );


    // 3. Handlers
    const handleShowTicketClick = () => {
        // Si vamos a mostrar el ticket, y NO tenemos data Y NO estamos cargando, disparamos la carga.
        if ( !showTicket && !qrData && !isLoading ) {
            generateTicket();
        }
        setShowTicket( !showTicket );
    };

    // 💡 Generamos el texto formateado usando la función local o la del hook (la mantuvimos localmente arriba)
    const qrTextFormatted = qrData ? formatQRText( qrData ) : 'Presiona "Generar Ticket" para cargar tu orden.';

    const handleSavePhoneNumber = ( e ) => {
        e.preventDefault();
        console.log( "Guardando número de teléfono:", phoneNumber );
        // Aquí iría la lógica real para guardar el teléfono en el backend.
        // Simulación de éxito: Muestra el toast
        setShowToast( true );
    };

    // 4. Renderizado
    return (
        <div className='
        w-full md:h-full md:flex items-center justify-center md:p-8 lg:p-12 relative border-0'>

            {/* Contenedor Principal: Tarjeta Expandida y Moderna */}
            <div className="
                w-full max-w-6xl flex flex-col lg:flex-row
                bg-gradient-to-br from-blue-900 to-blue-950
                rounded-3xl shadow-2xl border border-blue-700/50
                overflow-hidden
                transition-all duration-300 ease-in-out
            ">

                {/* Sección Izquierda: Ticket QR y Control */}
                <div className="
                    w-full lg:w-2/5
                    flex flex-col justify-center items-center
                    p-6 sm:p-8 bg-blue-900/40 lg:bg-blue-900/60
                    border-b lg:border-r border-blue-700/50
                    space-y-6 sm:space-y-8 relative
                ">
                    {/* Borde decorativo superior para móvil */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-600 lg:hidden"></div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-red-500 text-center tracking-wide uppercase mt-4 lg:mt-0">
                        Mi Ticket <span className="block text-white text-xl sm:text-2xl font-semibold">Almuerzo</span>
                    </h3>

                    {/* Contenedor del QR (Tarjeta Flotante) */}
                    <div className="
                        w-64 h-64 sm:w-72 sm:h-72
                        p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white shadow-xl
                        ring-4 ring-blue-500
                        transition-transform duration-300 ease-in-out
                        flex items-center justify-center
                        relative z-10 border-0
                    ">
                        {isLoading ? (
                            <Spinner text="Generando..." />
                        ) : showTicket && qrData ? (
                            <QRCode
                                value={qrTextFormatted} // Usamos qrData aquí
                                size={230}
                                ecLevel="M"
                                qrStyle="dots"
                                logoImage={logoUrl}
                                logoWidth={80}
                                logoHeight={80}
                                bgColor="#ffffff"
                                fgColor="#1e3a8a"
                                style={{width: '100%', height: '100%'}}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-gray-400 bg-gray-50 rounded-2xl" aria-hidden="true">
                                <span className="text-7xl sm:text-8xl mb-3 text-red-400 animate-pulse" role="img" aria-label="Código QR Oculto">
                                    🎟️
                                </span>
                                <p className="text-sm sm:text-md font-medium text-gray-600 dark:text-gray-500">
                                    {error ? `Error: ${ error }` : 'Presiona para generar tu Ticket de Almuerzo'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Botón de Control */}
                    <button
                        className={`
                            p-3 sm:p-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300
                            w-full max-w-xs sm:max-w-sm
                            uppercase tracking-wider shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                            ${ isLoading
                                ? 'bg-gray-600 text-gray-300 cursor-wait'
                                : showTicket
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            } `}
                        onClick={handleShowTicketClick}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Cargando...' : showTicket ? 'Ocultar Ticket' : 'Generar y Mostrar Ticket'}
                    </button>
                </div>

                {/* Sección Derecha: Información del Empleado (Perfil) */}
                <div className="
                    w-full lg:w-3/5 flex flex-col justify-center
                    p-6 sm:p-8 lg:p-12 space-y-6 sm:space-y-8
                ">
                    <h3 className="
                        text-3xl sm:text-4xl font-extrabold text-blue-100 dark:text-white mb-4
                        uppercase tracking-widest leading-tight text-center md:text-left
                    ">
                        Datos del Empleado
                        <span className="block w-24 h-1 bg-red-600 mt-2 rounded-full"></span>
                    </h3>

                    {/* FORMULARIO: CLAVE DEL RESPONSIVE */}
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" onSubmit={handleSavePhoneNumber}>

                        {/* Campos de Solo Lectura */}
                        <InputField
                            label="Nombre Completo"
                            value={employee?.fullName || 'Cargando...'}
                            readOnly
                            className="col-span-full"
                        />
                        <InputField
                            label="Correo Electrónico"
                            value={employee?.email || 'Cargando...'}
                            type="email"
                            readOnly
                            className="col-span-full"
                        />
                        <InputField
                            label="Unidad de Gestión"
                            value={employee?.management || 'Cargando...'}
                            readOnly
                            className="col-span-full"
                        />

                        {/* Estos campos sí deben apilarse en móvil */}
                        <InputField
                            label="C.I."
                            value={employee?.cedula || 'Cargando...'}
                            readOnly
                            className="col-span-1"
                        />
                        <InputField
                            label="Cargo"
                            value={employee?.position || "Cargando..."}
                            readOnly
                            className="col-span-1"
                        />

                        {/* Campo del Teléfono con botón de Guardar */}
                        <div className={`relative ${ window.innerWidth < 768 ? 'col-span-full' : 'col-span-2' }`}>
                            <InputField
                                label="Número de Teléfono"
                                value={phoneNumber}
                                onChange={( e ) => setPhoneNumber( e.target.value )}
                                type="tel"
                                readOnly={false}
                                // Ajusta el padding para el botón
                                className="pr-[100px]"
                            />
                            {/* Botón Guardar - Ajustado para mejor visibilidad en móvil */}
                            <button
                                type="submit"
                                className="absolute right-0 bottom-0 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold p-2 rounded-r-md transition-colors duration-200"
                                style={{height: '44px'}}
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Componente Toast */}
            <ToastNotification
                message="Número de Teléfono Guardado con Éxito."
                isVisible={showToast}
                onClose={() => setShowToast( false )}
            />
        </div >
    );
};


//***************************************************************************** */
// import {useEffect, useState} from 'react';
// // Librerías de terceros y utilidades
// import {Spinner} from './Spinner';
// import {QRCode} from 'react-qrcode-logo';
// import {useAuthStore} from '../store/authStore'; // Importamos el store de auth
// // 💡 Importar el hook central Y la función de formato
// import {useTicketQR, formatQRText} from '../hooks/useTicketQR';

// const logoUrl = "/MercalMarker.png";

// // --- Componente Reutilizable: Campo de Entrada (Input Field) ---
// // (Se asume que esta definición existe o se importa)
// const InputField = ( {label, value, onChange, type = 'text', placeholder, readOnly, className = ''} ) => {
//     const inputId = label.replace( /\s/g, '' ).toLowerCase().replace( /[^a-z0-9]/g, '' );

//     return (
//         <div>
//             <label
//                 htmlFor={inputId}
//                 className="block text-sm font-medium text-blue-200 dark:text-blue-300 mb-1"
//             >
//                 {label}
//             </label>
//             <div className="mt-1">
//                 <input
//                     type={type}
//                     name={inputId}
//                     id={inputId}
//                     value={value}
//                     onChange={onChange}
//                     placeholder={placeholder}
//                     readOnly={readOnly}
//                     className={`
//                         block w-full text-base rounded-md border-gray-600 focus:ring-blue-500 focus:border-blue-500 p-2
//                         ${ readOnly ? 'bg-gray-700 text-gray-400' : 'bg-white text-gray-900' }
//                         ${ className }
//                     `}
//                 />
//             </div>
//         </div>
//     );
// };


// export const Profile = () => {
//     const authUser = useAuthStore( state => state.user ); // Obtener el usuario autenticado
//     // 💡 Usamos el hook para obtener la data centralizada
//     const {
//         isLoading: isOrderLoading,
//         error: orderError,
//         qrData, // Objeto con los datos que van en el QR
//         generateTicket // Función para disparar la búsqueda de la orden
//     } = useTicketQR();

//     const [ showQR, setShowQR ] = useState( false );

//     // Mostrar el QR después de que se cargue la data
//     useEffect( () => {
//         if ( qrData ) {
//             setShowQR( true );
//         } else if ( !isOrderLoading ) {
//             // Resetear si no hay data y ya terminó la carga
//             setShowQR( false );
//         }
//     }, [ qrData, isOrderLoading ] );


//     // Función para manejar el botón "Generar y Mostrar ticket"
//     const handleGenerateAndShow = () => {
//         // Dispara la lógica dentro del hook (activa useQuery y calcula qrData)
//         generateTicket();
//     };

//     // 💡 Generamos el texto formateado usando la función centralizada
//     const qrTextFormatted = qrData ? formatQRText( qrData ) : 'Presiona "Generar Ticket" para cargar tu orden.';

//     // Texto de error
//     let displayError = orderError ? ( orderError.message || 'Error al buscar la orden' ) : null;
//     if ( displayError && displayError.includes( '404' ) ) {
//         displayError = 'No se encontró una orden de almuerzo pagada para hoy.';
//     }

//     return (
//         <div className="w-full h-full p-4 md:p-8 bg-gray-900 overflow-y-auto">
//             <h1 className="text-3xl font-extrabold text-white mb-6 border-b border-blue-700 pb-2">
//                 Mi Perfil y Ticket
//             </h1>

//             <div className="flex flex-col lg:flex-row gap-8">
//                 {/* --- SECCIÓN 1: DATOS DEL PERFIL --- */}
//                 <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-2xl">
//                     <h2 className="text-xl font-bold text-white mb-4">Datos Personales</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <InputField label="Nombre Completo" value={authUser?.fullName || 'N/A'} readOnly />
//                         <InputField label="Cédula de Identidad" value={authUser?.cedula || 'N/A'} readOnly />
//                         <InputField label="Teléfono" value={authUser?.phone || 'N/A'} readOnly />
//                         <InputField label="Correo Electrónico" value={authUser?.email || 'N/A'} readOnly />
//                         <InputField label="Gerencia" value={authUser?.management || 'N/A'} readOnly className="md:col-span-2" />
//                     </div>

//                     {/* Botón de Generar Ticket */}
//                     <button
//                         onClick={handleGenerateAndShow}
//                         disabled={isOrderLoading}
//                         className={`w-full mt-6 py-3 rounded-lg font-bold transition-colors shadow-lg
//                             ${ isOrderLoading
//                                 ? 'bg-yellow-600 cursor-not-allowed'
//                                 : 'bg-blue-600 hover:bg-blue-700'
//                             }`}
//                     >
//                         {isOrderLoading ? 'Buscando Orden...' : 'Generar y Mostrar Ticket'}
//                     </button>
//                 </div>


//                 {/* --- SECCIÓN 2: QR y DETALLE DEL TICKET --- */}
//                 <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-2xl flex flex-col items-center">
//                     <h2 className="text-xl font-bold text-white mb-4">Ticket de Almuerzo de Hoy</h2>

//                     {isOrderLoading ? (
//                         <Spinner message="Cargando datos de la orden..." />
//                     ) : displayError ? (
//                         <p className="text-red-400 text-center p-4 bg-red-900/20 rounded-lg border border-red-700 w-full">⚠️ {displayError}</p>
//                     ) : showQR && qrData ? (
//                         <>
//                             {/* Visualización del QR */}
//                             <div className="p-2 bg-white rounded-xl shadow-xl border-4 border-gray-100 mb-4">
//                                 <QRCode
//                                     value={qrTextFormatted}
//                                     size={180}
//                                     ecLevel="H"
//                                     qrStyle="dots"
//                                     logoImage={logoUrl}
//                                     logoWidth={40}
//                                     logoHeight={40}
//                                     logoOpacity={1}
//                                 />
//                             </div>

//                             {/* Detalle del Ticket en Texto Plano */}
//                             <pre className="w-full bg-gray-900 p-4 rounded-lg text-sm text-green-300 overflow-x-auto border border-green-600">
//                                 {qrTextFormatted}
//                             </pre>
//                         </>
//                     ) : (
//                         <p className="text-gray-400 text-center py-4">Presiona el botón para verificar y mostrar tu ticket QR de hoy.</p>
//                     )}
//                 </div>
//             </div>
//         </div >
//     );
// };
