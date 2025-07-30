import React from 'react';
import Modal from 'react-modal';
import { useTicketLunchStore } from '../store/ticketLunchStore';

Modal.setAppElement('#root');

const ModalResumenFinal = ({ isOpen, onRequestClose, onGenerarTickets }) => {
  const empleados = useTicketLunchStore(state => state.selectedEmpleadosSummary);
  const summary = useTicketLunchStore(state => state.summary);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          maxWidth: '98vw',
          minWidth: '350px',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        },
      }}
      contentLabel="Resumen Final"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Resumen de la Solicitud</h2>
      <div className="mb-4 max-h-64 overflow-y-auto">
        <table className="w-full text-sm border min-w-[900px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Empleado</th>
              <th className="p-2 border">Almuerzo</th>
              <th className="p-2 border">Para Llevar</th>
              <th className="p-2 border">Cubiertos</th>
              <th className="p-2 border">Autorizado</th>
              <th className="p-2 border">Evento Especial</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp, idx) => (
              <React.Fragment key={idx}>
                <tr className="text-center">
                  <td className="p-2 border">{emp.nombre} {emp.apellido}</td>
                  <td className="p-2 border">{emp.almuerzo ? 'Sí' : 'No'}</td>
                  <td className="p-2 border">{emp.para_llevar ? 'Sí' : 'No'}</td>
                  <td className="p-2 border">{emp.cubiertos ? 'Sí' : 'No'}</td>
                  <td className="p-2 border">{emp.autorizado ? 'Sí' : 'No'}</td>
                  <td className="p-2 border">{emp.evento_especial ? 'Sí' : 'No'}</td>
                </tr>
                {emp.autorizado && Array.isArray(emp.almuerzos_autorizados) && emp.almuerzos_autorizados.length > 0 && (
                  <tr>
                    <td colSpan={6} className="p-2 border bg-blue-50 text-left">
                      <div className="ml-4">
                        <span className="font-semibold">Empleados asociados autorizados:</span>
                        <ul className="list-disc ml-6">
                          {emp.almuerzos_autorizados.map((asoc, i) => (
                            <li key={i}>{asoc}</li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-4 text-right font-bold">
        Total a pagar: Bs. {summary.totalPagar?.toFixed(2) ?? '0.00'}
      </div>
      <div className="flex justify-between gap-2">
        <button
          onClick={onRequestClose}
          style={{ backgroundColor: '#003366', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Cerrar
        </button>
        <button
          onClick={onGenerarTickets}
          style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Generar Tickets
        </button>
      </div>
    </Modal>
  );
};

export default ModalResumenFinal;
