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

    useEffect(() => {
        let refreshTokenInterval;

        const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (refreshTokenInterval) {
                clearInterval(refreshTokenInterval);
            }

            if (currentUser) {
                try {
                    const idToken = await currentUser.getIdToken(true);
                    localStorage.setItem('access-token', idToken);
                    refreshTokenInterval = setInterval(async () => {
                        if (auth.currentUser) {
                            try {
                                const newToken = await auth.currentUser.getIdToken(true);
                                localStorage.setItem('access-token', newToken);
                                console.log("Token refreshed automatically");
                            } catch (error) {
                                console.error("Auto token refresh failed:", error);
                            }
                        }
                    }, 55 * 60 * 1000);

                } catch (error) {
                    console.error("Error getting Firebase ID token:", error);
                    localStorage.removeItem('access-token');
                }
            } else {
                localStorage.removeItem('access-token');
            }
            setLoading(false);
        });
        return () => {
            unsubscribe();
            if (refreshTokenInterval) {
                clearInterval(refreshTokenInterval);
            }
        };
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
