import {useMemo, useState} from 'react';
import {Spinner} from './Spinner';
import {useBank} from '../hooks/useBanks';
import Select from 'react-select'; // Importa React Select



export const BankSelector = ( {onSelectBank} ) => {
    // 1. Obtención de datos y estados desde el Custom Hook
    const {
        bankList,
        isLoading: isLoadingBanks,
        isError: isBanksError
    } = useBank();

    // 2. Transformación de la data de la API al formato { value, label }
    const bankOptions = useMemo( () => {
        if ( !bankList || !Array.isArray( bankList ) || bankList.length === 0 ) {
            return [];
        }

        return bankList.map( ( bank ) => ( {
            value: bank.code_bank,
            label: `${ bank.code_bank } - ${ bank.name_bank }`,
        } ) );
    }, [ bankList ] );

    // 💡 Aquí defines tus handlers y estados del Select, ya que el componente ahora los contiene
    const [ selectedBank, setSelectedBank ] = useState( null );
    const handleBankChange = ( selected ) => {
        setSelectedBank( selected );
        // Informar al padre del código del banco seleccionado (value está definido como code_bank)
        if ( onSelectBank ) onSelectBank( selected?.value || null );
    };

    const hasErrorOrNoData = isLoadingBanks || isBanksError || bankOptions.length === 0;

    return (
        <div className="w-full max-w-sm flex flex-col justify-center items-center">
            <span className="font-semibold text-lg mb-3 text-slate-900">
                Selecciona Banco Emisor
            </span>
            {
                hasErrorOrNoData
                    ? (
                        <div className="flex items-center justify-center h-full text-white">
                            {/* Control de Carga/Error */}
                            {isBanksError
                                ? <Spinner text="🚫 Error al cargar los bancos" />
                                : <Spinner text="⏳ Cargando Listado de Bancos" />
                            }
                        </div>
                    ) : (
                        // 3. Renderizado del Select
                        <Select
                            value={selectedBank}
                            onChange={handleBankChange}
                            options={bankOptions}
                            placeholder="Seleccione el banco..."
                            isSearchable={true}
                        />
                    )
            }
        </div>
    )
}
