import {useAuthStore} from '../store/authStore';

export const useCheckToken = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return { isAuthenticated };
};
