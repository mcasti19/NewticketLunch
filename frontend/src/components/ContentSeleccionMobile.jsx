import React, { useEffect, useState, useMemo, useCallback } from 'react';
import empleadosData from "../data/mockDataEmpleados.json";
import { useAuthStore } from '../store/authStore';
import { useTasaDia } from '../hooks/useTasaDia';

export const ContentSeleccionMobile = () => {
  const [empleados, setEmpleados] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null); // track open dropdown by row id
  const { user } = useAuthStore();
  const userGerencia = user?.gerencia || null;

  const {
    data: tasaDia,
  } = useTasaDia();

  const precioLlevar = 15;
  const precioCubierto = 20;

  useEffect(() => {
    setEmpleados(empleadosData);
  }, [tasaDia]);

  const filteredEmpleados = useMemo(() => {
    return userGerencia
      ? empleados.filter(emp => emp.gerencia === userGerencia)
      : [];
  }, [empleados, userGerencia]);

  const toggleEmpleadoField = useCallback((empleadoOriginal, field) => {
    setEmpleados(prevEmpleados =>
      prevEmpleados.map(emp =>
        emp.nombre === empleadoOriginal.nombre && emp.apellido === empleadoOriginal.apellido
          ? { ...emp, [field]: !emp[field] }
          : emp
      )
    );
  }, []);

  const updateAlmuerzosAutorizados = useCallback((empleadoOriginal, selectedAutorizados) => {
    setEmpleados(prevEmpleados =>
      prevEmpleados.map(emp =>
        emp.nombre === empleadoOriginal.nombre && emp.apellido === empleadoOriginal.apellido
          ? { ...emp, almuerzos_autorizados: selectedAutorizados }
          : emp
      )
    );
  }, []);

  return (
    <div className="md:hidden p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
      {filteredEmpleados.map((empleado) => (
        <div key={empleado.nombre + empleado.apellido} className="border rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold">{empleado.nombre} {empleado.apellido}</h3>
          <div className="flex flex-col mt-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={empleado.almuerzo}
                onChange={() => toggleEmpleadoField(empleado, 'almuerzo')}
              />
              <span className="ml-2">Almuerzo: Bs. {tasaDia}</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={empleado.para_llevar}
                onChange={() => toggleEmpleadoField(empleado, 'para_llevar')}
                disabled={!empleado.almuerzo}
              />
              <span className="ml-2">Para llevar: Bs. {precioLlevar}</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={empleado.cubiertos}
                onChange={() => toggleEmpleadoField(empleado, 'cubiertos')}
                disabled={!empleado.almuerzo}
              />
              <span className="ml-2">Cubiertos: Bs. {precioCubierto}</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={empleado.autorizado}
                onChange={() => toggleEmpleadoField(empleado, 'autorizado')}
              />
              <span className="ml-2">Autorizado</span>
            </label>

            <div className="relative mt-2">
              <div
                className={`bg-slate-700 text-white p-1 rounded select-none cursor-pointer text-center ${!empleado.autorizado ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (empleado.autorizado) {
                    setDropdownOpen(dropdownOpen === empleado.nombre ? null : empleado.nombre);
                  }
                }}
              >
                {empleado.almuerzos_autorizados && empleado.almuerzos_autorizados.length > 0
                  ? empleado.almuerzos_autorizados.join(', ')
                  : 'Seleccione'}
              </div>
              {dropdownOpen === empleado.nombre && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-auto w-48 text-black">
                  {empleados
                    .filter(emp => emp.gerencia === userGerencia && emp !== empleado)
                    .map(emp => {
                      const fullName = emp.nombre + ' ' + emp.apellido;
                      const checked = empleado.almuerzos_autorizados.includes(fullName);
                      return (
                        <label key={fullName} className="flex items-center px-2 py-1 hover:bg-gray-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const newAutorizados = checked
                                ? empleado.almuerzos_autorizados.filter(name => name !== fullName)
                                : [...empleado.almuerzos_autorizados, fullName];
                              updateAlmuerzosAutorizados(empleado, newAutorizados);
                            }}
                            className="mr-2"
                          />
                          {fullName}
                        </label>
                      );
                    })}
                </div>
              )}
            </div>
            <div className="mt-2">
              <strong>Total Almuerzos:</strong> {empleado.almuerzo ? 1 : 0} + {(empleado.almuerzos_autorizados || []).length}
            </div>
            <div className="mt-2">
              <strong>Total a Pagar (Bs.):</strong> {
                ((empleado.almuerzo ? 1 : 0) * parseFloat(tasaDia || 0) +
                  (empleado.almuerzos_autorizados || []).length * parseFloat(tasaDia || 0) +
                  (empleado.para_llevar ? precioLlevar : 0) +
                  (empleado.cubiertos ? precioCubierto : 0)).toFixed(2)
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
