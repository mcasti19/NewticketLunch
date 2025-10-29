import Modal from 'react-modal';
import {PiCopyThin} from "react-icons/pi"; // Asegúrate de tener instalado 'react-icons'
import {useModalResume} from '../hooks/useModalResume';

// -----------------------------------------------------------
// 💡 1. COMPONENTES AUXILIARES PARA LIMPIEZA DE CÓDIGO (JSX)
// -----------------------------------------------------------

/**
 * Muestra una línea de detalle de pago con opción a copiar.
 */
const PaymentDetail = ( {label, value, onCopy} ) => (
  <div className="flex justify-between font-semibold text-sm text-gray-700">
    <label className='font-bold'>{label}:</label>
    <div
      className="flex items-center text-blue-700 cursor-pointer hover:text-blue-500 transition-colors"
      onClick={() => onCopy( value )}
    >
      <span className="mr-1">{value}</span>
      <PiCopyThin className='w-4 h-4' />
    </div>
  </div>
);

/**
 * Formulario para ingresar los datos de quien realiza el pago (solo para pedidos por lote).
 */
const PayerDataForm = ( {payer, setPayer} ) => (
  <div className="flex flex-col gap-2 p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
    <div className="font-bold text-blue-700 text-lg mb-1 text-center border-b pb-2">Datos de quien realiza el pago</div>
    {[
      {key: 'nombre', placeholder: "Nombre (*)"},
      {key: 'apellido', placeholder: "Apellido"},
      {key: 'cedula', placeholder: "Cédula (*)"},
      {key: 'gerencia', placeholder: "Gerencia"},
      {key: 'telefono', placeholder: "Teléfono"},
    ].map( ( {key, placeholder} ) => (
      <input
        key={key}
        type="text"
        placeholder={placeholder}
        className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={payer[ key ]}
        onChange={e => setPayer( p => ( {...p, [ key ]: e.target.value} ) )}
      />
    ) )}
  </div>
);

/**
 * Componente para subir el comprobante/voucher de pago.
 */
const VoucherUpload = ( {voucher, handleVoucherChange} ) => (
  <div className="flex flex-col gap-2 p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
    <label className="font-bold text-blue-700 text-lg mb-1 text-center border-b pb-2">
      Adjuntar Captura de pago <span className='text-red-600'>(*)</span>
    </label>
    {/* Etiqueta personalizada para el input file */}
    <label className="p-3 bg-white text-blue-700 border border-blue-300 rounded-lg cursor-pointer text-center hover:bg-blue-100 transition-colors shadow-sm">
      {voucher ? `Archivo: ${ voucher.name }` : 'Seleccionar archivo'}
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleVoucherChange}
        className="hidden"
      />
    </label>

    {voucher && (
      <img
        src={URL.createObjectURL( voucher )}
        alt="Voucher"
        className="mt-3 max-h-40 rounded-lg border-2 border-blue-300 object-cover shadow-lg"
      />
    )}
  </div>
);


// -----------------------------------------------------------
// 💡 2. MODAL PRINCIPAL
// -----------------------------------------------------------

export const ModalResume = ( {isOpen, onRequestClose, paymentOption, paymentMethodMap, onGenerarTickets, orderOrigin} ) => {

  const {
    // --- HANDLERS ---
    handleCopy,
    handleVoucherChange,
    setLocalReferenceNumber, // El componente usa este setter para el input
    handleGenerarTickets,
    // --- VARIABLES NECESARIAS PARA EL JSX ---
    isDigitalPayment,
    isBatchOrder,
    referenceNumber,
    payer,
    setPayer, // Necesario para PayerDataForm
    voucher,
    isLoading,
    paymentInfo,
    summary,
  } = useModalResume( {paymentMethodMap, onGenerarTickets, orderOrigin, onRequestClose, paymentOption} )

  // --- RENDERIZADO DEL MODAL ---
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {backgroundColor: 'rgba(0, 0, 0, 0.75)'},
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '95vw',
          maxWidth: '450px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '0',
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          background: 'linear-gradient(145deg, #e9f0ff 0%, #fefefe 100%)',
        }
      }}
      contentLabel="Resumen y Pago"
    >
      <div className="p-6">
        <div className="mb-6 text-center">
          <h3 className="font-black text-2xl text-blue-900 mb-1">{paymentOption}</h3>
          <div className="font-extrabold text-xl text-blue-800">
            Total a pagar: <span className="text-green-600">Bs. {summary.totalPagar?.toFixed( 2 ) ?? '0.00'}</span>
          </div>
        </div>

        <form onSubmit={handleGenerarTickets} className="flex flex-col gap-6">

          {/* --- INFORMACIÓN DEL MÉTODO DE PAGO DINÁMICA --- */}
          {paymentInfo && (
            <div className="flex flex-col gap-2 p-4 bg-white rounded-xl shadow-inner border border-blue-200">
              <h4 className="font-bold text-blue-700 text-center mb-1 text-lg border-b pb-2">Datos de Pago</h4>

              {( paymentInfo.telefono || paymentInfo.cuenta ) && (
                <PaymentDetail
                  label={paymentInfo.telefono ? 'Teléfono' : 'Cuenta'}
                  value={paymentInfo.telefono || paymentInfo.cuenta}
                  onCopy={handleCopy}
                />
              )}

              {paymentInfo.banco && (
                <PaymentDetail
                  label="Banco"
                  value={paymentInfo.banco}
                  onCopy={() => handleCopy( paymentInfo.banco.split( ' - ' )[ 0 ] )}
                />
              )}

              {paymentInfo.cedula && (
                <PaymentDetail
                  label="Cédula"
                  value={paymentInfo.cedula}
                  onCopy={() => handleCopy( paymentInfo.cedula.replace( 'V-', '' ).replace( /\./g, '' ) )}
                />
              )}
            </div>
          )}

          {/* --- DATOS DE QUIEN REALIZA EL PAGO (Condicional) --- */}
          {isDigitalPayment && isBatchOrder && (
            <PayerDataForm payer={payer} setPayer={setPayer} />
          )}

          {/* --- ADJUNTAR CAPTURA DE PAGO (Condicional) --- */}
          {isDigitalPayment && (
            <VoucherUpload voucher={voucher} handleVoucherChange={handleVoucherChange} />
          )}

          {/* --- NÚMERO DE REFERENCIA (Condicional) --- */}
          {isDigitalPayment && (
            <div className='flex flex-col gap-2'>
              <label htmlFor="referenceNumber" className="font-bold text-blue-900 text-center">
                Número de referencia: <span className='text-red-600'>(*)</span>
              </label>
              <input
                id="referenceNumber"
                type="tel" // Usar 'tel' para mejor teclado en móviles
                inputMode="numeric" // Sugiere teclado numérico
                placeholder="Ingrese número de referencia"
                value={referenceNumber}
                // Aplica el filtro numérico
                onChange={e => setLocalReferenceNumber( e.target.value )}
                className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-md transition-shadow"
              />
            </div>
          )}

          {/* --- BOTONES DE ACCIÓN --- */}
          <div className="flex justify-between gap-4 mt-2">
            <button
              type="button"
              onClick={onRequestClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-extrabold shadow-lg transition-colors"
              disabled={isLoading}
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-extrabold shadow-lg transition-colors disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Generando...' : 'Generar Tickets'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};