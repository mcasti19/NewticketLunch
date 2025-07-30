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
          width: '400px',
          padding: '24px',
          borderRadius: '10px',
        },
      }}
      contentLabel="Agregar Invitado"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Agregar Invitado</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="p-2 border rounded" required />
        <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" className="p-2 border rounded" required />
        <input name="gerencia" value={form.gerencia} onChange={handleChange} placeholder="Gerencia" className="p-2 border rounded" required />
        <input name="oficina" value={form.oficina} onChange={handleChange} placeholder="Oficina" className="p-2 border rounded" required />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="almuerzo" checked={form.almuerzo} onChange={handleChange} /> Almuerzo
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="para_llevar" checked={form.para_llevar} onChange={handleChange} /> Para llevar
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="cubiertos" checked={form.cubiertos} onChange={handleChange} /> Cubiertos
        </label>
        {/* <label className="flex items-center gap-2">
          <input type="checkbox" name="autorizado" checked={form.autorizado} onChange={handleChange} /> Autorizado
        </label> */}
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={onRequestClose} className="flex-1 bg-gray-400 text-white py-2 rounded">Cancelar</button>
          <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded">Agregar</button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalAgregarInvitado;
