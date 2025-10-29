import React, {useEffect, useState} from 'react'
import {useTicketLunchStore} from '../store/ticketLunchStore';
import {getPaymentMethodsMap} from '../services/actions';

export const usePaymentSummary = ( {goToTicketTab, goBackSeleccionTab, goBackMyOrderTab} ) => {
    const [ modalIsOpen, setModalIsOpen ] = useState( false );
    const [ selectedPaymentOption, setSelectedPaymentOption ] = useState( null );
    const [ paymentMethodMap, setPaymentMethodMap ] = useState( {} );
    const [ isLoading, setIsLoading ] = useState( true );
    const [ isError, setIsError ] = useState( false ); // Nuevo estado para manejo de error

    // --- ESTADOS DEL STORE ---
    const setReferenceNumber = useTicketLunchStore( state => state.setReferenceNumber );
    const setTicketEnabled = useTicketLunchStore( state => state.setTicketEnabled );
    const orderOrigin = useTicketLunchStore( state => state.orderOrigin );

    // --- HANDLERS ---
    const openModal = optionName => {
        setSelectedPaymentOption( optionName );
        setModalIsOpen( true );
    };

    const closeModal = () => {
        setModalIsOpen( false );
        setSelectedPaymentOption( null );
    };

    const handleGenerarTickets = ( referenceNumber ) => {
        setReferenceNumber( referenceNumber );
        setModalIsOpen( false );
        setTicketEnabled( true );
        if ( goToTicketTab ) goToTicketTab();
    };

    const handleModifyOrder = () => {
        // Lógica de navegación basada en el origen del pedido
        if ( orderOrigin === 'mi-ticket' && goBackMyOrderTab ) {
            goBackMyOrderTab();
        } else if ( orderOrigin === 'seleccion' && goBackSeleccionTab ) {
            goBackSeleccionTab();
        } else {
            // Comportamiento por defecto: volver a Selección
            if ( goBackSeleccionTab ) goBackSeleccionTab();
        }
    }

    // --- EFECTO: Carga de Métodos de Pago ---
    useEffect( () => {
        const fetchPaymentMethods = async () => {
            setIsLoading( true );
            setIsError( false );
            try {
                const map = await getPaymentMethodsMap();
                setPaymentMethodMap( map );
            } catch ( error ) {
                console.error( "Error al cargar los métodos de pago:", error );
                setIsError( true );
                setPaymentMethodMap( {} );
            } finally {
                setIsLoading( false );
            }
        };

        fetchPaymentMethods();
    }, [] );


    return {
        // --- HANDLERS ---
        openModal,
        closeModal,
        handleGenerarTickets,
        handleModifyOrder,
        // --- ESTADOS ---
        modalIsOpen,
        selectedPaymentOption,
        paymentMethodMap,
        isLoading,
        isError,

        setReferenceNumber,
        setTicketEnabled,
        orderOrigin
    }
}
