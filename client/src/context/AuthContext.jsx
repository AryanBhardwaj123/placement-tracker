import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebaseConfig';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [userProfile, setUserProfile] = useState(null); // Store Firestore profile
    const [loading, setLoading] = useState(true);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    function googleSignIn() {
        return signInWithPopup(auth, googleProvider);
    }

    // Helper to update profile
    async function updateProfile(data) {
        if (!currentUser) return;
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, data);
    }

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Fetch/Listen to User Profile
                const userRef = doc(db, 'users', user.uid);

                const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data());
                    } else {
                        // Create default profile if it doesn't exist (e.g. Google Auth first time)
                        const defaultProfile = {
                            email: user.email,
                            firstName: user.displayName?.split(' ')[0] || 'User',
                            lastName: user.displayName?.split(' ')[1] || '',
                            role: 'Job Seeker',
                            bio: 'Ready to land my dream job!',
                            createdAt: new Date(),
                            preferences: {
                                targetRole: 'Software Engineer',
                                targetSalary: '10-20 LPA',
                                locations: ['Remote']
                            },
                            skills: ['React', 'JavaScript'],
                            links: {
                                linkedin: '',
                                github: '',
                                portfolio: ''
                            }
                        };
                        setDoc(userRef, defaultProfile, { merge: true });
                        setUserProfile(defaultProfile);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching profile:", error);
                    setLoading(false);
                });

                return () => {
                    unsubscribeProfile();
                }

            } else {
                setUserProfile(null);
                setLoading(false);
            }
        });

        return unsubscribeAuth;
    }, []);

    const value = {
        currentUser,
        userProfile,
        login,
        signup,
        logout,
        googleSignIn,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
