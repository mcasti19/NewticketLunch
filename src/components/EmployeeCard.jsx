import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';

export function EmployeeCard({ emp, handleFieldToggle, handleAuthorizedChange, tasaDia, precioLlevar, precioCubierto, getOtherEmployees }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: '-20% 0px -20% 0px' });
    return (
        <motion.div
            ref={ref}
            className="bg-white/90 rounded-2xl shadow-md border border-blue-100 p-4 flex flex-col gap-2 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ willChange: 'opacity, transform' }}
        >
            <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-blue-700">{emp.first_name || emp.nombre || ''} {emp.last_name || emp.apellido || ''}</h3>
                {emp.invitado && (
                    <span className="ml-2 px-2 py-1 text-xs bg-yellow-300 text-yellow-900 rounded font-bold">INVITADO</span>
                )}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
                <span className="font-medium text-sm">Evento Especial:</span>
                <button
                    type="button"
                    aria-pressed={!!emp.evento_especial}
                    onClick={() => handleFieldToggle(emp, 'evento_especial')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${emp.evento_especial ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${emp.evento_especial ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={!!emp.almuerzo}
                    onChange={() => handleFieldToggle(emp, 'almuerzo')}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span>Almuerzo: <span className="font-semibold">Bs. {tasaDia}</span></span>
            </label>
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={!!emp.para_llevar}
                    onChange={() => handleFieldToggle(emp, 'para_llevar')}
                    disabled={!emp.almuerzo}
                    className="form-checkbox h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <span>Para llevar: <span className="font-semibold">Bs. {precioLlevar}</span></span>
            </label>
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={!!emp.cubiertos}
                    onChange={() => handleFieldToggle(emp, 'cubiertos')}
                    disabled={!emp.almuerzo}
                    className="form-checkbox h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                />
                <span>Cubiertos: <span className="font-semibold">Bs. {precioCubierto}</span></span>
            </label>
            {!emp.invitado && (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Persona Autorizada:</span>
                    <select
                        value={emp.id_autorizado || ''}
                        onChange={e => handleAuthorizedChange(emp, e.target.value || null)}
                        disabled={!emp.para_llevar}
                        className="px-2 py-1 text-sm rounded-md border focus:outline-none focus:ring-2 bg-white border-gray-300"
                    >
                        <option value="">Seleccione...</option>
                        {getOtherEmployees.map(other => (
                            <option key={other.cedula} value={other.cedula}>{other.first_name || other.nombre || ''} {other.last_name || other.apellido || ''}</option>
                        ))}
                    </select>
                </div>
            )}
            <div className="flex flex-col gap-1 mt-2">
                <span className="text-sm font-medium text-blue-700">Total a Pagar (Bs.): <span className="font-bold">
                    {( ( emp.almuerzo ? 1 : 0 ) * parseFloat( tasaDia || 0 ) +
                        ( emp.id_autorizado ? 1 : 0 ) * parseFloat( tasaDia || 0 ) +
                        ( emp.para_llevar ? precioLlevar : 0 ) +
                        ( emp.cubiertos ? precioCubierto : 0 ) ).toFixed( 2 )}
                </span></span>
            </div>
        </motion.div>
    );
}
