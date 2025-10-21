// import { AutorizarSelector } from "./AutorizarSelector";
import {ToggleCell} from "../components/tableCells/ToggleCell";
import {CheckboxCell} from "../components/tableCells/CheckboxCell";
import {TotalCell} from "../components/tableCells/TotalCell";
import {AutorizarSelector} from "../components/AutorizarSelector";

export const getSelectionColumns = ( {
    handleToggleField,
    handleAutorizadoChange,
    employeeList,
    user,
    tasaDia,
    precioLlevar,
    precioCubierto
} ) => [
        {
            header: 'Evento Especial',
            accessorKey: 'evento_especial',
            cell: ( {row} ) => <ToggleCell row={row} onToggle={handleToggleField} />
        },
        {
            header: 'Empleado',
            accessorKey: 'fullName',
            cell: ( {row} ) => <span className="text-gray-900 dark:text-gray-100 hover group-hover:text-white">
                {row.original.fullName}
            </span>,
        },
        {
            header: `Almuerzo Bs. ${ tasaDia }`,
            accessorKey: 'almuerzo',
            cell: ( {row} ) => <CheckboxCell row={row} onToggle={handleToggleField} field="almuerzo" color="blue" />
        },
        {
            header: `Para llevar Bs. ${ precioLlevar }`,
            accessorKey: 'para_llevar',
            cell: ( {row} ) => <CheckboxCell row={row} onToggle={handleToggleField} field="para_llevar" color="green" />
        },
        {
            header: `Cubiertos Bs. ${ precioCubierto }`,
            accessorKey: 'cubiertos',
            cell: ( {row} ) => <CheckboxCell row={row} onToggle={handleToggleField} field="cubiertos" color="purple" />
        },
        {
            header: 'Persona Autorizada',
            accessorKey: 'id_autorizado',
            cell: ( {row} ) => {
                const isSelectedBySomeoneElse = employeeList.some( emp => emp.id_autorizado === row.original.cedula && emp.cedula !== row.original.cedula );
                return (
                    <AutorizarSelector
                        uniqueId={`authorized-${ row.original.cedula }-${ row.index }`}
                        selectedId={row.original.id_autorizado}
                        handleAutorizadoChange={handleAutorizadoChange}
                        paraLlevar={row.original.para_llevar}
                        isSelectedBySomeoneElse={isSelectedBySomeoneElse}
                        employeeList={employeeList}
                        user={user}
                        row={row}
                    />
                );
            },
        },
        {
            header: 'Total a Pagar (Bs.)',
            accessorKey: 'total_pagar',
            cell: ( {row} ) => <TotalCell
                row={row}
                tasaDia={tasaDia}
                precioLlevar={precioLlevar}
                precioCubierto={precioCubierto}
            />,
        },
    ];