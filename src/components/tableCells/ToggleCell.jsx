export const ToggleCell = ({ row, onToggle }) => {
    const checked = row.original.evento_especial || false;
    const uniqueId = `eventoEspecial-${row.original.cedula}-${row.index}`;

    return (
        <div className="w-full flex justify-center items-center">
            <button
                id={uniqueId}
                type="button"
                aria-pressed={checked}
                onClick={() => onToggle(row.original, 'evento_especial')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );
};