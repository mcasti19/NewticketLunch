import React, { useState } from 'react';
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
  autorizado: false,
  almuerzos_autorizados: [],
  invitado: true,
};

const ModalAgregarInvitado = ({ isOpen, onRequestClose, onAddInvitado }) => {
  const [form, setForm] = useState(initialState);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (form.nombre && form.apellido && form.gerencia && form.oficina) {
      onAddInvitado({ ...form, invitado: true });
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
            <input type="checkbox" name="para_llevar" checked={form.para_llevar} onChange={handleChange} className="accent-blue-600" /> Para llevar
          </label>
          <label className="flex items-center gap-2 text-blue-700 font-medium">
            <input type="checkbox" name="cubiertos" checked={form.cubiertos} onChange={handleChange} className="accent-blue-600" /> Cubiertos
          </label>
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
