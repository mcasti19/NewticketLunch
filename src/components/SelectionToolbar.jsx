export const SelectionToolbar = ({ search, onSearchChange, pageSize, onPageSizeChange, onAddGuest, onClearData }) => {
    return (
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
            <div className="hidden md:flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <input
                    id='findByName'
                    type="text"
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder="Buscar por nombre o apellido..."
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 dark:placeholder:text-gray-400 dark:text-amber-300"
                />
                <select
                    id='pageSelector'
                    value={pageSize}
                    onChange={e => onPageSizeChange(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500 dark:text-gray-200 dark:bg-black"
                >
                    <option value={5}>5 por página</option>
                    <option value={10}>10 por página</option>
                    <option value={20}>20 por página</option>
                </select>
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow w-full md:w-auto"
                    onClick={onAddGuest}
                >
                    Agregar Invitado
                </button>
                <button
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded shadow w-full md:w-auto"
                    onClick={onClearData}
                >
                    Limpiar Selección
                </button>
            </div>
        </div>
    );
};