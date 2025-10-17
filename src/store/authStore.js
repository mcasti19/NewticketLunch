import {create} from "zustand";
import {formatFullName} from '../utils/employeeUtils';

const TOKEN_KEY = "token";
const TOKEN_EXPIRATION_KEY = "tokenExpiration";
const USER_KEY = "LoggedUser";

function getToken() {
  return localStorage.getItem( TOKEN_KEY );
}

function getTokenExpiration() {
  const expiration = localStorage.getItem( TOKEN_EXPIRATION_KEY );
  return expiration ? parseInt( expiration, 10 ) : null;
}

function getUser() {
  const user = localStorage.getItem( USER_KEY );
  return user ? JSON.parse( user ) : null;
}

function isTokenValid() {
  const token = getToken();
  const expiration = getTokenExpiration();
  if ( !token || !expiration ) return false;
  return new Date().getTime() < expiration;
}

function saveSession( token, expiration, user ) {
  localStorage.setItem( TOKEN_KEY, token );
  localStorage.setItem( TOKEN_EXPIRATION_KEY, expiration.toString() );
  // Guardamos en localStorage sólo el user normalizado
  localStorage.setItem( USER_KEY, JSON.stringify( user ) );
}

function clearSession() {
  localStorage.removeItem( TOKEN_KEY );
  localStorage.removeItem( TOKEN_EXPIRATION_KEY );
  localStorage.removeItem( USER_KEY );
}

export const useAuthStore = create( ( set, get ) => {
  const tokenExpiration = getTokenExpiration();
  const user = isTokenValid() ? getUser() : null;
  const isAuthenticated = isTokenValid();
  const status = isAuthenticated ? 'authenticated' : 'unauthenticated';

  // Keep a small, explicit cedula field to avoid parsing user everywhere
  const cedula = user?.cedula || null;

  const login = ( user, token, expiration ) => {
    // user here is the raw backend payload; normalizamos antes de guardar
    const emp = user?.employees || {};
    console.log( "EMP:", emp );

    const formattedEmp = formatFullName( emp ) || {};
    const normalized = {
      email: user?.email || '',
      cedula: emp?.cedula || '',
      fullName: formattedEmp.fullName || `${ emp?.first_name || '' } ${ emp?.last_name || '' }`.trim(),
      management: emp?.management || '',
      phone: emp?.phone || '',
      position: emp?.position || '',
      state: emp?.state || '',
      type_employee: emp?.type_employee || '',
    };
    saveSession( token, expiration, normalized );
    const c = normalized.cedula || null;
    set( {user: normalized, isAuthenticated: true, status: 'authenticated', tokenExpiration: expiration, cedula: c} );
  };

  const logout = () => {
    clearSession();
    set( {user: null, isAuthenticated: false, status: 'unauthenticated', tokenExpiration: null, cedula: null} );
  };

  const setUser = ( u ) => set( {user: u} );
  const setCedula = ( c ) => set( {cedula: c} );
  const getCedula = () => get().cedula || null;

  const checkSession = () => {
    if ( !isTokenValid() ) logout();
  };

  // Check session on store initialization
  checkSession();

  return {
    user,
    isAuthenticated,
    status,
    tokenExpiration,
    cedula,
    setCedula,
    getCedula,
    setUser,
    login,
    logout,
    checkSession,
  };
} );
