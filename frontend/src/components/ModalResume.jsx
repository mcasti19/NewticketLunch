import React, {useRef, useEffect, useState, useCallback} from 'react';
import Modal from 'react-modal';


Modal.setAppElement( '#root' );

const ModalResume = ( {isOpen, onRequestClose, paymentOption} ) => {
  const subtitleRef = useRef( null );

  // Consolidate state using a single object
  const [ paymentDetails, setPaymentDetails ] = useState( {
    referenceNumber: '',
    phoneNumber: '',
    bank: '',
    idNumber: '',
    accountNumber: '',
    accountType: '',
  } );

  // Use useCallback to memoize the handler
  const handleInputChange = useCallback(
    ( field ) => ( e ) => {
      setPaymentDetails( ( prev ) => ( {...prev, [ field ]: e.target.value} ) );
    },
    [ setPaymentDetails ]
  );

  useEffect( () => {
    if ( isOpen && subtitleRef.current ) {
      subtitleRef.current.style.color = '#003366';
    }
  }, [ isOpen ] );

  const {referenceNumber,
    // phoneNumber,
    // bank,
    // idNumber,
    // accountNumber,
    // accountType
  } = paymentDetails;

  const isPagoMovil = paymentOption === 'Pago Móvil';
  const isTransferencia = paymentOption === 'Transferencia';

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      // className="top-1/2 left-1/2 -mr-[50%] w-md p-6 rounded-lg  shadow-2xl"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          fontFamily: 'Arial, sans-serif',
        },
      }}
      contentLabel="Payment Modal"
    >
      <h2 ref={subtitleRef} style={{marginBottom: '20px', color: '#003366'}}>
        Pago: {paymentOption || 'Ninguno seleccionado'}
      </h2>
      <form className='flex flex-col gap-3'>
        {isPagoMovil && (
          <>
            <span>Cédula: <strong>xx.xxx.xxx</strong></span>
            <span>Celular: <strong>04xx.xxxx.xxxx</strong></span>
            <span>Banco: <strong>Banco xxxxx</strong></span>
          </>
        )}

        {isTransferencia && (
          <>
            <span>Banco: <strong>Banco xxxxx</strong></span>
            <span>Número de Cuenta: <strong>0102 xxxx xxxxx xxxxx xxxx</strong></span>
            <span>Tipo de Cuenta: <strong>Ahorro / Corriente</strong></span>
            <span>Cédula: <strong>xx.xxx.xxx</strong></span>
            <span>Celular: <strong>04xx.xxxx.xxxx</strong></span>
          </>
        )}

        <label htmlFor="referenceNumber" className='font-bold'>
          Número de referencia:
        </label>
        <input
          id="referenceNumber"
          type="text"
          placeholder="Ingrese número de referencia"
          value={referenceNumber}
          onChange={handleInputChange( referenceNumber )}
          className='p-2 rounded-sm border-1 border-slate-500'
        />
      </form>

      <div className='border-0 flex justify-center items-center'>
        <button
          onClick={onRequestClose}
          style={{
            backgroundColor: '#003366',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            margin: '20px auto'
          }}
          className=''
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default ModalResume;


// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import Modal from 'react-modal';
// import '../index.css'

// Modal.setAppElement('#root');

// const ModalResume = ({ isOpen, onRequestClose, paymentOption }) => {
//   const subtitleRef = useRef(null);

//   // Consolidate state using a single object
//   const [paymentDetails, setPaymentDetails] = useState({
//     referenceNumber: '',
//     phoneNumber: '',
//     bank: '',
//     idNumber: '',
//     accountNumber: '',
//     accountType: '',
//   });

//   // Use useCallback to memoize the handler
//   const handleInputChange = useCallback(
//     (field) => (e) => {
//       setPaymentDetails((prev) => ({ ...prev, [field]: e.target.value }));
//     },
//     [setPaymentDetails]
//   );

//   useEffect(() => {
//     if (isOpen && subtitleRef.current) {
//       subtitleRef.current.style.color = '#003366';
//     }
//   }, [isOpen]);

//   const { referenceNumber, phoneNumber, bank, idNumber, accountNumber, accountType } =
//     paymentDetails;

//   const isPagoMovil = paymentOption === 'Pago Móvil';
//   const isTransferencia = paymentOption === 'Transferencia';

//   return (
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