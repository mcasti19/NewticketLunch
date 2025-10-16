import {useNavigate} from 'react-router';
import {useAuthStore} from '../store/authStore';
import {FiLogOut} from 'react-icons/fi'; // Nuevo icono para salir


export const ExitButton = ( {isCollapsed} ) => {

    const navigate = useNavigate();
    const logout = useAuthStore( ( state ) => state.logout );
    const handleExit = () => {
        localStorage.clear();
        logout();
        navigate( '/auth/login' );
        // console.log( "ME LLEVO AL LOGIN y limpio localStorage" );
    }

    return (
        <button
            onClick={handleExit}
            className={`p-2 rounded-lg hover:bg-red-600 transition-colors ${ isCollapsed ? 'w-full flex justify-center' : 'w-full flex items-center' }`}
            aria-label="Cerrar sesión"
            title={isCollapsed ? "Cerrar sesión" : ''}
        >
            <FiLogOut className="w-5 h-5 text-white" />
            {!isCollapsed && <span className="ml-3 font-medium text-sm">Salir</span>}
        </button>
    )
}
