import React, { useState } from 'react';
import {useTicketLunchStore} from '../store/ticketLunchStore';
import ModalResume from './ModalResume';

export const ContentResume = () => {
  const summary = useTicketLunchStore( state => state.summary );

  // Ajusta el offset según el espacio superior que ya ocupa tu layout, por ejemplo 100px o lo que necesites
  const offsetTop = 200; // ejemplo, cambia este valor según tu layout

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);

  const openModal = (option) => {
    setSelectedPaymentOption(option);
    setModalIsOpen( true );
    console.log("Abriendo modal");
    
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPaymentOption(null);
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Resumen de Almuerzos</h2>
      <div
        className="p-4 rounded shadow border-0 text-black dark:text-amber-50"
        style={{height: `calc(100vh - ${ offsetTop }px)`}}
      >
        <div className="w-full h-full flex flex-col ">
          <div className="flex flex-col space-y-1">
            <span className=' flex justify-between'>Total almuerzos: <strong>{summary.countAlmuerzos}</strong></span>
            <span className=' flex justify-between'>Empleados con almuerzos Autorizados: <strong>{summary.countAlmuerzosAutorizados}</strong></span>
            <span className=' flex justify-between'>Empleados con almuerzo para llevar: <strong>{summary.countParaLlevar}</strong></span>
            <span className=' flex justify-between'>Empleados con cubiertos: <strong>{summary.countCubiertos}</strong></span>
          </div>
          <span className='text-right'>Total a pagar: Bs. {summary.totalPagar.toFixed( 2 )}</span>

          <div className='flex flex-col gap-5'>
            <h1 className='text-center text-3xl'>Opciones de Pago</h1>
            <div className='grid grid-cols-2 md:grid-cols-4  gap-4 text-center'>
              <div
                className='border-0 flex flex-col items-center cursor-pointer rounded-4xl shadow-amber-50'
                onClick={() => openModal('Pago Móvil')}
              >
                <span className='font-black'>Pago Móvil</span>
                <img src="./pagomovil-removebg-preview.png" alt="pago_movil" className='w-48 ' />
              </div>
              <div
                className='border-0 flex flex-col items-center cursor-pointer rounded-4xl shadow-amber-50'
                onClick={() => openModal('Transferencia')}
              >
                <span className='font-black'>Transferencia</span>
                <img src="cuáles-son-los-bancos-de-venezuela.jpg" alt="" className='w-48 ' />
              </div>
              <div
                className='border-0 flex flex-col items-center cursor-pointer rounded-4xl shadow-amber-50'
                onClick={() => openModal('Débito')}
              >
                <span className='font-black'>Débito</span>
                <img src="./tarjeta.png" alt="tarjeta_debito" className='w-48 ' />
              </div>
              <div
                className='border-0 flex flex-col items-center cursor-pointer rounded-4xl shadow-amber-50'
                onClick={() => openModal('Efectivo')}
              >
                <span className='font-black'>Efectivo</span>
                <img src="./efectivo.png" alt="Bolivares_efectivo" className='w-48 ' />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalResume isOpen={modalIsOpen} onRequestClose={closeModal} paymentOption={selectedPaymentOption} />
    </>
  );
};
