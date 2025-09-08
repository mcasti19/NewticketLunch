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
    const TicketPage = React.lazy(() => import('../pages/TicketPage'));
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
                            <Route path="/seleccion" element={<Home tab="seleccion" />} />
                            <Route path="/resumen-pago" element={<Home tab="resumen-pago" />} />
                            <Route path="/generar-ticket" element={<Home tab="generar-ticket" />} />
                            <Route path="/menu" element={<Home tab="menu" />} />
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
