import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddCompany from './pages/AddCompany';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Applications from './pages/Applications';
import TargetCompanies from './pages/TargetCompanies';
import Analytics from './pages/Analytics';
import Interviews from './pages/Interviews';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

// Protected Route Wrapper
const ProtectedRoute = () => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return <Layout />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <ThemeProvider>
                    <AppProvider>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />

                            {/* Protected Routes directly using Layout via ProtectedRoute wrapper */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/add" element={<AddCompany />} />
                                <Route path="/applications" element={<Applications />} />
                                <Route path="/targets" element={<TargetCompanies />} />
                                <Route path="/analytics" element={<Analytics />} />
                                <Route path="/interviews" element={<Interviews />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/settings" element={<Settings />} />
                            </Route>

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>

                        <ToastContainer
                            position="bottom-right"
                            autoClose={3000}
                            hideProgressBar={true}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="dark"
                            toastClassName="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-900 dark:text-dark-text rounded-lg shadow-xl"
                        />
                    </AppProvider>
                </ThemeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
