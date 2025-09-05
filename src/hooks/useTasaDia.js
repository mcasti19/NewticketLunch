import { useQuery } from '@tanstack/react-query';

export const useTasaDia = () => {
    const getTasaDia = async () => {
        const response = await fetch(`http://localhost:4000/`);
        if (!response.ok) throw new Error('Network response was not ok');
        const {data} = await response.json();
        const tasaDia = data.formattedNumber;
        console.log("DATA TASA DIA, ", tasaDia);
        
        return data.formattedNumber; // Asegúrate de retornar los datos
    };

    const { data, error, isLoading } = useQuery({
        queryKey: ['tasaDia'],
        queryFn: getTasaDia,
        staleTime: Infinity,
        cacheTime: 1000 * 60 * 60, // Cambiado gcTime a cacheTime
    });

    return {
        data,
        error,
        isLoading,
    };
};



// useEffect( () => {
//     const getTasaDia = async () => {
//         try {
//             const response = await fetch( "http://localhost:4000/" );
//             if ( !response.ok ) throw new Error( 'Network response was not ok' );
//             const {data} = await response.json();
//             setTasaDia( data.formattedNumber );
//         } catch ( error ) {
//             console.error( "Error fetching tasa del día:", error );
//         }
//     };
//     getTasaDia();
// }, [] );