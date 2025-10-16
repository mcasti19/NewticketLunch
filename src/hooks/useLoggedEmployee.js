import {useAuthStore} from '../store/authStore';

export const useLoggedEmployee = () => {
    const { user } = useAuthStore();

    const employee = user
        ? {
                fullName: user.fullName || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                cedula: user.cedula || '',
                phone: user.phone || '',
                management: user.management || '',
                position: user.position || '',
                state: user.state || '',
                type_employee: user.type_employee || '',
            }
        : null;

    return { employee };
};
