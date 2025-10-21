export const CheckboxCell = ({ row, onToggle, field, color = 'blue' }) => {
    const checked = row.original[field] || false;
    const isDisabled = !row.original.almuerzo && field !== 'almuerzo';
    const uniqueId = `${field}-${row.original.cedula}-${row.index}`;

    const colorClasses = {
        blue: 'text-blue-600 focus:ring-blue-500',
        green: 'text-green-600 focus:ring-green-500',
        purple: 'text-purple-600 focus:ring-purple-500',
    };

    return (
        <div className='w-full flex justify-center items-center'>
            <input
                id={uniqueId}
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(row.original, field)}
                disabled={isDisabled}
                className={`form-checkbox h-4 w-4 rounded border-gray-300 ${colorClasses[color] || colorClasses.blue}`}
            />
        </div>
    );
};