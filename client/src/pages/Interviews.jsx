import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    Video,
    Plus,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Interviews = () => {
    const { interviews, addInterview, updateInterview, deleteInterview } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        date: '',
        time: '',
        round: '',
        mode: 'Online',
        notes: ''
    });

    // Calculate Stats
    const upcoming = interviews.filter(i => i.status === 'Scheduled').length;
    const completed = interviews.filter(i => i.status === 'Completed').length;

    // Find next interview for countdown
    const nextInterview = interviews
        .filter(i => i.status === 'Scheduled')
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddInterview = async (e) => {
        e.preventDefault();
        await addInterview({
            ...formData,
            status: 'Scheduled'
        });
        setShowModal(false);
        setFormData({ company: '', role: '', date: '', time: '', round: '', mode: 'Online', notes: '' });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this interview?")) {
            deleteInterview(id);
        }
    };

    const markCompleted = (id) => {
        updateInterview(id, { status: 'Completed' });
    };

    return (
        <div className="space-y-6 pb-20 fade-in">

            {/* HEADER & ACTIONS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">Interview Tracker</h1>
                    <p className="text-gray-500 dark:text-dark-muted">Manage your upcoming schedules and preparation.</p>
                </div>
                <Button onClick={() => setShowModal(true)} icon={Plus}>Schedule Interview</Button>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Upcoming Interviews"
                    value={upcoming}
                    icon={Calendar}
                    color="blue"
                />
                <StatsCard
                    title="Completed"
                    value={completed}
                    icon={CheckCircle}
                    color="emerald"
                />
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 border border-purple-200 dark:border-purple-500/30 p-6 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-purple-700 dark:text-purple-300 font-medium mb-1">Next Interview</h3>
                        {nextInterview ? (
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{nextInterview.company}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {new Date(nextInterview.date).toLocaleDateString()} at {nextInterview.time}
                                </div>
                                <div className="text-xs text-purple-700 dark:text-purple-200 mt-2 bg-purple-200 dark:bg-purple-500/20 inline-block px-2 py-1 rounded">
                                    {nextInterview.round}
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400 italic mt-2">No upcoming interviews</div>
                        )}
                    </div>
                </div>
            </div>

            {/* INTERVIEW LIST */}
            <GlassCard className="!p-0 overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100/50 dark:bg-dark-hover/50 text-gray-500 dark:text-dark-muted uppercase text-xs tracking-wider border-b border-gray-200 dark:border-dark-border">
                            <tr>
                                <th className="p-4 pl-6">Company & Role</th>
                                <th className="p-4">Date & Time</th>
                                <th className="p-4">Round</th>
                                <th className="p-4">Mode</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-border/50">
                            {interviews.length > 0 ? (
                                interviews.map((interview) => (
                                    <tr key={interview.id} className="hover:bg-gray-50 dark:hover:bg-dark-hover/50 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="font-bold text-gray-900 dark:text-dark-text">{interview.company}</div>
                                            <div className="text-sm text-gray-500 dark:text-dark-muted">{interview.role}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-gray-900 dark:text-dark-text">{new Date(interview.date).toLocaleDateString()}</div>
                                            <div className="text-sm text-gray-500 dark:text-dark-muted">{interview.time}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-dark-muted px-2 py-1 rounded text-xs border border-gray-200 dark:border-dark-border">
                                                {interview.round}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center text-gray-700 dark:text-dark-muted text-sm">
                                                {interview.mode === 'Online' ? <Video className="w-4 h-4 mr-2 text-accent-cyan" /> : <MapPin className="w-4 h-4 mr-2 text-accent-rose" />}
                                                {interview.mode}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={interview.status} />
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {interview.status !== 'Completed' && (
                                                    <button
                                                        onClick={() => markCompleted(interview.id)}
                                                        className="text-accent-emerald hover:text-green-600 dark:hover:text-green-300 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                        title="Mark Completed"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(interview.id)}
                                                    className="text-accent-rose hover:text-red-600 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-dark-muted">
                                        No interviews added yet. Schedule one above!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* ADD MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-200 dark:border-dark-border flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Schedule Interview</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddInterview} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-dark-muted mb-1">Company</label>
                                    <input name="company" required value={formData.company} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg p-2.5 text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-brand/50 outline-none" placeholder="e.g. Google" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-dark-muted mb-1">Role</label>
                                    <input name="role" required value={formData.role} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg p-2.5 text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-brand/50 outline-none" placeholder="e.g. SDE 1" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-dark-muted mb-1">Date</label>
                                    <input type="date" name="date" required value={formData.date} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg p-2.5 text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-brand/50 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-dark-muted mb-1">Time</label>
                                    <input type="time" name="time" required value={formData.time} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg p-2.5 text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-brand/50 outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-dark-muted mb-1">Round Type</label>
                                    <input name="round" required value={formData.round} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg p-2.5 text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-brand/50 outline-none" placeholder="e.g. Technical 1" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 dark:text-dark-muted mb-1">Mode</label>
                                    <select name="mode" value={formData.mode} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg p-2.5 text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-brand/50 outline-none">
                                        <option value="Online">Online</option>
                                        <option value="Offline">Offline</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 dark:text-dark-muted mb-1">Notes </label>
                                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-dark-border rounded-lg p-2.5 text-gray-900 dark:text-dark-text focus:ring-2 focus:ring-brand/50 outline-none h-24 resize-none" placeholder="Topics to prepare, links, etc."></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => setShowModal(false)} type="button">Cancel</Button>
                                <Button type="submit">Save Interview</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

const StatsCard = ({ title, value, icon: Icon, color = 'brand' }) => {
    const colors = {
        brand: 'text-brand bg-brand/10',
        blue: 'text-accent-cyan bg-accent-cyan/10',
        emerald: 'text-accent-emerald bg-accent-emerald/10',
        rose: 'text-accent-rose bg-accent-rose/10',
    };

    return (
        <GlassCard className="flex items-center gap-4 p-5">
            <div className={`p-3 rounded-xl ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-gray-500 dark:text-dark-muted text-xs font-semibold uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-dark-text leading-tight">{value}</h3>
            </div>
        </GlassCard>
    );
};

const StatusBadge = ({ status }) => {
    let variant = 'default';
    if (status === 'Scheduled') variant = 'info';
    if (status === 'Completed') variant = 'success';

    return <Badge variant={variant}>{status}</Badge>;
};

export default Interviews;
