// 💡 Componente Reutilizable para la Tarjeta de Selección (para simplificar el JSX)
export const ItemCard = ( {title, imgSrc, checked, onChange, price, className = ''} ) => ( // Añadir className
    <div className={`
        w-full max-w-xs p-3 rounded-2xl flex flex-col items-center justify-between shadow-2xl transition-all duration-300
        // Se cambió el fondo y el anillo para un aspecto más vibrante y moderno
        ${ checked
            // ? 'bg-blue-900 ring-4 ring-red-500/70 border border-red-500/30'
            ? 'bg-gradient-to-r from-blue-950 from-75% to-transparent to-110% ring-2 ring-red-500/70 border border-red-500/30'
            : 'bg-slate-800/80 hover:bg-blue-900/60 ring-1 ring-blue-700/50 border border-blue-800' }
        ${ className }
    `}>
        <span className="font-extrabold text-xl text-white text-center mb-2">{title}</span>
        <img
            src={imgSrc}
            alt={`Imagen de ${ title }`}
            // Animación mejorada para el elemento seleccionado
            className={`w-52 h-52 object-contain transition-transform duration-500 ${ checked ? 'scale-[1.08] rotate-1 shadow-red-500 drop-shadow-lg' : 'scale-100' }`}
        />
        <div className="flex flex-col items-center w-full mt-3">
            <span className="text-2xl text-yellow-400 font-bold mb-4">Bs. {price.toFixed( 2 )}</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="sr-only peer"
                />
                {/* Estilo moderno y limpio de Toggle Switch */}
                <div className="
                    w-12 h-6 bg-gray-600 rounded-full peer 
                    dark:bg-gray-700 peer-checked:after:translate-x-[1.25rem] 
                    after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-white 
                    after:border after:rounded-full after:h-4 after:w-4 after:transition-all 
                    dark:border-gray-600 peer-checked:bg-red-600 shadow-inner
                "></div>
                <span className="ms-3 text-base font-bold text-white">
                    {checked ? 'SELECCIONADO' : 'SELECCIONAR'}
                </span>
            </label>
        </div>
    </div>
);

// // 💡 Componente Reutilizable para la Tarjeta de Selección (para simplificar el JSX)
// export const ItemCard = ( {title, imgSrc, checked, onChange, price, className = ''} ) => ( // Añadir className
//     <div className={`
//         w-full max-w-xs p-1 rounded-xl flex flex-col items-center justify-between shadow-xl transition-all duration-300
//         ${ checked
//             ? 'bg-blue-950/70 ring-4 ring-red-500'
//             : 'bg-slate-700/50 hover:bg-blue-900/70 ring-1 ring-blue-700' }
//         ${ className }
//     `}>
//         <span className="font-semibold text-lg text-white text-center">{title}</span>
//         <img
//             src={imgSrc}
//             alt={`Imagen de ${ title }`}
//             className={`w-52 h-52 object-contain transition-transform duration-300 ${ checked ? 'scale-[1.1] rotate-1' : 'scale-100' }`}
//         />
//         <div className="flex flex-col items-center w-full">
//             <span className="text-lg text-yellow-400 font-medium mb-2">Bs. {price.toFixed( 2 )}</span>
//             <label className="relative inline-flex items-center cursor-pointer">
//                 <input
//                     type="checkbox"
//                     checked={checked}
//                     onChange={onChange}
//                     className="sr-only peer"
//                 />
//                 {/* Estilo moderno de Toggle Switch */}
//                 <div className="
//                     w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-300 
//                     dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full 
//                     rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white 
//                     after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white 
//                     after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
//                     dark:border-gray-600 peer-checked:bg-red-600
//                 "></div>
//                 <span className="ms-3 text-sm font-medium text-white">
//                     {checked ? 'Seleccionado' : 'Seleccionar'}
//                 </span>
//             </label>
//         </div>
//     </div>
// );