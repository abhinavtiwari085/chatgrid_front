import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const [auth, setAuth] = useState({
        user: null,
        token: null,
        isLoading: true
    });

    function isTokenExpired(jwt) {
        try {
            const [, payload] = jwt.split('.');
            const decoded = JSON.parse(atob(payload));
            if (!decoded.exp) return false;
            const nowSec = Math.floor(Date.now() / 1000);
            return decoded.exp <= nowSec;
        } catch {
            return true;
        }
    }

    function applyAuthFromStorage() {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (userStr && token && !isTokenExpired(token)) {
            setAuth({ user: JSON.parse(userStr), token, isLoading: false });
        } else {
            // purge invalid/expired
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setAuth({ user: null, token: null, isLoading: false });
        }
    }

    useEffect(() => {
        applyAuthFromStorage();
        const onStorage = (e) => {
            if (e.key === 'token' || e.key === 'user') applyAuthFromStorage();
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    } , []);

    async function logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setAuth({
            user: null,
            token: null,
            isLoading: false
        });
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
