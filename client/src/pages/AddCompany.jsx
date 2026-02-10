import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Loader2, Briefcase, Calendar, FileText } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const AddCompany = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        deadline: '',
        status: 'Applied',
        notes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/companies', formData);
            toast.success('Company added successfully!');
            navigate('/target-companies');
        } catch (error) {
            toast.error('Failed to add company');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-2xl mx-auto pt-8 pb-24 px-4 fade-in">
            <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Add New Application
                </h1>
                <p className="text-gray-500 dark:text-gray-400">Track a new job opportunity</p>
            </div>

            <GlassCard className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        icon={Briefcase}
                        label="Company Name"
                        name="name"
                        placeholder="e.g. Google, Amazon, Startup Inc."
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            icon={Calendar}
                            label="Application Deadline"
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Current Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand/50 outline-none transition-all"
                            >
                                <option value="Applied">Applied</option>
                                <option value="Interview">Interview</option>
                                <option value="Selected">Selected</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            rows="4"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Key requirements, interview rounds, or contacts..."
                            className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand/50 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600 resize-none"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="flex-1"
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            isLoading={loading}
                            icon={Save}
                        >
                            Save Application
                        </Button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default AddCompany;
