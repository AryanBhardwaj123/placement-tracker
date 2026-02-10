import React, { useState, useMemo } from 'react';
import {
    Briefcase,
    Search,
    Plus,
    Filter,
    ExternalLink,
    Trash2,
    Edit,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    X,
    MoreHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

const Applications = () => {
    const { applications, addApplication, updateApplication, deleteApplication, loading } = useApp();

    // Local State
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');

    // Form State
    const initialFormState = {
        name: '',
        role: '',
        status: 'Applied',
        deadline: '',
        link: '',
        notes: '',
        industry: 'Tech',
        priority: 'Medium'
    };
    const [formData, setFormData] = useState(initialFormState);

    // --- STATS ---
    const stats = useMemo(() => {
        const total = applications.length;
        const interviewing = applications.filter(a => a.status === 'Interview').length;
        const offers = applications.filter(a => ['Selected', 'Offer'].includes(a.status)).length;
        const rejected = applications.filter(a => a.status === 'Rejected').length;
        return { total, interviewing, offers, rejected };
    }, [applications]);

    // --- FILTER & SORT ---
    const filteredApps = useMemo(() => {
        let result = applications.filter(app => {
            const matchesSearch = app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.role?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
            return matchesSearch && matchesStatus;
        });

        return result.sort((a, b) => {
            if (sortBy === 'Newest') return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
            if (sortBy === 'Oldest') return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
            if (sortBy === 'Deadline') {
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return new Date(a.deadline) - new Date(b.deadline);
            }
            return 0;
        });
    }, [applications, searchTerm, filterStatus, sortBy]);

    // --- HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setShowModal(true);
    };

    const openEditModal = (app) => {
        setEditingId(app.id);
        setFormData({
            name: app.name || '',
            role: app.role || '',
            status: app.status || 'Applied',
            deadline: app.deadline || '',
            link: app.link || '',
            notes: app.notes || '',
            industry: app.industry || 'Tech',
            priority: app.priority || 'Medium'
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
            console.error("Error saving application:", error);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this application record?")) {
            deleteApplication(id);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 pb-20">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">Applications</h1>
                    <p className="text-gray-500 dark:text-dark-muted mt-1">Manage and track your job applications.</p>
                </div>
                <Button onClick={openAddModal} icon={Plus}>Add Application</Button>
            </div>

            {/* STATS ROW */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard label="Total" value={stats.total} icon={Briefcase} />
                <StatsCard label="Interviewing" value={stats.interviewing} icon={Clock} color="amber" />
                <StatsCard label="Offers" value={stats.offers} icon={CheckCircle} color="emerald" />
                <StatsCard label="Rejected" value={stats.rejected} icon={XCircle} color="rose" />
            </div>

            {/* TOOLBAR */}
            <GlassCard className="flex flex-col md:flex-row gap-4 items-center justify-between p-4">
                <div className="w-full md:w-96">
                    <Input
                        icon={Search}
                        placeholder="Search by company or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-3 py-2.5">
                        <Filter size={16} className="text-gray-500 dark:text-dark-muted" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-transparent text-gray-900 dark:text-dark-text outline-none cursor-pointer text-sm"
                        >
                            <option value="All">All Status</option>
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-3 py-2.5">
                        <Calendar size={16} className="text-gray-500 dark:text-dark-muted" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-gray-900 dark:text-dark-text outline-none cursor-pointer text-sm"
                        >
                            <option value="Newest">Newest</option>
                            <option value="Oldest">Oldest</option>
                            <option value="Deadline">Deadline</option>
                        </select>
                    </div>
                </div>
            </GlassCard>

            {/* DATA GRID */}
            <GlassCard className="!p-0 overflow-hidden min-h-[400px]">
                {filteredApps.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100/50 dark:bg-dark-hover/50 text-gray-500 dark:text-dark-muted uppercase text-xs tracking-wider border-b border-gray-200 dark:border-dark-border">
                                <tr>
                                    <th className="p-4 font-medium pl-6">Company</th>
                                    <th className="p-4 font-medium">Role</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Notes</th>
                                    <th className="p-4 font-medium text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-dark-border/50">
                                {filteredApps.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-dark-hover/50 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-dark-hover border border-gray-200 dark:border-dark-border flex items-center justify-center text-sm font-bold text-gray-900 dark:text-dark-text group-hover:border-brand/30 transition-colors">
                                                    {app.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-900 dark:text-dark-text">{app.name}</span>
                                                    {app.link && (
                                                        <a href={app.link} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex text-gray-400 dark:text-dark-muted hover:text-brand transition-colors">
                                                            <ExternalLink size={12} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-900 dark:text-dark-text text-sm">{app.role}</td>
                                        <td className="p-4">
                                            <StatusBadge status={app.status} />
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 dark:text-dark-text">
                                                    {app.createdAt ? new Date(app.createdAt.seconds * 1000).toLocaleDateString() : '-'}
                                                </span>
                                                {app.deadline && (
                                                    <span className={`text-xs ${new Date(app.deadline) < new Date() ? 'text-accent-rose' : 'text-gray-500 dark:text-dark-muted'}`}>
                                                        Due {new Date(app.deadline).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500 dark:text-dark-muted max-w-[200px] truncate">
                                            {app.notes || '-'}
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEditModal(app)} className="p-2 text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(app.id)} className="p-2 text-gray-500 dark:text-dark-muted hover:text-accent-rose hover:bg-accent-rose/10 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-dark-hover rounded-full flex items-center justify-center mb-4">
                            <Briefcase size={32} className="text-gray-400 dark:text-dark-muted" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-1">No applications found</h3>
                        <p className="text-gray-500 dark:text-dark-muted text-sm max-w-xs mx-auto">
                            {searchTerm || filterStatus !== 'All'
                                ? "Try adjusting your filters or search terms."
                                : "Start by adding your first job application!"}
                        </p>
                    </div>
                )}
            </GlassCard>

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
                                <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">{editingId ? 'Edit Application' : 'New Application'}</h2>
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
                                    placeholder="e.g. Acme Corp"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Role"
                                        name="role"
                                        required
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Software Engineer"
                                    />
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-muted">Status</label>
                                        <div className="relative">
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-4 py-2.5 text-gray-900 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all appearance-none"
                                            >
                                                <option value="Applied">Applied</option>
                                                <option value="Interview">Interview</option>
                                                <option value="Offer">Offer</option>
                                                <option value="Selected">Selected</option>
                                                <option value="Rejected">Rejected</option>
                                                <option value="Withdrawn">Withdrawn</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-dark-muted pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                </div>

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
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-dark-muted pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                    <Input
                                        label="Deadline"
                                        type="date"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <Input
                                    label="Job Link"
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
                                        className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg px-4 py-2.5 text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all h-24 resize-none"
                                        placeholder="Referral details, portal login, etc."
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-3 shrink-0">
                                    <Button variant="ghost" onClick={() => setShowModal(false)} type="button">Cancel</Button>
                                    <Button type="submit">
                                        {editingId ? 'Save Changes' : 'Add Application'}
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
        amber: 'text-accent-amber bg-accent-amber/10',
        emerald: 'text-accent-emerald bg-accent-emerald/10',
        rose: 'text-accent-rose bg-accent-rose/10',
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

const ChevronDown = ({ className, size }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const StatusBadge = ({ status }) => {
    let variant = 'default';
    if (status === 'Applied') variant = 'info';
    if (status === 'Interview') variant = 'warning';
    if (['Selected', 'Offer'].includes(status)) variant = 'success';
    if (status === 'Rejected') variant = 'danger';
    if (status === 'Withdrawn') variant = 'default';

    return <Badge variant={variant}>{status}</Badge>;
};

export default Applications;
