import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { User, Shield, Moon, Bell, Save, LogOut, Trash2 } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ToggleSwitch from '../components/ToggleSwitch';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
    const { currentUser, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);

    // Profile State
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: 'India'
    });

    // Preferences State
    const { theme, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [reminders, setReminders] = useState(true);

    // Fetch User Data
    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                try {
                    const docRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setProfile({
                            firstName: data.firstName || '',
                            lastName: data.lastName || '',
                            email: currentUser.email,
                            phone: data.phone || '',
                            country: data.country || 'India'
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    toast.error("Failed to load profile");
                }
            }
        };
        fetchUserData();

        fetchUserData();
    }, [currentUser]);

    // Handle Profile Update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const docRef = doc(db, 'users', currentUser.uid);
            await updateDoc(docRef, {
                firstName: profile.firstName,
                lastName: profile.lastName,
                phone: profile.phone,
                country: profile.country
            });
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.info("Logged out successfully");
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    const sections = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'security', label: 'Account & Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Moon },
        { id: 'preferences', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2 animate-fade-in">Settings</h1>
            <p className="text-gray-500 dark:text-dark-muted mb-8 animate-fade-in delay-75">Manage your account preferences and settings.</p>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2 animate-slide-up">
                    {sections.map(section => {
                        const Icon = section.icon;
                        const isActive = activeTab === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveTab(section.id)}
                                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-brand text-white shadow-lg shadow-brand/25'
                                    : 'text-gray-500 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-dark-hover hover:text-gray-900 dark:hover:text-dark-text'
                                    }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                <span className="font-medium">{section.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-grow min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <GlassCard className="p-6 lg:p-8">
                                {/* PROFILE SECTION */}
                                {activeTab === 'profile' && (
                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        <div className="border-b border-gray-200 dark:border-dark-border pb-4 mb-6">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Profile Information</h2>
                                            <p className="text-sm text-gray-500 dark:text-dark-muted">Update your personal details here.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="First Name"
                                                value={profile.firstName}
                                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                            />
                                            <Input
                                                label="Last Name"
                                                value={profile.lastName}
                                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                            />
                                            <Input
                                                label="Email Address"
                                                value={profile.email}
                                                disabled
                                                className="opacity-60 cursor-not-allowed"
                                            />
                                            <Input
                                                label="Phone Number"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                type="tel"
                                            />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-dark-muted mb-2">Country</label>
                                                <select
                                                    value={profile.country}
                                                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                                                    className="w-full bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg px-4 py-2.5 text-gray-900 dark:text-dark-text focus:outline-none focus:border-brand transition-colors"
                                                >
                                                    <option value="India">India</option>
                                                    <option value="USA">USA</option>
                                                    <option value="UK">UK</option>
                                                    <option value="Canada">Canada</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <Button type="submit" isLoading={loading} icon={Save}>
                                                Save Changes
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                {/* SECURITY SECTION */}
                                {activeTab === 'security' && (
                                    <div className="space-y-8">
                                        <div className="border-b border-gray-200 dark:border-dark-border pb-4">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Account Security</h2>
                                            <p className="text-sm text-gray-500 dark:text-dark-muted">Manage your account access and security.</p>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-hover rounded-xl border border-gray-200 dark:border-dark-border">
                                            <div className="space-y-1">
                                                <h3 className="text-base font-semibold text-gray-900 dark:text-dark-text">Change Password</h3>
                                                <p className="text-sm text-gray-500 dark:text-dark-muted">We'll send you an email to reset your password.</p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Send Reset Link
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-hover rounded-xl border border-gray-200 dark:border-dark-border">
                                            <div className="space-y-1">
                                                <h3 className="text-base font-semibold text-gray-900 dark:text-dark-text">Log out of all devices</h3>
                                                <p className="text-sm text-gray-500 dark:text-dark-muted">End all active sessions immediately.</p>
                                            </div>
                                            <Button onClick={handleLogout} variant="outline" size="sm" className="text-accent-rose hover:text-accent-rose border-gray-200 dark:border-dark-border hover:border-accent-rose">
                                                <LogOut className="w-4 h-4 mr-2" /> Log Out
                                            </Button>
                                        </div>

                                        <div className="p-4 bg-accent-rose/5 rounded-xl border border-accent-rose/20 mt-8">
                                            <h3 className="text-base font-semibold text-accent-rose mb-2">Danger Zone</h3>
                                            <p className="text-sm text-gray-500 dark:text-dark-muted mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                                            <Button variant="danger" size="sm" icon={Trash2}>
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* APPEARANCE SECTION */}
                                {activeTab === 'appearance' && (
                                    <div className="space-y-6">
                                        <div className="border-b border-gray-200 dark:border-dark-border pb-4">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Appearance</h2>
                                            <p className="text-sm text-gray-500 dark:text-dark-muted">Customize the look and feel.</p>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-hover rounded-xl border border-gray-200 dark:border-dark-border">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-dark-border">
                                                    <Moon className="w-6 h-6 text-brand" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-semibold text-gray-900 dark:text-dark-text">Dark Mode</h3>
                                                    <p className="text-sm text-gray-500 dark:text-dark-muted">Switch between light and dark themes.</p>
                                                </div>
                                            </div>
                                            <ToggleSwitch label="" checked={theme === 'dark'} onChange={toggleTheme} />
                                        </div>
                                    </div>
                                )}

                                {/* PREFERENCES SECTION */}
                                {activeTab === 'preferences' && (
                                    <div className="space-y-6">
                                        <div className="border-b border-gray-200 dark:border-dark-border pb-4">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Notifications</h2>
                                            <p className="text-sm text-gray-500 dark:text-dark-muted">Choose what updates you want to receive.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-hover rounded-xl border border-gray-200 dark:border-dark-border">
                                                <div>
                                                    <h3 className="text-base font-semibold text-gray-900 dark:text-dark-text">Email Notifications</h3>
                                                    <p className="text-sm text-gray-500 dark:text-dark-muted">Receive emails about application updates.</p>
                                                </div>
                                                <ToggleSwitch label="" checked={notifications} onChange={setNotifications} />
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-hover rounded-xl border border-gray-200 dark:border-dark-border">
                                                <div>
                                                    <h3 className="text-base font-semibold text-gray-900 dark:text-dark-text">Application Reminders</h3>
                                                    <p className="text-sm text-gray-500 dark:text-dark-muted">Get reminded about upcoming deadlines.</p>
                                                </div>
                                                <ToggleSwitch label="" checked={reminders} onChange={setReminders} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </GlassCard>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Settings;
