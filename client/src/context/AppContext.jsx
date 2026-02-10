import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    serverTimestamp,
    orderBy
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const AppContext = createContext();

export function useApp() {
    return useContext(AppContext);
}

export function AppProvider({ children }) {
    const { currentUser } = useAuth();
    const [applications, setApplications] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Listen to Applications
    useEffect(() => {
        if (!currentUser) {
            setApplications([]);
            setInterviews([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        // Applications Query
        const appsRef = collection(db, 'users', currentUser.uid, 'applications');
        const qApps = query(appsRef, orderBy('createdAt', 'desc'));

        const unsubscribeApps = onSnapshot(qApps, (snapshot) => {
            const appsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setApplications(appsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching applications:", error);
            toast.error("Failed to load data");
            setLoading(false);
        });

        // Interviews Query
        const interviewsRef = collection(db, 'users', currentUser.uid, 'interviews');
        const qInterviews = query(interviewsRef, orderBy('date', 'asc'));

        const unsubscribeInterviews = onSnapshot(qInterviews, (snapshot) => {
            const interviewData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setInterviews(interviewData);
        }, (error) => {
            console.error("Error fetching interviews:", error);
        });

        return () => {
            unsubscribeApps();
            unsubscribeInterviews();
        };
    }, [currentUser]);

    // --- ACTIONS ---

    // Applications
    const addApplication = async (data) => {
        try {
            if (!currentUser) return;
            await addDoc(collection(db, 'users', currentUser.uid, 'applications'), {
                ...data,
                createdAt: serverTimestamp()
            });
            toast.success("Application added!");
        } catch (error) {
            console.error("Error adding application:", error);
            toast.error("Failed to add application");
            throw error;
        }
    };

    const updateApplication = async (id, data) => {
        try {
            if (!currentUser) return;
            const docRef = doc(db, 'users', currentUser.uid, 'applications', id);
            await updateDoc(docRef, data);
            toast.success("Application updated");
        } catch (error) {
            console.error("Error updating application:", error);
            toast.error("Failed to update");
        }
    };

    const deleteApplication = async (id) => {
        try {
            if (!currentUser) return;
            await deleteDoc(doc(db, 'users', currentUser.uid, 'applications', id));
            toast.info("Application deleted");
        } catch (error) {
            console.error("Error deleting application:", error);
            toast.error("Failed to delete");
        }
    };

    // Interviews
    const addInterview = async (data) => {
        try {
            if (!currentUser) return;
            await addDoc(collection(db, 'users', currentUser.uid, 'interviews'), {
                ...data,
                createdAt: serverTimestamp()
            });
            toast.success("Interview scheduled!");
        } catch (error) {
            console.error("Error adding interview:", error);
            toast.error("Failed to schedule interview");
        }
    };

    const updateInterview = async (id, data) => {
        try {
            if (!currentUser) return;
            const docRef = doc(db, 'users', currentUser.uid, 'interviews', id);
            await updateDoc(docRef, data);
            toast.success("Interview updated");
        } catch (error) {
            console.error("Error updating interview:", error);
            toast.error("Failed to update");
        }
    };

    const deleteInterview = async (id) => {
        try {
            if (!currentUser) return;
            await deleteDoc(doc(db, 'users', currentUser.uid, 'interviews', id));
            toast.info("Interview removed");
        } catch (error) {
            console.error("Error deleting interview:", error);
            toast.error("Failed to remove");
        }
    };


    const value = {
        applications,
        interviews,
        loading,
        addApplication,
        updateApplication,
        deleteApplication,
        addInterview,
        updateInterview,
        deleteInterview
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
