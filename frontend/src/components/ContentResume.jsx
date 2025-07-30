import React, { useState } from 'react';
import { useTicketLunchStore } from '../store/ticketLunchStore';
import ModalResume from './ModalResume';
import ModalResumenFinal from './ModalResumenFinal';

export const ContentResume = ({ goToTicketTab }) => {
  const summary = useTicketLunchStore(state => state.summary);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [resumenOpen, setResumenOpen] = useState(false);

  const openModal = option => {
    setSelectedPaymentOption(option);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPaymentOption(null);
  };
  const openResumen = () => setResumenOpen(true);
  const closeResumen = () => setResumenOpen(false);
  const handleGenerarTickets = () => {
    setResumenOpen(false);
    setModalIsOpen(false);
    if (goToTicketTab) goToTicketTab();
  };

  return (
    <>

      <div className="w-full max-w-3xl mx-auto bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:bg-gray-950 rounded-3xl shadow-xl p-4 md:p-8 flex flex-col gap-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 text-center mb-2 tracking-tight drop-shadow">Resumen de Almuerzos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 bg-white/90 rounded-2xl shadow p-4 border border-blue-100">
            <span className="flex justify-between text-base md:text-lg font-medium">Total almuerzos: <strong className="text-blue-700">{summary.countAlmuerzos}</strong></span>
            <span className="flex justify-between text-base md:text-lg font-medium">Empleados con almuerzos Autorizados: <strong className="text-blue-700">{summary.countAlmuerzosAutorizados}</strong></span>
            <span className="flex justify-between text-base md:text-lg font-medium">Almuerzo para llevar: <strong className="text-blue-700">{summary.countParaLlevar}</strong></span>
            <span className="flex justify-between text-base md:text-lg font-medium">Cubiertos: <strong className="text-blue-700">{summary.countCubiertos}</strong></span>
            <span className="flex justify-end text-lg md:text-xl font-bold mt-2">Total a pagar: <span className="text-green-600">Bs. {summary.totalPagar.toFixed(2)}</span></span>
          </div>
          <div className="flex flex-col gap-4 items-center justify-center">
            <h3 className="text-xl md:text-2xl font-bold text-center text-blue-700 mb-2">Opciones de Pago</h3>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div
                className="flex flex-col items-center cursor-pointer rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-md hover:shadow-xl border border-blue-200 p-3 transition-all hover:scale-105"
                onClick={() => openModal('Pago Móvil')}
              >
                <span className="font-bold text-blue-700 mb-1">Pago Móvil</span>
                <img src="./pagomovil-removebg-preview.png" alt="pago_movil" className="w-24 md:w-32" />
              </div>
              <div
                className="flex flex-col items-center cursor-pointer rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-md hover:shadow-xl border border-blue-200 p-3 transition-all hover:scale-105"
                onClick={() => openModal('Transferencia')}
              >
                <span className="font-bold text-blue-700 mb-1">Transferencia</span>
                <img src="cuáles-son-los-bancos-de-venezuela.jpg" alt="transferencia" className="w-24 md:w-32 rounded" />
              </div>
              <div
                className="flex flex-col items-center cursor-pointer rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-md hover:shadow-xl border border-blue-200 p-3 transition-all hover:scale-105"
                onClick={() => openModal('Débito')}
              >
                <span className="font-bold text-blue-700 mb-1">Débito</span>
                <img src="./tarjeta.png" alt="tarjeta_debito" className="w-24 md:w-32" />
              </div>
              <div
                className="flex flex-col items-center cursor-pointer rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-md hover:shadow-xl border border-blue-200 p-3 transition-all hover:scale-105"
                onClick={() => openModal('Efectivo')}
              >
                <span className="font-bold text-blue-700 mb-1">Efectivo</span>
                <img src="./efectivo.png" alt="Bolivares_efectivo" className="w-24 md:w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalResume
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        paymentOption={selectedPaymentOption}
        onVerResumen={openResumen}
      />
      <ModalResumenFinal
        isOpen={resumenOpen}
        onRequestClose={closeResumen}
        onGenerarTickets={handleGenerarTickets}
      />
    </>
  );
};
