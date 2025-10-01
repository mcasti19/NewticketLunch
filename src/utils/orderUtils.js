// Funciones utilitarias para estandarizar la construcción de empleados seleccionados y resumen

export function buildSelectedEmployees( {employee, ticket, autorizado, empleados, tipo} ) {
    // Si es MiTicket (user+ticket)
    console.log("UUUUUUUUUUUUUUUUUUUUUUUUSEEEERRRRRRR", employee, tipo );

    if ( employee && ticket ) {
        // Construir el array de extras según selección
        let extras = [];
        if (ticket.para_llevar) extras.push(2);
        if (ticket.cubiertos) extras.push(3);
        // Si no selecciona nada, enviar 'No Aplica' (id=1)
        if (extras.length === 0) extras = [1];
        return [ {
            fullName: employee.fullName,
            cedula: employee.cedula || '',
            almuerzo: ticket.almuerzo,
            para_llevar: ticket.para_llevar,
            cubiertos: ticket.cubiertos,
            id_autorizado: ticket.id_autorizado,
            evento_especial: ticket.evento_especial || false,
            extras,
            total_pagar: ticket.total_pagar || 0,
            autoriza_a: autorizado ? ( autorizado.fullName || autorizado.name || '' ) : '',
            autorizado_por: '',
            // phone: employee.employees.phone || '',
            phone: '041432208888',
            id_management: employee.id_management || '',
        } ];
    }
    // Si es Seleccion (array de empleados)
    if ( Array.isArray( empleados ) ) {
        return empleados.map( emp => {

            console.log( {emp} );

            // Buscar nombre completo
            const fullName = emp.fullName;
            // Calcular extras
            let extras = [];
            if (emp.para_llevar) extras.push(2);
            if (emp.cubiertos) extras.push(3);
            if (extras.length === 0) extras = [1];
            // Calcular total_pagar si no viene
            let total_pagar = emp.total_pagar;
            if ( typeof total_pagar === 'undefined' ) {
                total_pagar = 0;
                if ( emp.almuerzo ) total_pagar += 100;
                if ( emp.para_llevar ) total_pagar += 15;
                if ( emp.cubiertos ) total_pagar += 5;
            }
            // Autoriza_a y autorizado_por
            let autoriza_a = '';
            if ( emp.id_autorizado && emp.autoriza_a ) {
                autoriza_a = emp.autoriza_a;
            }
            let autorizado_por = emp.autorizado_por || '';
            return {
                fullName,
                cedula: emp.cedula || '',
                almuerzo: emp.almuerzo || false,
                para_llevar: emp.para_llevar || false,
                cubiertos: emp.cubiertos || false,
                id_autorizado: emp.id_autorizado || null,
                evento_especial: emp.evento_especial || false,
                extras,
                total_pagar,
                autoriza_a,
                autorizado_por,
            };
        } );
    }
    // Si no hay datos válidos
    return [];
}

export function buildResumen( employees, tasaDia = 100, precioLlevar = 15, precioCubierto = 5 ) {
    const countAlmuerzos = employees.filter( emp => emp.almuerzo ).length;
    const countAlmuerzosAutorizados = employees.filter( emp => emp.id_autorizado ).length;
    const countParaLlevar = employees.filter( emp => emp.para_llevar ).length;
    const countCubiertos = employees.filter( emp => emp.cubiertos ).length;
    const totalPagar = employees.reduce( ( acc, emp ) => {
        let cost = 0;
        if ( emp.almuerzo ) cost += tasaDia;
        if ( emp.para_llevar ) cost += precioLlevar;
        if ( emp.cubiertos ) cost += precioCubierto;
        return acc + cost;
    }, 0 );
    return {countAlmuerzos, countAlmuerzosAutorizados, countParaLlevar, countCubiertos, totalPagar};
}
