// src/provider/AuthProvider.jsx
import React, { useEffect, useState } from 'react';
import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    onIdTokenChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    updateProfile 
} from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { AuthContext } from '../context/AuthContext'; 

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const updateUser = (data) => {
        return updateProfile(auth.currentUser, data);
    };

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        setLoading(true);
        return signOut(auth).then(() => setUser(null));
    };

    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    // Observe Auth State & Token
useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
            try {
                const idToken = await currentUser.getIdToken();
                localStorage.setItem('access-token', idToken);
                console.log("Firebase ID Token available");
            } catch (error) {
                console.error("Error getting Firebase ID token:", error);
                localStorage.removeItem('access-token');
            }
        } else {
            localStorage.removeItem('access-token');
        }
        setLoading(false);
    });

    return () => unsubscribe();
}, []);

    
    const authInfo = {
        user,
        createUser,
        updateUser,
        signIn,
        loading,
        logOut,
        setUser,
        signInWithGoogle
    };
    
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
