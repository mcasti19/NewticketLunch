import {useEffect, useState} from 'react';
// Librerías de terceros y utilidades
import {Spinner} from './Spinner'; // Asumido
import {QRCode} from 'react-qrcode-logo'; // Generador de QR

// NOTA: Asumiendo que `useTicketQR` está en '../hooks/useTicketQR'
import {useTicketQR} from '../hooks/useTicketQR';
const logoUrl = "/MercalMarker.png"; // Usado para el QR

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
    if ( !isVisible ) return null;

    useEffect( () => {
        const timer = setTimeout( () => {
            onClose();
        }, 3000 );
        return () => clearTimeout( timer );
    }, [ isVisible, onClose ] );

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
        qrData,
        isLoading,
        error,
        generateTicket,
        formatQRText,
    } = useTicketQR();

    // 2. Estado Local de la UI
    const [ showTicket, setShowTicket ] = useState( false );
    const [ phoneNumber, setPhoneNumber ] = useState( employee?.phoneNumber || "4578-420-410 (Ejemplo)" );
    const [ showToast, setShowToast ] = useState( false );

    // Actualiza el estado del teléfono cuando los datos del empleado cambian
    useEffect( () => {
        if ( employee?.phoneNumber ) {
            setPhoneNumber( employee.phoneNumber );
        }
    }, [ employee ] );

    // 4. Handlers
    const handleShowTicketClick = () => {
        if ( !showTicket && !qrData && !isLoading ) {
            generateTicket();
        }
        setShowTicket( !showTicket );
    };

    const handleSavePhoneNumber = ( e ) => {
        e.preventDefault();

        console.log( "Guardando número de teléfono:", phoneNumber );

        // Simulación de éxito: Muestra el toast
        setShowToast( true );
    };

    // 5. Renderizado
    return (
        // <div className='w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-12 relative'>
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
                    p-6 sm:p-8 // Padding ligeramente reducido en móvil
                    bg-blue-900/40 lg:bg-blue-900/60
                    border-b lg:border-r border-blue-700/50
                    space-y-6 sm:space-y-8 // Espaciado ajustado
                    relative
                ">
                    {/* Borde decorativo superior para móvil */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-600 lg:hidden"></div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-red-500 text-center tracking-wide uppercase mt-4 lg:mt-0">
                        Mi Ticket <span className="block text-white text-xl sm:text-2xl font-semibold">Almuerzo</span>
                    </h3>

                    {/* Contenedor del QR (Tarjeta Flotante) */}
                    <div className="
                        w-64 h-64 sm:w-72 sm:h-72 // Tamaños del QR ajustados para móvil
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
                                value={formatQRText( qrData )}
                                size={230} // QR de tamaño fijo (se ajusta al contenedor)
                                ecLevel="M"
                                qrStyle="dots"
                                logoImage={logoUrl}
                                logoWidth={80}
                                logoHeight={80}
                                // ... otras props de logo ...
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
                            w-full max-w-xs sm:max-w-sm // Ancho ajustado para móvil
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
                    w-full lg:w-3/5 // Ocupa todo el ancho en móvil, 3/5 en desktop
                    flex flex-col justify-center
                    p-6 sm:p-8 lg:p-12 // Padding ajustado
                    space-y-6 sm:space-y-8
                ">
                    <h3 className="
                        text-3xl sm:text-4xl font-extrabold text-blue-100 dark:text-white mb-4 
                        uppercase tracking-widest leading-tight
                    ">
                        Datos del Empleado
                        <span className="block w-24 h-1 bg-red-600 mt-2 rounded-full"></span>
                    </h3>

                    {/* FORMULARIO: CLAVE DEL RESPONSIVE */}
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" onSubmit={handleSavePhoneNumber}>
                        {/* Campos de Solo Lectura (usan col-span-full para ocupar todo el ancho en cualquier tamaño) */}
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
                            label="Cargo"
                            value={employee?.position || "Programador I (Ejemplo)"}
                            readOnly
                            className="col-span-1" // En móvil (grid-cols-1) ocupa 1/1. En desktop (md:grid-cols-2) ocupa 1/2.
                        />

                        {/* Campo del Teléfono con botón de Guardar - Ajustado para móvil */}
                        <div className={`relative ${ window.innerWidth < 768 ? 'col-span-full' : 'col-span-1' }`}>
                            <InputField
                                label="Número de Teléfono"
                                value={phoneNumber}
                                onChange={( e ) => setPhoneNumber( e.target.value )}
                                type="tel"
                                readOnly={false}
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

// import {useEffect, useState} from 'react';
// import {Spinner} from './Spinner';
// import {QRCode} from 'react-qrcode-logo';
// import {useTicketQR} from '../hooks/useTicketQR';

// // Componente principal de la página de Perfil
// export const Profile = () => {
//     const {
//         employee,
//         qrData,
//         isLoading,
//         error,
//         generateTicket,
//         formatQRText,
//     } = useTicketQR();

//     const [ showTicket, setShowTicket ] = useState( false );

//     useEffect( () => {
//         console.log( "qrData:", qrData );

//     }, [] )




//     const handleShowTicketClick = () => {
//         if ( !showTicket ) {
//             generateTicket();
//         }
//         setShowTicket( !showTicket );
//     };

//     return (
//         <div className='border-0 w-full md:h-full'>
//             <div className="flex flex-col md:flex-row h-full gap-10 shadow-2xl p-8 m-auto bg-gradient-to-t from-blue-950 from-50% to-red-600 rounded-2xl border-0">
//                 {/* Sección Izquierda: Imagen de Perfil */}
//                 <div className="w-full md:w-1/3 border-0 md:border-r border-gray-500 pr-5 flex flex-col justify-center items-center">
//                     <h3 className="text-lg font-semibold text-white mb-6 text-center bbh-sans-hegarty-regular">Mi Ticket Almuerzo</h3>
//                     <div className="flex flex-col items-center space-y-4">
//                         <div className="w-52 h-52 rounded-xs overflow-hidden bg-gray-600 ring-4 ring-white shadow-md flex items-center justify-center">
//                             {isLoading ? (
//                                 <Spinner text="Generando..." />
//                             ) : showTicket && qrData ? (
//                                 <div className="w-full h-full flex items-center justify-center">
//                                     <QRCode
//                                         value={formatQRText( qrData )}
//                                         size={150}
//                                         ecLevel="M"
//                                         qrStyle="dots"
//                                         style={{width: '100%', height: '100%'}}
//                                     />
//                                 </div>
//                             ) : (
//                                 <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-gray-400 bg-gray-700/50" aria-hidden="true">
//                                     <span className="text-6xl mb-2" role="img" aria-label="Código QR Oculto">
//                                         🎟️
//                                     </span>
//                                     <p className="text-sm font-medium text-white">
//                                         {/* ✅ REVISIÓN: Esta lógica mostrará el error (la cadena) si existe */}
//                                         {error ? `Error: ${ error }` : 'Ticket de almuerzo oculto'}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                         <button
//                             className='cursor-pointer p-2 bg-green-700 rounded-md'
//                             onClick={handleShowTicketClick}
//                             disabled={isLoading}
//                         >
//                             {isLoading ? 'Cargando...' : showTicket ? 'Ocultar Ticket' : 'Mostrar Ticket'}
//                         </button>
//                     </div>
//                 </div>

//                 {/* Sección Derecha: Editar Detalles de la Cuenta */}
//                 <div className="w-full md:w-2/3 flex flex-col justify-center items-center">
//                     <h3 className="text-2xl font-semibold text-gray-200 mb-6 uppercase">
//                         Bienvenido
//                     </h3>
//                     <form className="space-y-6 border-0">
//                         <InputField
//                             label="Nombre"
//                             defaultValue={employee?.fullName}
//                             type='text'
//                             readOnly
//                         />
//                         <InputField
//                             label="Correo"
//                             defaultValue={employee?.email}
//                             type="email"
//                             readOnly
//                         />
//                         <InputField
//                             label="Unidad"
//                             defaultValue={employee?.management}
//                             type="email"
//                             readOnly
//                         />

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <InputField label="Cargo" defaultValue="Programador I" readOnly />
//                             <InputField label="Phone number" defaultValue="4578-420-410" type="tel" />
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div >
//     )
// };

// // Componente de Campo de Entrada reutilizable
// const InputField = ( {label, defaultValue, type = 'text', helperText, placeholder, readOnly} ) => {
//     return (
//         <div>
//             <label htmlFor={label.replace( /\s/g, '' ).toLowerCase()} className="block text-sm font-medium text-white playfair-display-uniquifier">
//                 {label}
//             </label>
//             <div className="mt-1">
//                 <input
//                     type={type}
//                     name={label.replace( /\s/g, '' ).toLowerCase()}
//                     id={label.replace( /\s/g, '' ).toLowerCase()}
//                     defaultValue={defaultValue}
//                     placeholder={placeholder}
//                     readOnly={readOnly}
//                     className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 ${ readOnly ? 'bg-gray-500 dark:bg-slate-800 dark:text-white' : 'bg-white dark:bg-slate-900 dark:text-amber-200' }`}
//                 />
//             </div>
//             {helperText && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
//         </div>
//     );
// };