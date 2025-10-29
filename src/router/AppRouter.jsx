import React from 'react';
import {Routes, Route, Navigate} from 'react-router';
import LoginPage from '../auth/LoginPage';
import {useCheckToken} from '../hooks/useCheckToken';
import {useTokenValidator} from '../hooks/useTokenValidator';
import {Home} from '../pages/Home';

export const AppRouter = () => {
    useTokenValidator(); // Run token validation every 5 minutes

    const {isAuthenticated} = useCheckToken();

    // Importar aquí para evitar problemas de ciclo
    const TicketPage = React.lazy( () => import( '../pages/TicketPage' ) );
    return (
        <Routes>
            {/* Ruta pública para mostrar ticket por ID */}
            <Route path="/ticket/:id" element={
                <React.Suspense fallback={<div>Cargando ticket...</div>}>
                    <TicketPage />
                </React.Suspense>
            } />
            {
                isAuthenticated
                    ? (
                        <>
                            <Route path="/" element={<Navigate to="/menu" />} />
                            <Route path="/menu" element={<Home tab="menu" />} />
                            <Route path="/selection" element={<Home tab="selection" />} />
                            <Route path="/my-order" element={<Home tab="my-order" />} />
                            <Route path="/profile" element={<Home tab="profile" />} />
                            <Route path="/payment-summary" element={<Home tab="payment-summary" />} />
                            <Route path="/tickets" element={<Home tab="tickets" />} />
                            <Route path="/special-event" element={<Home tab="special-event" />} />
                            <Route path="*" element={<Navigate to="/menu" />} />
                        </>
                    )
                    : (
                        <>
                            <Route path="/auth/login" element={<LoginPage />} />
                            <Route path="*" element={<Navigate to="/auth/login" />} />
                        </>
                    )
            }
        </Routes>
    )
}
