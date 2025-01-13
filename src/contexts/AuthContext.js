import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseService';
const AuthContext = createContext({
    currentUser: null,
    signup: async () => { },
    login: async () => { },
    logout: async () => { }
});
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const signup = async (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            setCurrentUser(userCredential.user);
        });
    };
    const login = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            setCurrentUser(userCredential.user);
        });
    };
    const logout = async () => {
        return signOut(auth).then(() => {
            setCurrentUser(null);
        });
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);
    const value = {
        currentUser,
        signup,
        login,
        logout
    };
    return (_jsx(AuthContext.Provider, { value: value, children: !loading && children }));
};
