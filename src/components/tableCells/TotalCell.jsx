export const TotalCell = ({ row, tasaDia, precioLlevar, precioCubierto }) => {
    if (!tasaDia) return '0.00';

    const almuerzoCount = row.original.almuerzo ? 1 : 0;
    const paraLlevarCount = row.original.para_llevar ? 1 : 0;
    const cubiertosCount = row.original.cubiertos ? 1 : 0;
    const almuerzoAutorizadoCount = row.original.id_autorizado ? 1 : 0;

    const total = (almuerzoCount * parseFloat(tasaDia)) +
        (almuerzoAutorizadoCount * parseFloat(tasaDia)) +
        (paraLlevarCount * precioLlevar) +
        (cubiertosCount * precioCubierto);

    return (
        <div className='w-full flex justify-end items-center'>
            <span className="font-bold text-green-800 dark:text-green-400 group-hover:text-white dark:group-hover:text-gray-100">
                Bs. {total.toFixed(2)}
            </span>
        </div>
    );
};