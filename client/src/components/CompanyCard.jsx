import React from 'react';
import { Calendar, Trash2, Building, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from './ui/GlassCard';

const CompanyCard = ({ company, onDelete }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Selected': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
            case 'Rejected': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
            case 'Interview': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
            default: return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
        }
    };

    return (
        <GlassCard
            as={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            className="p-6 hover:shadow-xl transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-dark-hover rounded-lg">
                        <Building className="text-brand w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{company.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${getStatusColor(company.status)}`}>
                            {company.status}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => onDelete(company._id)}
                    className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={16} className="text-accent-purple" />
                    <span>Deadline: <span className="text-gray-700 dark:text-gray-300 font-medium">{company.deadline ? new Date(company.deadline).toLocaleDateString() : 'N/A'}</span></span>
                </div>

                {company.notes && (
                    <div className="bg-gray-50 dark:bg-dark-hover p-3 rounded-md text-sm text-gray-600 dark:text-gray-400 flex gap-2 border border-gray-100 dark:border-dark-border">
                        <FileText size={16} className="shrink-0 mt-0.5" />
                        <p className="line-clamp-2">{company.notes}</p>
                    </div>
                )}
            </div>
        </GlassCard>
    );
};

export default CompanyCard;
