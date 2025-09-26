import React, {useState} from 'react';
import {useAuthStore} from '../store/authStore';

// Componente principal de la página de Perfil
export const Profile = () => {
    const {user} = useAuthStore();

    return (
        <div className="flex flex-col md:flex-row gap-10 border-0 shadow-xl p-8 m-auto">
            {/* Sección Izquierda: Imagen de Perfil */}
            <div className="w-full md:w-1/3 border-r border-gray-200 pr-5 flex flex-col justify-center items-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Mi Ticket Almuerzo</h3>
                <div className="flex flex-col items-center space-y-4">
                    {/* Avatar (simulado) */}
                    <div className="relative w-52 h-52 rounded-xs overflow-hidden bg-gray-200 ring-4 ring-white shadow-md">
                        {/* Reemplaza con una imagen real si es necesario */}
                        <img
                            className="h-full w-full object-cover"
                            src="/MyTicketLunch.jpg"
                            alt="MyTicketLunch"
                        />
                    </div>

                </div>
            </div>

            {/* Sección Derecha: Editar Detalles de la Cuenta */}
            <div className="w-full md:w-2/3">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Mi Información</h3>
                <form className="space-y-6">
                    <InputField label="Nombre" defaultValue="JWT User" readOnly />

                    <label htmlFor="Correo" className="block text-sm font-medium text-gray-700">Correo</label>
                    <InputField label="Correo" defaultValue="name@example.com" type="email" readOnly />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Gerencia" defaultValue="Materially Inc." readOnly />
                        <InputField label="Oficina" defaultValue="USA" readOnly />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Phone number" defaultValue="4578-420-410" type="tel" />
                        <InputField label="Cargo" defaultValue="Programador I" readOnly />
                    </div>
                </form>
            </div>
        </div>
    )
};

// Componente de Campo de Entrada reutilizable
const InputField = ( {label, defaultValue, type = 'text', helperText, placeholder, readOnly} ) => {
    return (
        <div>
            <label htmlFor={label.replace( /\s/g, '' ).toLowerCase()} className="block text-sm font-medium text-gray-700">
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
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 ${readOnly ? 'bg-gray-100 dark:bg-slate-800' : 'bg-white dark:bg-slate-900'}`}
                />
            </div>
            {helperText && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
        </div>
    );
};