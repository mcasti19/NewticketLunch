// 💡 Componente Reutilizable para la Tarjeta de Selección (para simplificar el JSX)
export const ItemCard = ( {title, imgSrc, checked, onChange, price, className = ''} ) => ( // Añadir className
    <div className={`
        w-full max-w-xs p-5 rounded-xl flex flex-col items-center justify-between shadow-xl transition-all duration-300
        ${ checked ? 'bg-blue-950/70 ring-4 ring-red-500' : 'bg-slate-700/50 hover:bg-blue-900/70 ring-1 ring-blue-700' }
        ${ className } // Aplicar la clase para el centrado condicional
    `}>
        <span className="font-semibold text-lg text-white mb-3 text-center">{title}</span>
        <img
            src={imgSrc}
            alt={`Imagen de ${ title }`}
            className={`w-52 h-52 object-contain mb-4 transition-transform duration-300 ${ checked ? 'scale-[1.1] rotate-1' : 'scale-100' }`}
        />
        <div className="flex flex-col items-center w-full">
            <span className="text-sm text-red-400 font-medium mb-2">Bs. {price.toFixed( 2 )}</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="sr-only peer"
                />
                {/* Estilo moderno de Toggle Switch */}
                <div className="
                    w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-300 
                    dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full 
                    rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white 
                    after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white 
                    after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                    dark:border-gray-600 peer-checked:bg-red-600
                "></div>
                <span className="ms-3 text-sm font-medium text-white">
                    {checked ? 'Seleccionado' : 'Seleccionar'}
                </span>
            </label>
        </div>
    </div>
);