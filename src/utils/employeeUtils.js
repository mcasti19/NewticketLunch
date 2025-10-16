// Recibe un empleado o un array de empleados y agrega el campo fullName
export function formatFullName( data ) {
    // Si es un array, mapea cada empleado
    if ( Array.isArray( data ) ) {
        return data.map( emp => ( {
            ...emp,
            fullName: buildFullName( emp )
        } ) );
    }
    // Si es un solo empleado
    if ( data && typeof data === 'object' ) {
        return {
            ...data,
            fullName: buildFullName( data )
        };
    }
    return data;
}

// Función auxiliar para construir el nombre completo
function buildFullName( emp ) {
    const rawFirstName = emp.first_name || '';
    const rawLastName = emp.last_name || '';
    const firstName = rawFirstName.trim().split( ' ' )[ 0 ];
    const lastName = rawLastName.trim().split( ' ' )[ 0 ];
    return `${ firstName } ${ lastName }`.trim();
}
// Devuelve el empleado logueado en formato estándar
export function getLoggedEmployee( user ) {
    if ( !user || !user.employees ) return null;
    // console.log( {user} );

    const emp = user.employees;
    // Aplica el formateo de fullName usando la función utilitaria
    return formatFullName( {
        cedula: emp.cedula || '',
        phone: emp.phone || '',
        email: user.email || '',
        unity: emp.management || '',
        ...emp
    } );
}