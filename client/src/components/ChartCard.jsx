import React from 'react';
import GlassCard from './ui/GlassCard';

const ChartCard = ({ title, children, subtitle }) => {
    return (
        <GlassCard className="flex flex-col h-full fade-in">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
            </div>
            <div className="flex-grow w-full h-[300px] min-h-[300px]">
                {children}
            </div>
        </GlassCard>
    );
};

export default ChartCard;
