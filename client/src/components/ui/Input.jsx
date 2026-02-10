import React from 'react';

const Input = ({ label, error, icon: Icon, className = "", ...props }) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700 dark:text-dark-muted">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-muted">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`
                        w-full bg-white dark:bg-dark-hover border border-gray-300 dark:border-dark-border rounded-lg px-4 py-2.5 
                        text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-muted 
                        focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand 
                        transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${Icon ? 'pl-10' : ''}
                        ${error ? 'border-accent-rose focus:ring-accent-rose/50 focus:border-accent-rose' : ''}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-xs text-accent-rose">{error}</span>
            )}
        </div>
    );
};

export default Input;
