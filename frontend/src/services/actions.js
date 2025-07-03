import api from "../api/api";


export const getUsers = async ( page = 1, pageSize = 5 ) => {
    const {data} = await api.get( '/users', {
        params: {
            page,
            pageSize,
        },
    } );
    // console.log( 'GEtUsers :', data );

    return data
}


export const getemployees = async () => {
    try {
        const {data} = await api.get( '/employees' );
        console.log( 'getemployees ', data.employees );

    } catch ( error ) {
        console.log( error );
    }
    return {getemployees}
}