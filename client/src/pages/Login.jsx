import React, { useState } from 'react';
import {
    signInWithPopup,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider, db } from '../firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle Google Login
    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    firstName: user.displayName?.split(' ')[0] || '',
                    lastName: user.displayName?.split(' ')[1] || '',
                    email: user.email,
                    createdAt: new Date().toISOString(),
                    role: 'user',
                    authProvider: 'google'
                });
            }

            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            toast.error(err.message.replace('Firebase: ', ''));
        }
        setLoading(false);
    };

    // Handle Email/Password Login
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Login Successful!');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            toast.error("Invalid Email or Password");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/10 dark:bg-brand/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-purple/10 dark:bg-accent-purple/20 rounded-full blur-[100px]" />
            </div>

            <GlassCard className="w-full max-w-md p-8 shadow-2xl border-gray-200/50 dark:border-dark-border/50 backdrop-blur-xl bg-white/50 dark:bg-dark-card/50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-tr from-brand to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand/20">
                            <LogIn className="text-white w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">Welcome Back</h2>
                        <p className="text-gray-500 dark:text-dark-muted">Sign in to continue to your dashboard</p>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-6">
                        <Input
                            icon={Mail}
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <div className="space-y-1">
                            <Input
                                icon={Lock}
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-xs text-brand hover:text-brand-hover transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full justify-center py-6"
                            isLoading={loading}
                            rightIcon={ArrowRight}
                        >
                            Log In
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-dark-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-transparent text-gray-500 dark:text-dark-muted">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white dark:bg-white text-gray-900 font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Sign in with Google
                    </button>

                    <p className="mt-8 text-center text-dark-muted text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-brand hover:text-brand-hover font-semibold transition-colors">
                            Create Account
                        </Link>
                    </p>
                </motion.div>
            </GlassCard>
        </div>
    );
};

export default Login;
