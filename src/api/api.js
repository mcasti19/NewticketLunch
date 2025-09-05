import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create( {
    baseURL: API_URL
} );

api.interceptors.request.use( config => {
    config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
    return config
} )
export default api;