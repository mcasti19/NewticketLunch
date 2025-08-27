import { useState, useMemo } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const initialState = {
  nombre: '',
  apellido: '',
  gerencia: '',
  oficina: '',
  almuerzo: false,
  para_llevar: false,
  cubiertos: false,
  id_autorizado: null,
};

const ModalAgregarInvitado = ({ isOpen, onRequestClose, onAddInvitado, employeeList }) => {
  const [form, setForm] = useState(initialState);
  
  const employeesForSelect = useMemo(() => {
    return employeeList ? employeeList.filter(emp => !emp.invitado) : [];
  }, [employeeList]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    
    setForm(prev => {
      let newState = { ...prev, [name]: type === 'checkbox' ? checked : value };
      
      // Lógica para que el checkbox "Para llevar" dependa de "Almuerzo"
      if (name === 'almuerzo' && !checked) {
        newState.para_llevar = false;
        newState.cubiertos = false;
        newState.id_autorizado = null;
      }
      
      // Lógica para resetear el autorizado si se desmarca "Para llevar"
      if (name === 'para_llevar' && !checked) {
        newState.id_autorizado = null;
      }
      
      return newState;
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const invitadoCompleto = {
      ...form,
      cedula: `INVITADO-${Date.now()}`, // Genera una cédula única para el invitado
      nombre_completo: `${form.nombre} ${form.apellido}`,
      invitado: true,
      evento_especial: false,
    };

    if (form.nombre && form.apellido && form.gerencia && form.oficina) {
      onAddInvitado(invitadoCompleto);
      setForm(initialState);
      onRequestClose();
    }
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
          width: '95%',
          maxWidth: '420px',
          padding: '32px',
          borderRadius: '18px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)',
        },
      }}
      contentLabel="Agregar Invitado"
    >
      <h2 className="text-2xl font-extrabold mb-4 text-center text-blue-700 tracking-tight">Agregar Invitado</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm" required />
        <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm" required />
        <input name="gerencia" value={form.gerencia} onChange={handleChange} placeholder="Gerencia" className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm" required />
        <input name="oficina" value={form.oficina} onChange={handleChange} placeholder="Oficina" className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm" required />
        
        <div className="flex flex-wrap gap-3 mt-2 justify-between">
          <label className="flex items-center gap-2 text-blue-700 font-medium">
            <input type="checkbox" name="almuerzo" checked={form.almuerzo} onChange={handleChange} className="accent-blue-600" /> Almuerzo
          </label>
          <label className="flex items-center gap-2 text-blue-700 font-medium">
            <input type="checkbox" name="para_llevar" checked={form.para_llevar} onChange={handleChange} disabled={!form.almuerzo} className="accent-blue-600" /> Para llevar
          </label>
          <label className="flex items-center gap-2 text-blue-700 font-medium">
            <input type="checkbox" name="cubiertos" checked={form.cubiertos} onChange={handleChange} disabled={!form.almuerzo} className="accent-blue-600" /> Cubiertos
          </label>
        </div>
        
        <div className="flex flex-col gap-1 mt-2">
          <label className="text-blue-700 font-medium">Persona Autorizada</label>
          <select
            name="id_autorizado"
            value={form.id_autorizado || ''}
            onChange={handleChange}
            disabled={!form.para_llevar}
            className={`p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 shadow-sm
              ${!form.para_llevar ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value="">Seleccione...</option>
            {employeesForSelect.map(emp => (
              <option key={emp.cedula} value={emp.cedula}>
                {emp.nombre_completo}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2 mt-6">
          <button type="button" onClick={onRequestClose} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg font-semibold transition-colors">Cancelar</button>
          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors">Agregar</button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalAgregarInvitado;