import { create } from "zustand";

const TOKEN_KEY = "token";
const TOKEN_EXPIRATION_KEY = "tokenExpiration";
const USER_KEY = "LoggedUser";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getTokenExpiration() {
  const expiration = localStorage.getItem(TOKEN_EXPIRATION_KEY);
  return expiration ? parseInt(expiration, 10) : null;
}

function getUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

function isTokenValid() {
  const token = getToken();
  const expiration = getTokenExpiration();
  if (!token || !expiration) return false;
  return new Date().getTime() < expiration;
}

function saveSession(token, expiration, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRATION_KEY, expiration.toString());
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRATION_KEY);
  localStorage.removeItem(USER_KEY);
}

export const useAuthStore = create((set) => {
  const tokenExpiration = getTokenExpiration();
  const user = isTokenValid() ? getUser() : null;
  const isAuthenticated = isTokenValid();
  const status = isAuthenticated ? 'authenticated' : 'unauthenticated';

  const login = (user, token, expiration) => {
    saveSession(token, expiration, user);
    set({ user, isAuthenticated: true, status: 'authenticated', tokenExpiration: expiration });
  };

  const logout = () => {
    // console.log("VALIDANDO SESION ANTES DE LOGOUT");
    clearSession();
    set({ user: null, isAuthenticated: false, status: 'unauthenticated', tokenExpiration: null });
  };

  const checkSession = () => {
    if (!isTokenValid()) {
      // console.log("VALIDANDO SESION");
      logout();
    }
  };

  // Check session on store initialization
  checkSession();

  return {
    user,
    isAuthenticated,
    status,
    tokenExpiration,
    login,
    logout,
    checkSession,
  };
});
