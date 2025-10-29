// src/components/PaymentOptionCard.jsx

import React from 'react';

/**
 * Función auxiliar para obtener la ruta de la imagen según el nombre del método de pago.
 * @param {string} name - Nombre del método de pago.
 * @returns {string} Ruta de la imagen.
 */
const getImagePath = ( name ) => {
    const lowerName = name.toLowerCase();

    if ( lowerName.includes( 'transferencia' ) ) {
        return "./cuáles-son-los-bancos-de-venezuela.jpg"; // Asumiendo que esta es la imagen de bancos/transferencia
    }
    if ( lowerName.includes( 'pago móvil' ) || lowerName.includes( 'pago movil' ) ) {
        return "./pagomovil-removebg-preview.png"; // Asumiendo que esta es la imagen de Pago Móvil
    }
    // Icono por defecto si no coincide ninguno
    return "./default-payment-icon.png";
};

export const PaymentOptionCard = ( {name, onClick} ) => {
    const imgSrc = getImagePath( name );

    return (
        <div
            onClick={onClick}
            // Estilos consistentes, responsivos y con interacción de hover
            className="flex flex-col items-center p-4 bg-white dark:bg-blue-900 rounded-xl shadow-lg border-b-4 border-blue-600 dark:border-blue-500
                       cursor-pointer transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl"
        >
            <img
                src={imgSrc}
                alt={name}
                className="w-16 h-16 md:w-50 md:h-50 object-contain mb-3 rounded-md"
            />
            <span className="font-extrabold text-blue-900 dark:text-white text-lg text-center">{name}</span>
        </div>
    );
};