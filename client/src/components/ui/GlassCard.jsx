import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", hoverEffect = false, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`
                bg-white/80 dark:bg-dark-card/60 backdrop-blur-xl border border-gray-200 dark:border-dark-border 
                rounded-xl shadow-lg dark:shadow-2xl p-6 transition-colors duration-300
                ${hoverEffect ? 'hover:border-brand/50 hover:shadow-brand/10 transition-all duration-300' : ''}
                ${className}
            `}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
