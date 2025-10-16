import React, {useEffect, useState} from 'react';
import {useAuthStore} from '../store/authStore';
import {getOrderByid} from '../services/actions';
import {useGetDataOrder} from '../hooks/useGetDataOrder';
import {Spinner} from './Spinner';
import {getLoggedEmployee} from '../utils/employeeUtils';
import {useTicketLunchStore} from '../store/ticketLunchStore';
import {QRCode} from 'react-qrcode-logo';
import {useGenerateMyQR} from '../hooks/useGenerateMyQR';

// Componente principal de la página de Perfil
export const Profile = () => {
    const {
        employee,
        order,
        isLoading,
        error,
        showTicketImage,
        qrDataForLogged,

        setShowTicketImage,
        formatQRText
    } = useGenerateMyQR();

    useEffect( () => {
        if ( !isLoading && !error ) {
            // console.log( "ORDER DATA: ", order, "USER:", user );
            console.log( "FORMATTED EMPLOYEE: ", employee );
        }
    }, [ isLoading ] )


    if ( isLoading ) {
        return <Spinner text='Cargando información del usuario...' />;
    }

    if ( error ) {
        return <p style={{color: 'red'}}>Error: {error}</p>;
    }

    if ( !order ) {
        return <p>No se encontraron datos del pedido.</p>;
    }
    return (
        <div className='border-0 w-full md:h-full'>
            <div className="flex flex-col md:flex-row h-full gap-10 shadow-2xl p-8 m-auto bg-gradient-to-t from-blue-950 from-50% to-red-600 rounded-2xl border-0">
                {/* Sección Izquierda: Imagen de Perfil */}
                <div className="w-full md:w-1/3 border-0 md:border-r border-gray-500 pr-5 flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-white mb-6 text-center bbh-sans-hegarty-regular">Mi Ticket Almuerzo</h3>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-52 h-52 rounded-xs overflow-hidden bg-gray-600 ring-4 ring-white shadow-md flex items-center justify-center">
                            {/* Contenedor reservado: mostrar el QR del empleado logueado cuando esté disponible */}
                            {showTicketImage && qrDataForLogged ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <QRCode
                                        value={formatQRText( qrDataForLogged )}
                                        size={150}
                                        ecLevel="M"
                                        qrStyle="dots"
                                        style={{width: '100%', height: '100%'}}
                                    />
                                </div>
                            ) : (
                                // Espacio vacío respetando el tamaño de la imagen
                                <div className="w-full h-full" aria-hidden="true"></div>
                            )}
                        </div>
                        <button
                            className='cursor-pointer p-2 bg-green-700 rounded-md'
                            onClick={() => setShowTicketImage( true )}
                        >
                            Ticket de hoy
                        </button>
                    </div>
                </div>

                {/* Sección Derecha: Editar Detalles de la Cuenta */}
                <div className="w-full md:w-2/3 flex flex-col justify-center items-center">
                    <h3 className="text-2xl font-semibold text-gray-200 mb-6 uppercase">
                        Bienvenido
                    </h3>
                    <form className="space-y-6 border-0">
                        <InputField
                            label="Nombre"
                            defaultValue={employee?.fullName}
                            type='text'
                            readOnly
                        />
                        <InputField
                            label="Correo"
                            defaultValue={employee?.email}
                            type="email"
                            readOnly
                        />
                        <InputField
                            label="Unidad"
                            defaultValue={employee?.management}
                            type="email"
                            readOnly
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Cargo" defaultValue="Programador I" readOnly />
                            <InputField label="Phone number" defaultValue="4578-420-410" type="tel" />
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
};

// Componente de Campo de Entrada reutilizable
const InputField = ( {label, defaultValue, type = 'text', helperText, placeholder, readOnly} ) => {
    return (
        <div>
            <label htmlFor={label.replace( /\s/g, '' ).toLowerCase()} className="block text-sm font-medium text-white playfair-display-uniquifier">
                {label}
            </label>
            <div className="mt-1">
                <input
                    type={type}
                    name={label.replace( /\s/g, '' ).toLowerCase()}
                    id={label.replace( /\s/g, '' ).toLowerCase()}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 ${ readOnly ? 'bg-gray-500 dark:bg-slate-800 dark:text-white' : 'bg-white dark:bg-slate-900 dark:text-amber-200' }`}
                />
            </div>
            {helperText && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
        </div>
    );
};