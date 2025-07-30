import {Routes, Route, Navigate} from 'react-router';
import {Home} from '../ticketlunch/pages/Home';
import LoginPage from '../auth/LoginPage';
import {useCheckToken} from '../hooks/useCheckToken';
import {useTokenValidator} from '../hooks/useTokenValidator';

export const AppRouter = () => {
    useTokenValidator(); // Run token validation every 5 minutes

    const {isAuthenticated} = useCheckToken();

    return (
        <Routes>
            {
                isAuthenticated
                    ? (
                        <>
                            <Route path="/" element={<Navigate to="/home" />} />
                            <Route path="/home" element={
                                // <div className=''>
                                <Home />
                                // </div>
                            } />
                            <Route path="*" element={<Navigate to="/home" />} />
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
