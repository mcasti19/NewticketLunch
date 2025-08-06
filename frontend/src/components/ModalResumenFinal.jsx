import Modal from 'react-modal';
import {useTicketLunchStore} from '../store/ticketLunchStore';
import React, {useState} from 'react';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement( '#root' );

const ModalResumenFinal = ( {isOpen, onRequestClose, onGenerarTickets} ) => {
  const empleados = useTicketLunchStore( state => state.selectedEmpleadosSummary );
  const summary = useTicketLunchStore( state => state.summary );
  // Local state para el referenceNumber
  const [ referenceNumber, setReferenceNumber ] = useState( '' );

  // Limpiar el campo cuando se cierra el modal
  const handleClose = () => {
    setReferenceNumber( '' );
    if ( onRequestClose ) onRequestClose();
  };

  // Validación y notificación
  const handleGenerarTickets = ( e ) => {
    e.preventDefault();
    if ( !referenceNumber || referenceNumber.trim() === '' ) {
      setTimeout( () => {
        toast.error( 'Debe ingresar el número de referencia antes de continuar.' );
      }, 100 );
      return;
    }
    if ( onGenerarTickets ) onGenerarTickets( referenceNumber );
    setReferenceNumber( '' );
  };

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
          width: '98vw',
          maxWidth: '900px',
          minWidth: '320px',
          padding: '32px',
          borderRadius: '18px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)',
        },
      }}
      contentLabel="Resumen Final"
    >
      <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-700 tracking-tight">Resumen de la Solicitud</h2>
      <div className="mb-6 max-h-64 overflow-y-auto rounded-xl shadow-inner">
        <table className="w-full text-sm border min-w-[320px] bg-white/90 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-2 border">Empleado</th>
              <th className="p-2 border">Almuerzo</th>
              <th className="p-2 border">Para Llevar</th>
              <th className="p-2 border">Cubiertos</th>
              <th className="p-2 border">Autorizado</th>
              <th className="p-2 border">Evento Especial</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map( ( emp, idx ) => (
              <React.Fragment key={idx} >
                <tr className="text-center hover:bg-blue-50 transition-colors">
                  <td className="p-2 border font-semibold">{emp.nombre} {emp.apellido}</td>
                  <td className="p-2 border">{emp.almuerzo ? 'Sí' : 'No'}</td>
                  <td className="p-2 border">{emp.para_llevar ? 'Sí' : 'No'}</td>
                  <td className="p-2 border">{emp.cubiertos ? 'Sí' : 'No'}</td>
                  <td className="p-2 border">{emp.autorizado ? 'Sí' : 'No'}</td>
                  <td className="p-2 border">{emp.evento_especial ? 'Sí' : 'No'}</td>
                </tr>
                {emp.autorizado && Array.isArray( emp.almuerzos_autorizados ) && emp.almuerzos_autorizados.length > 0 && (
                  <tr>
                    <td colSpan={6} className="p-2 border bg-blue-50 text-left">
                      <div className="ml-4">
                        <span className="font-semibold">Empleados asociados autorizados:</span>
                        <ul className="list-disc ml-6">
                          {emp.almuerzos_autorizados.map( ( asoc, i ) => (
                            <li key={i}>{asoc}</li>
                          ) )}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ) )}
          </tbody>
        </table>
      </div>
      <div className="mb-6 text-right font-bold text-lg text-blue-800">
        Total a pagar: <span className="text-green-600">Bs. {summary.totalPagar?.toFixed( 2 ) ?? '0.00'}</span>
      </div>

      <form onSubmit={handleGenerarTickets}>
        <div className='flex flex-col w-1/2 justify-center items-center m-auto py-1.5'>
          <label htmlFor="referenceNumber" className="font-bold text-blue-700">
            Número de referencia:
          </label>
          <input
            id="referenceNumber"
            type="text"
            placeholder="Ingrese número de referencia"
            value={referenceNumber}
            onChange={e => setReferenceNumber( e.target.value )}
            className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-center md:justify-between gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Cerrar
          </button>
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Generar Tickets
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalResumenFinal;
