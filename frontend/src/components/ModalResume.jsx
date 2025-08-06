import {useRef, useState} from 'react';
import Modal from 'react-modal';
import {toast} from 'react-toastify'; // Puedes usar react-toastify para notificaciones
import {PiCopyThin} from "react-icons/pi";



Modal.setAppElement( '#root' );

const ModalResume = ( {isOpen, onRequestClose, paymentOption, onVerResumen} ) => {
  const subtitleRef = useRef( null );
  const [ paymentDetails, setPaymentDetails ] = useState( {
    referenceNumber: '',
    phoneNumber: '',
    bank: '',
    idNumber: '',
    accountNumber: '',
    accountType: '',
  } );

  const handleInputChange = ( field ) => ( e ) => {
    setPaymentDetails( ( prev ) => ( {...prev, [ field ]: e.target.value} ) );
  };

  const handleCopy = async ( text ) => {
    try {
      await navigator.clipboard.writeText( text );
      // Aquí puedes usar un toast o un alert para notificar al usuario
      // toast.success( "¡Número copiado al portapapeles! 🎉" );
      console.log( "¡Número copiado al portapapeles! 🎉" );

      // O un simple alert
      alert( "¡Número copiado al portapapeles!" );
    } catch ( err ) {
      console.error( 'Error al copiar: ', err );
      toast.error( "Error al copiar el número." );
    }
  };

  const isPagoMovil = paymentOption === 'Pago Móvil';
  const isTransferencia = paymentOption === 'Transferencia';

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
      contentLabel="Payment Modal"
    >
      <h2 ref={subtitleRef} className="text-2xl font-extrabold mb-4 text-center text-blue-700 tracking-tight">
        Datos: {paymentOption || 'Ninguno seleccionado'}
      </h2>
      <form className="flex flex-col gap-3">
        {isPagoMovil && (
          <>
            <div className="flex justify-between font-bold text-blue-700">
              <label htmlFor="">Número de Teléfono:</label>
              <div
                className="flex text-gray-800 hover:text-blue-500 transition-colors duration-200 ml-2"
              >
                <label htmlFor="">0414-2418171 </label>

                <PiCopyThin onClick={() => handleCopy( '0414-2418171' )}
                  style={{cursor: 'pointer', userSelect: 'none'}} />
              </div>
            </div>


            <div className="flex justify-between font-bold text-blue-700">
              <label htmlFor="">Banco:</label>
              <div
                className=" flex text-gray-800 hover:text-blue-500 transition-colors duration-200"
              >
                <label htmlFor="">0108 - Provicial</label>
                <PiCopyThin onClick={() => handleCopy( '0108' )}
                  style={{cursor: 'pointer', userSelect: 'none'}}
                />
              </div>
            </div>

            <div className="flex justify-between font-bold text-blue-700">
              <label htmlFor="">Cédula:</label>
              <div
                className=" flex text-gray-800 hover:text-blue-500 transition-colors duration-200"
              >
                <label htmlFor="">V-19.254.775</label>
                <PiCopyThin onClick={() => handleCopy( '19.254.775' )}
                  style={{cursor: 'pointer', userSelect: 'none'}}
                />
              </div>
            </div>
          </>
        )}

        {isTransferencia && (
          <>
            <label htmlFor="bank" className="font-bold text-blue-700">
              Banco:
            </label>
            <input
              id="bank"
              type="text"
              placeholder="Ingrese banco"
              value={paymentDetails.bank}
              onChange={handleInputChange( 'bank' )}
              className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm"
            />

            <label htmlFor="accountNumber" className="font-bold text-blue-700">
              Número de Cuenta:
            </label>
            <input
              id="accountNumber"
              type="text"
              placeholder="Ingrese número de cuenta"
              value={paymentDetails.accountNumber}
              onChange={handleInputChange( 'accountNumber' )}
              className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm"
            />

            <label htmlFor="accountType" className="font-bold text-blue-700">
              Tipo de Cuenta:
            </label>
            <input
              id="accountType"
              type="text"
              placeholder="Ingrese tipo de cuenta"
              value={paymentDetails.accountType}
              onChange={handleInputChange( 'accountType' )}
              className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm"
            />

            <label htmlFor="idNumber" className="font-bold text-blue-700">
              Cédula:
            </label>
            <input
              id="idNumber"
              type="text"
              placeholder="Ingrese cédula"
              value={paymentDetails.idNumber}
              onChange={handleInputChange( 'idNumber' )}
              className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm"
            />
          </>
        )}

        {/* <label htmlFor="referenceNumber" className="font-bold text-blue-700">
          Número de referencia:
        </label>
        <input
          id="referenceNumber"
          type="text"
          placeholder="Ingrese número de referencia"
          value={paymentDetails.referenceNumber}
          onChange={handleInputChange( 'referenceNumber' )}
          className="p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500 shadow-sm"
        /> */}
      </form>
      <div className="flex flex-col justify-center items-center gap-2 mt-6">
        <button
          onClick={() => {if ( onVerResumen ) onVerResumen();}}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
        >
          Ver Resumen
        </button>
        <button
          onClick={onRequestClose}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg font-semibold transition-colors mb-2"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default ModalResume;


//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       className="modal-container" // Use className for styling
//       contentLabel="Payment Modal"
//     >
//       <h2 ref={subtitleRef} className="text-2xl font-bold text-blue-dark mb-5">
//         Pago: {paymentOption || 'Ninguno seleccionado'}
//       </h2>
//       <form className="flex flex-col gap-3">
//         {isPagoMovil && (
//           <>
//             <label htmlFor="phoneNumber" className="font-bold text-gray-700">
//               Número de Teléfono:
//             </label>
//             <input
//               id="phoneNumber"
//               type="text"
//               placeholder="Ingrese número de teléfono"
//               value={phoneNumber}
//               onChange={handleInputChange('phoneNumber')}
//               className="input-field"
//             />

//             <label htmlFor="bank" className="font-bold text-gray-700">
//               Banco:
//             </label>
//             <input
//               id="bank"
//               type="text"
//               placeholder="Ingrese banco"
//               value={bank}
//               onChange={handleInputChange('bank')}
//               className="input-field"
//             />

//             <label htmlFor="idNumber" className="font-bold text-gray-700">
//               Cédula:
//             </label>
//             <input
//               id="idNumber"
//               type="text"
//               placeholder="Ingrese cédula"
//               value={idNumber}
//               onChange={handleInputChange('idNumber')}
//               className="input-field"
//             />
//           </>
//         )}

//         {isTransferencia && (
//           <>
//             <label htmlFor="bank" className="font-bold text-gray-700">
//               Banco:
//             </label>
//             <input
//               id="bank"
//               type="text"
//               placeholder="Ingrese banco"
//               value={bank}
//               onChange={handleInputChange('bank')}
//               className="input-field"
//             />

//             <label htmlFor="accountNumber" className="font-bold text-gray-700">
//               Número de Cuenta:
//             </label>
//             <input
//               id="accountNumber"
//               type="text"
//               placeholder="Ingrese número de cuenta"
//               value={accountNumber}
//               onChange={handleInputChange('accountNumber')}
//               className="input-field"
//             />

//             <label htmlFor="accountType" className="font-bold text-gray-700">
//               Tipo de Cuenta:
//             </label>
//             <input
//               id="accountType"
//               type="text"
//               placeholder="Ingrese tipo de cuenta"
//               value={accountType}
//               onChange={handleInputChange('accountType')}
//               className="input-field"
//             />
//           </>
//         )}

//         <label htmlFor="referenceNumber" className="font-bold text-gray-700">
//           Número de referencia:
//         </label>
//         <input
//           id="referenceNumber"
//           type="text"
//           placeholder="Ingrese número de referencia"
//           value={referenceNumber}
//           onChange={handleInputChange('referenceNumber')}
//           className="input-field"
//         />
//       </form>

//       <div className="flex justify-center items-center mt-5">
//         <button onClick={onRequestClose} className="button">
//           Cerrar
//         </button>
//       </div>
//     </Modal>
//   );
// };

// export default ModalResume;