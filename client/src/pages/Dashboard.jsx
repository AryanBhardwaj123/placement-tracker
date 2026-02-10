import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import { motion } from 'framer-motion';
import {
    Briefcase,
    CheckCircle,
    Clock,
    TrendingUp,
    Calendar,
    ArrowRight,
    Activity,
    MoreHorizontal,
    Zap,
    Target as TargetIcon
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Dashboard = () => {
    const { userProfile } = useAuth();
    const { applications, interviews, loading } = useApp();
    const { theme } = useTheme(); // Use theme context

    // --- DERIVED DATA ---
    const stats = useMemo(() => {
        const total = applications.length;
        const interviewing = applications.filter(app => app.status === 'Interview').length;
        const offers = applications.filter(app => ['Selected', 'Offer'].includes(app.status)).length;
        const rejected = applications.filter(app => app.status === 'Rejected').length;

        const finished = offers + rejected;
        const successRate = finished > 0 ? Math.round((offers / finished) * 100) : 0;

        return { total, interviewing, offers, rejected, successRate };
    }, [applications]);

    const recentActivity = useMemo(() => {
        return [...applications]
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
            .slice(0, 5);
    }, [applications]);

    const upcomingInterviews = useMemo(() => {
        const now = new Date();
        return [...interviews]
            .filter(i => new Date(i.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
    }, [interviews]);

    const chartData = useMemo(() => {
        const data = {};
        applications.forEach(app => {
            if (!app.createdAt) return;
            const date = new Date(app.createdAt.seconds * 1000);
            const key = date.toLocaleString('default', { month: 'short' });
            data[key] = (data[key] || 0) + 1;
        });
        return Object.keys(data).map(key => ({ name: key, count: data[key] }));
    }, [applications]);

    const pieData = [
        { name: 'Applied', value: stats.total - (stats.interviewing + stats.offers + stats.rejected), color: '#6366f1' }, // brand
        { name: 'Interview', value: stats.interviewing, color: '#f59e0b' }, // accent-amber
        { name: 'Offer', value: stats.offers, color: '#10b981' }, // accent-emerald
        { name: 'Rejected', value: stats.rejected, color: '#f43f5e' }, // accent-rose
    ].filter(d => d.value > 0);

    const chartGridColor = theme === 'dark' ? '#262626' : '#e5e7eb';
    const chartTextColor = theme === 'dark' ? '#737373' : '#6b7280';
    const chartTooltipBg = theme === 'dark' ? '#0A0A0A' : '#ffffff';
    const chartTooltipBorder = theme === 'dark' ? '#262626' : '#e5e7eb';
    const chartTooltipText = theme === 'dark' ? '#fff' : '#111827';

    // --- LOADING STATE ---
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-900 dark:text-dark-text">
                <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500 dark:text-dark-muted font-medium animate-pulse">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* WRAPPER */}

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-brand font-medium text-sm mb-1"
                    >
                        <Zap size={16} />
                        <span>Welcome back</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-dark-text"
                    >
                        {userProfile?.firstName || 'Creator'}.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 dark:text-dark-muted mt-2 text-lg"
                    >
                        Overview of your job search progress.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-3"
                >
                    <Link to="/applications">
                        <Button variant="secondary">View All</Button>
                    </Link>
                    <Link to="/add">
                        <Button>+ New Application</Button>
                    </Link>
                </motion.div>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Applications" value={stats.total} icon={Briefcase} delay={0.1} />
                <StatCard title="Active Interviews" value={stats.interviewing} icon={Clock} color="amber" delay={0.2} />
                <StatCard title="Offers Received" value={stats.offers} icon={CheckCircle} color="emerald" delay={0.3} />
                <StatCard title="Success Rate" value={`${stats.successRate}%`} icon={TrendingUp} color="purple" delay={0.4} />
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: ACTIVITY & TABLE */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Activity Chart */}
                    <GlassCard className="!p-0 overflow-hidden relative group h-[350px] flex flex-col">
                        <div className="p-6 pb-2 flex justify-between items-center relative z-10">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-dark-text">
                                <Activity size={18} className="text-brand" />
                                Application Activity
                            </h3>
                        </div>

                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTextColor, fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: chartTooltipBg, borderColor: chartTooltipBorder, color: chartTooltipText, borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ color: '#818cf8' }}
                                        cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    {/* Recent Applications */}
                    <GlassCard className="h-fit">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">Recent Applications</h3>
                            <Link to="/applications" className="text-xs text-brand hover:text-brand-hover flex items-center gap-1 transition-colors">
                                View All <ArrowRight size={12} />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentActivity.length > 0 ? recentActivity.map((app) => (
                                <div key={app.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-dark-border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border flex items-center justify-center text-gray-500 dark:text-dark-muted font-bold text-sm group-hover:text-brand transition-colors">
                                            {app.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm text-gray-900 dark:text-white transition-colors">{app.role}</h4>
                                            <p className="text-gray-500 dark:text-dark-muted text-xs">{app.name}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={app.status} />
                                </div>
                            )) : (
                                <div className="text-center py-8 text-gray-500 dark:text-dark-muted text-sm">No recent activity.</div>
                            )}
                        </div>
                    </GlassCard>
                </div>

                {/* RIGHT COLUMN: STATS & UPCOMING */}
                <div className="space-y-8">

                    {/* Status Distribution */}
                    <GlassCard>
                        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-dark-text">Status Breakdown</h3>
                        <div className="h-[200px] w-full flex justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: chartTooltipBg, borderColor: chartTooltipBorder, color: chartTooltipText, borderRadius: '8px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-dark-text">{stats.total}</span>
                                    <p className="text-xs text-gray-500 dark:text-dark-muted">Total</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 mt-4">
                            {pieData.map(d => (
                                <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-dark-muted">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                                    {d.name}
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Upcoming Interviews Widget */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand to-accent-purple opacity-30 blur rounded-2xl group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6 shadow-xl transition-colors duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-dark-text">
                                    <Calendar className="text-brand" size={18} /> Upcoming
                                </h3>
                                <Link to="/interviews" className="p-1 hover:bg-gray-100 dark:hover:bg-dark-hover rounded transition-colors text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white">
                                    <MoreHorizontal size={18} />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {upcomingInterviews.length > 0 ? upcomingInterviews.map((int, i) => (
                                    <div key={i} className="flex gap-4 items-start relative">
                                        <div className="flex flex-col items-center">
                                            <div className="w-2 h-2 bg-brand rounded-full mt-2 relative z-10 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                                            {i !== upcomingInterviews.length - 1 && <div className="w-0.5 h-full bg-gray-200 dark:bg-dark-border absolute top-2.5 left-[3px] -mb-4"></div>}
                                        </div>
                                        <div className="pb-2">
                                            <p className="text-brand-light font-medium text-xs mb-0.5">
                                                {new Date(int.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' })} • {int.time}
                                            </p>
                                            <h4 className="font-semibold text-sm text-gray-900 dark:text-dark-text">{int.company}</h4>
                                            <p className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">{int.round || "General"} Round</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-sm text-gray-500 dark:text-dark-muted text-center py-4">No upcoming interviews scheduled.</p>
                                )}
                            </div>

                            {upcomingInterviews.length > 0 && (
                                <Link to="/interviews" className="block mt-4 text-center text-xs text-brand hover:text-brand-hover transition-colors font-medium">
                                    View full schedule
                                </Link>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- SUBCOMPONENTS ---

const StatCard = ({ title, value, icon: Icon, color = 'brand', delay }) => {

    // Sub-component specific styling logic using the prop
    const colorStyles = {
        brand: 'text-brand bg-brand/10',
        amber: 'text-accent-amber bg-accent-amber/10',
        emerald: 'text-accent-emerald bg-accent-emerald/10',
        purple: 'text-accent-purple bg-accent-purple/10',
    };

    return (
        <GlassCard
            hoverEffect
            className="flex flex-col justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 dark:text-dark-muted text-sm font-medium">{title}</p>
                    <h3 className="text-3xl font-bold mt-1 tracking-tight text-gray-900 dark:text-dark-text">{value}</h3>
                </div>
                <div className={`p-2.5 rounded-lg ${colorStyles[color] || colorStyles.brand}`}>
                    <Icon size={20} />
                </div>
            </div>
        </GlassCard>
    );
};

const StatusBadge = ({ status }) => {
    let variant = 'default';
    if (status === 'Applied') variant = 'info';
    if (status === 'Interview') variant = 'warning';
    if (['Selected', 'Offer'].includes(status)) variant = 'success';
    if (status === 'Rejected') variant = 'danger';

    return <Badge variant={variant}>{status}</Badge>;
};

export default Dashboard;
