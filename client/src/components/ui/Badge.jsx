import React from 'react';

const Badge = ({ children, variant = "default", className = "" }) => {

    const variants = {
        default: "bg-dark-hover text-dark-text border-dark-border",
        success: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20",
        warning: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
        danger: "bg-accent-rose/10 text-accent-rose border-accent-rose/20",
        info: "bg-brand/10 text-brand border-brand/20",
        purple: "bg-accent-purple/10 text-accent-purple border-accent-purple/20"
    };

    return (
        <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
            ${variants[variant]}
            ${className}
        `}>
            {children}
        </span>
    );
};

export default Badge;
