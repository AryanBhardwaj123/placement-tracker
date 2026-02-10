import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Phone, Globe, Lock, ArrowRight } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { toast } from 'react-toastify';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        country: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            toast.error("Phone number must be 10 digits");
            return false;
        }
        return true;
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const user = userCredential.user;

            // 2. Save detailed profile to Firestore with timeout safety
            const saveProfilePromise = setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                country: formData.country,
                email: formData.email,
                createdAt: new Date().toISOString(),
                role: 'user',
                preferences: { targetRole: 'Software Engineer', targetSalary: '', locations: [] },
                skills: [],
                links: { linkedin: '', github: '', portfolio: '' }
            });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Firestore operation timed out.")), 10000)
            );

            await Promise.race([saveProfilePromise, timeoutPromise]);

            toast.success('Account Created Successfully!');
            navigate('/dashboard');

        } catch (err) {
            console.error("Signup Failed:", err);
            let msg = err.message;
            if (msg.includes('auth/email-already-in-use')) msg = "Email is already registered.";
            toast.error(msg.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/10 dark:bg-brand/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-emerald/10 dark:bg-accent-emerald/10 rounded-full blur-[100px]" />
            </div>

            <GlassCard className="w-full max-w-2xl p-8 shadow-2xl border-gray-200/50 dark:border-dark-border/50 backdrop-blur-xl bg-white/50 dark:bg-dark-card/50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-tr from-accent-emerald to-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                            <UserPlus className="text-white w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">Create Account</h2>
                        <p className="text-gray-500 dark:text-dark-muted">Join us to track your career journey</p>
                    </div>

                    <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            icon={User}
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            icon={User}
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                        <div className="md:col-span-2">
                            <Input
                                icon={Mail}
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Input
                            icon={Phone}
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-muted">
                                <Globe size={18} />
                            </div>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-dark-text focus:outline-none focus:border-brand transition-colors appearance-none"
                                required
                            >
                                <option value="">Select Country</option>
                                <option value="India">India</option>
                                <option value="USA">USA</option>
                                <option value="UK">UK</option>
                                <option value="Canada">Canada</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <Input
                            icon={Lock}
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            icon={Lock}
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        <div className="md:col-span-2 mt-4">
                            <Button
                                type="submit"
                                variant="success"
                                className="w-full justify-center py-4 text-base"
                                isLoading={loading}
                                rightIcon={ArrowRight}
                            >
                                Create Account
                            </Button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-dark-muted text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-accent-emerald hover:text-emerald-400 font-semibold transition-colors">
                            Log In here
                        </Link>
                    </p>
                </motion.div>
            </GlassCard>
        </div>
    );
};

export default Signup;
