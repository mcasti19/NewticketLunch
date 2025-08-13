import {create} from 'zustand';

const getUserFromStorage = () => {
  const user = localStorage.getItem( 'LoggedUser' );
  return user ? JSON.parse( user ) : null;
};

const getTokenFromStorage = () => {
  return localStorage.getItem( 'token' );
};

const getTokenExpirationFromStorage = () => {
  const expiration = localStorage.getItem( 'tokenExpiration' );
  return expiration ? Number( expiration ) : null;
};

const isTokenValid = ( expiration ) => {
  if ( !expiration ) return false;
  return Date.now() < expiration;
};

const useAuthStore = create( ( set, get ) => {
  // Initialize state from localStorage
  const tokenExpiration = getTokenExpirationFromStorage();
  const token = getTokenFromStorage();
  const user = getUserFromStorage();

  const isValid = isTokenValid( tokenExpiration );

  // Setup periodic checkSession every 60 seconds
  let intervalId = null;

  const startSessionCheck = () => {
    if ( intervalId === null ) {
      intervalId = setInterval( () => {
        get().checkSession();
      }, 60000 );
    }
  };

  const clearSessionCheck = () => {
    if ( intervalId !== null ) {
      clearInterval( intervalId );
      intervalId = null;
    }
  };

  if ( isValid ) {
    startSessionCheck();
  }

  const login = ( userData, token, expiration ) => {
    localStorage.setItem( 'LoggedUser', JSON.stringify( userData ) );
    localStorage.setItem( 'token', token );
    localStorage.setItem( 'tokenExpiration', expiration.toString() );
    set( () => ( {
      user: userData,
      token: token,
      tokenExpiration: expiration,
      status: 'authenticated',
      errorMessage: null,
    } ) );
    startSessionCheck();
  }


  const logout = () => {
    localStorage.clear();
    clearSessionCheck();
    set( () => ( {
      user: null,
      token: null,
      tokenExpiration: null,
      status: 'not-authenticated',
      errorMessage: null,
    } ) );
  }


  return {
    user: isValid ? user : null,
    token: isValid ? token : null,
    tokenExpiration: isValid ? tokenExpiration : null,
    errorMessage: null,
    status: isValid ? 'authenticated' : 'not-authenticated',
    login,
    logout,

    setError: ( message ) =>
      set( () => ( {
        errorMessage: message,
      } ) ),

    clearError: () =>
      set( () => ( {
        errorMessage: null,
      } ) ),

    checkSession: () => {
      const {tokenExpiration, logout} = get();
      const expiration = tokenExpiration || getTokenExpirationFromStorage();
      if ( !expiration ) {
        // Do not logout if no expiration found, just return
        return;
      }
      if ( !isTokenValid( expiration ) ) {
        logout();
      }
    },
  };
} );

export default useAuthStore;