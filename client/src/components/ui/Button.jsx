import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = "primary", className = "", icon: Icon, isLoading, ...props }) => {

    const variants = {
        primary: "bg-brand hover:bg-brand-hover text-white shadow-lg shadow-brand/20",
        secondary: "bg-gray-200 dark:bg-dark-hover hover:bg-gray-300 dark:hover:bg-dark-border text-gray-900 dark:text-white border border-gray-300 dark:border-dark-border",
        ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white",
        danger: "bg-accent-rose/10 text-accent-rose hover:bg-accent-rose/20 border border-accent-rose/20",
        outline: "bg-transparent border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text hover:border-brand hover:text-brand"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={`
                flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]}
                ${className}
            `}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    {Icon && <Icon size={18} />}
                    {children}
                </>
            )}
        </motion.button>
    );
};

export default Button;
