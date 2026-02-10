import React, { useState } from 'react';
import {
    Building,
    Search,
    Plus,
    Star,
    ExternalLink,
    Trash2,
    Edit,
    Briefcase,
    Trophy,
    Target,
    Filter,
    X,
    MoreHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

const TargetCompanies = () => {
    const { applications, addApplication, updateApplication, deleteApplication } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterIndustry, setFilterIndustry] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');

    // Form State
    const initialFormState = {
        name: '',
        industry: 'Tech',
        priority: 'Medium',
        dream: false,
        status: 'Not Applied',
        link: '',
        notes: ''
    };
    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);

    // Derived Stats
    const total = applications.length;
    const applied = applications.filter(c => c.status === 'Applied').length;
    const interviewing = applications.filter(c => c.status === 'Interview').length;
    const selected = applications.filter(c => ['Selected', 'Offer'].includes(c.status)).length;

    // Filter Logic
    const filteredCompanies = applications.filter(company => {
        const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesIndustry = filterIndustry === 'All' || company.industry === filterIndustry;
        const matchesPriority = filterPriority === 'All' || company.priority === filterPriority;
        return matchesSearch && matchesIndustry && matchesPriority;
    });

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setShowModal(true);
    };

    const openEditModal = (company) => {
        setEditingId(company.id);
        setFormData({
            name: company.name || '',
            industry: company.industry || 'Tech',
            priority: company.priority || 'Medium',
            dream: company.dream || false,
            status: company.status || 'Not Applied',
            link: company.link || '',
            notes: company.notes || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateApplication(editingId, formData);
            } else {
                await addApplication(formData);
            }
            setShowModal(false);
        } catch (error) {
            console.error("Error saving company:", error);
        }
    };

    const toggleDream = (id, currentVal) => {
        updateApplication(id, { dream: !currentVal });
    };

    const handleDelete = (id) => {
        if (window.confirm("Remove this company from your target list?")) {
            deleteApplication(id);
        }
    };

    return (
        <div className="space-y-6 pb-20">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">Target Companies</h1>
                    <p className="text-gray-500 dark:text-dark-muted mt-1">Your wishlist of dream jobs and future opportunities.</p>
                </div>
                <Button onClick={openAddModal} icon={Plus} variant="primary">Add Target</Button>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard label="Total Targets" value={total} icon={Target} color="purple" />
                <StatsCard label="Applied" value={applied} icon={Briefcase} color="blue" />
                <StatsCard label="Interviewing" value={interviewing} icon={Building} color="amber" />
                <StatsCard label="Selected" value={selected} icon={Trophy} color="emerald" />
            </div>

            {/* FILTERS & SEARCH */}
            <GlassCard className="flex flex-col md:flex-row gap-4 items-center justify-between p-4">
                <div className="w-full md:w-96">
                    <Input
                        icon={Search}
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-3 py-2.5">
                        <Filter size={16} className="text-gray-500 dark:text-dark-muted" />
                        <select
                            value={filterIndustry}
                            onChange={(e) => setFilterIndustry(e.target.value)}
                            className="bg-transparent text-gray-900 dark:text-dark-text outline-none cursor-pointer text-sm"
                        >
                            <option value="All">All Industries</option>
                            <option value="Tech">Tech</option>
                            <option value="Fintech">Fintech</option>
                            <option value="Consulting">Consulting</option>
                            <option value="Startups">Startups</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-3 py-2.5">
                        <Star size={16} className="text-gray-500 dark:text-dark-muted" />
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="bg-transparent text-gray-900 dark:text-dark-text outline-none cursor-pointer text-sm"
                        >
                            <option value="All">All Priorities</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                </div>
            </GlassCard>

            {/* COMPANIES GRID */}
            {filteredCompanies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map(company => (
                        <GlassCard key={company.id} className="flex flex-col h-full group !p-5 cursor-default hover:border-brand/40 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-dark-hover border border-gray-200 dark:border-dark-border flex items-center justify-center text-xl font-bold text-gray-900 dark:text-dark-text group-hover:scale-110 transition-transform duration-300">
                                        {company.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text leading-tight group-hover:text-brand transition-colors">{company.name}</h3>
                                        <p className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">{company.industry}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleDream(company.id, company.dream)}
                                    className={`p-2 rounded-full transition-all ${company.dream ? 'text-accent-amber bg-accent-amber/10 scale-110' : 'text-gray-400 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-hover'}`}
                                >
                                    <Star size={18} className={company.dream ? 'fill-accent-amber' : ''} />
                                </button>
                            </div>

                            <div className="flex-grow space-y-4 mb-4">
                                <div className="flex flex-wrap gap-2">
                                    <PriorityBadge priority={company.priority} />
                                    <StatusBadge status={company.status} />
                                </div>
                                {company.notes && (
                                    <div className="bg-gray-50 dark:bg-dark-hover/50 border border-gray-200 dark:border-dark-border/50 p-3 rounded-lg text-sm text-gray-600 dark:text-dark-muted line-clamp-3 italic">
                                        "{company.notes}"
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-dark-border flex justify-between items-center mt-auto">
                                {company.link ? (
                                    <a
                                        href={company.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-gray-500 dark:text-dark-muted hover:text-brand flex items-center gap-1.5 transition-colors"
                                    >
                                        <ExternalLink size={14} /> Career Page
                                    </a>
                                ) : (
                                    <span className="text-sm text-gray-400 dark:text-dark-muted/50 cursor-not-allowed flex items-center gap-1.5">
                                        <ExternalLink size={14} /> No Link
                                    </span>
                                )}

                                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditModal(company)} className="p-2 text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(company.id)} className="p-2 text-gray-500 dark:text-dark-muted hover:text-accent-rose hover:bg-accent-rose/10 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-dark-hover rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building size={40} className="text-gray-400 dark:text-dark-muted" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-2">No companies found</h3>
                    <p className="text-gray-500 dark:text-dark-muted max-w-sm mx-auto mb-6">Your target list is empty. Add companies you want to track or adjust your filters.</p>
                    <Button onClick={openAddModal} variant="outline">Add First Target</Button>
                </div>
            )}

            {/* MODAL */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-gray-200 dark:border-dark-border flex justify-between items-center shrink-0">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">{editingId ? 'Edit Target' : 'Add Target Company'}</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                                <Input
                                    label="Company Name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Netflix"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-muted">Industry</label>
                                        <div className="relative">
                                            <select
                                                name="industry"
                                                value={formData.industry}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-4 py-2.5 text-gray-900 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all appearance-none"
                                            >
                                                <option value="Tech">Tech</option>
                                                <option value="Fintech">Fintech</option>
                                                <option value="Consulting">Consulting</option>
                                                <option value="Startups">Startups</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-muted">Priority</label>
                                        <div className="relative">
                                            <select
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-4 py-2.5 text-gray-900 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all appearance-none"
                                            >
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-muted">Status</label>
                                        <div className="relative">
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-4 py-2.5 text-gray-900 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all appearance-none"
                                            >
                                                <option value="Not Applied">Not Applied</option>
                                                <option value="Applied">Applied</option>
                                                <option value="Interview">Interview</option>
                                                <option value="Offer">Offer</option>
                                                <option value="Selected">Selected</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <Input
                                    label="Career Page Link"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    placeholder="https://..."
                                />

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-dark-muted">Notes</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-4 py-2.5 text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all h-20 resize-none"
                                        placeholder="Why do you want to work here?"
                                    />
                                </div>

                                <label className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-hover/50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-dark-border transition-colors">
                                    <input
                                        type="checkbox"
                                        name="dream"
                                        checked={formData.dream}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 rounded text-brand bg-white dark:bg-dark-bg border-gray-300 dark:border-dark-border focus:ring-brand"
                                    />
                                    <span className="text-sm text-gray-900 dark:text-dark-text flex items-center gap-2">
                                        Mark as Dream Company <Star size={14} className="fill-accent-amber text-accent-amber" />
                                    </span>
                                </label>

                                <div className="pt-4 flex justify-end gap-3">
                                    <Button variant="ghost" onClick={() => setShowModal(false)} type="button">Cancel</Button>
                                    <Button type="submit">
                                        {editingId ? 'Save Changes' : 'Add to Wishlist'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- SUBCOMPONENTS ---

const StatsCard = ({ label, value, icon: Icon, color = 'brand' }) => {
    const colors = {
        brand: 'text-brand bg-brand/10',
        purple: 'text-accent-purple bg-accent-purple/10',
        blue: 'text-accent-cyan bg-accent-cyan/10',
        amber: 'text-accent-amber bg-accent-amber/10',
        emerald: 'text-accent-emerald bg-accent-emerald/10',
    };

    return (
        <GlassCard className="flex items-center gap-4 p-4">
            <div className={`p-3 rounded-xl ${colors[color]}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-gray-500 dark:text-dark-muted text-xs font-semibold uppercase tracking-wider">{label}</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text leading-tight">{value}</h3>
            </div>
        </GlassCard>
    );
};

const PriorityBadge = ({ priority }) => {
    let variant = 'default';
    if (priority === 'High') variant = 'danger';
    if (priority === 'Medium') variant = 'warning';
    if (priority === 'Low') variant = 'info';

    return (
        <Badge variant={variant} className="mr-1">
            {priority} Priority
        </Badge>
    );
};

const StatusBadge = ({ status }) => {
    let variant = 'default';
    if (status === 'Applied') variant = 'info';
    if (status === 'Interview') variant = 'warning';
    if (['Selected', 'Offer'].includes(status)) variant = 'success';
    if (status === 'Rejected') variant = 'danger';

    return <Badge variant={variant} outlined>{status}</Badge>;
};

export default TargetCompanies;
