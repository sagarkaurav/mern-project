import {createContext}  from 'react';

 const AuthContext  = createContext({
    isLoggedIn: false,
    token: null,
    userId: null,
    UserName: null,
    login: () => {},
    logout: () => {}
});

export default AuthContext