import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Briefcase,
    Target,
    BarChart2,
    Calendar,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, active, collapsed }) => {
    return (
        <Link to={to} className="relative group">
            <div className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${active
                    ? 'bg-brand/10 text-brand'
                    : 'text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-hover'
                }
            `}>
                <Icon size={20} className={active ? "text-brand" : ""} />

                {!collapsed && (
                    <span className="font-medium whitespace-nowrap">{label}</span>
                )}

                {active && !collapsed && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 w-1 h-6 bg-brand rounded-r-full"
                    />
                )}
            </div>
        </Link>
    );
};

const Layout = () => {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Desktop sidebar is always visible on large screens
    // We can add improved collapse state later if needed

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Applications', href: '/applications', icon: Briefcase },
        { name: 'Target Companies', href: '/targets', icon: Target },
        { name: 'Analytics', href: '/analytics', icon: BarChart2 },
        { name: 'Interviews', href: '/interviews', icon: Calendar },
        { name: 'Profile', href: '/profile', icon: User },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-dark-text font-sans selection:bg-brand selection:text-white transition-colors duration-300">

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg sticky top-0 h-screen transition-colors duration-300">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                            <Target className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Placement<span className="text-brand">Tracker</span></span>
                    </div>
                </div>

                <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                    <div className="text-xs font-semibold text-gray-500 dark:text-dark-muted uppercase tracking-wider px-3 mb-2 mt-2">
                        Platform
                    </div>
                    {navigation.slice(0, 5).map((item) => (
                        <SidebarItem
                            key={item.name}
                            icon={item.icon}
                            label={item.name}
                            to={item.href}
                            active={location.pathname === item.href}
                        />
                    ))}

                    <div className="text-xs font-semibold text-gray-500 dark:text-dark-muted uppercase tracking-wider px-3 mb-2 mt-6">
                        Account
                    </div>
                    {navigation.slice(5).map((item) => (
                        <SidebarItem
                            key={item.name}
                            icon={item.icon}
                            label={item.name}
                            to={item.href}
                            active={location.pathname === item.href}
                        />
                    ))}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-dark-border">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-accent-rose hover:bg-accent-rose/10 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>

                    <div className="mt-4 flex items-center gap-3 px-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-hover flex items-center justify-center border border-gray-200 dark:border-dark-border text-gray-500 dark:text-dark-muted">
                            {currentUser?.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate text-gray-900 dark:text-white">{currentUser?.email}</span>
                            <span className="text-xs text-gray-500 dark:text-dark-muted">Pro Plan</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border px-4 h-16 flex items-center justify-between transition-colors duration-300">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                        <Target className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">Tracker</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg"
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-16 z-40 bg-white dark:bg-dark-bg p-4 md:hidden overflow-y-auto"
                    >
                        <div className="space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg ${location.pathname === item.href
                                        ? 'bg-brand/10 text-brand'
                                        : 'text-gray-500 dark:text-dark-muted'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-accent-rose hover:bg-accent-rose/10 mt-4"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 md:pt-0 bg-gray-50 dark:bg-black transition-colors duration-300">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
                    <div className="max-w-6xl mx-auto w-full animate-fade-in">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
