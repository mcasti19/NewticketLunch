import { useParams } from 'react-router';

// Demo: datos en memoria (en real, esto vendría de backend)
const empleadosDemo = [
  {
    id: '1',
    nombre: 'Juan Perez',
    almuerzoParaLlevar: false,
    cubiertos: true,
    autorizado: true,
  },
  {
    id: '2',
    nombre: 'Maria Gomez',
    almuerzoParaLlevar: true,
    cubiertos: false,
    autorizado: false,
  },
  // ...agrega más si quieres
];

export default function TicketPage() {
  const { id } = useParams();
  const empleado = empleadosDemo.find(e => e.id === id);

  if (!empleado) {
    return <div className="p-8 text-center">Empleado no encontrado</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">Ticket de Almuerzo</h2>
      <div className="mb-2 text-lg font-semibold">{empleado.nombre}</div>
      <div className="mb-2">Almuerzo para llevar: <b>{empleado.almuerzoParaLlevar ? 'Sí' : 'No'}</b></div>
      <div className="mb-2">Cubiertos: <b>{empleado.cubiertos ? 'Sí' : 'No'}</b></div>
      <div className="mb-2">Autorizado: <b className={empleado.autorizado ? 'text-green-600' : 'text-red-600'}>{empleado.autorizado ? 'Sí' : 'No'}</b></div>
    </div>
  );
}
