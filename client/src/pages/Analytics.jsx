import React, { useMemo } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    BarChart, Bar
} from 'recharts';
import { Briefcase, CheckCircle, Clock, XCircle, TrendingUp, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';

const Analytics = () => {
    const { applications, interviews } = useApp();
    const { theme } = useTheme();

    // 1. Calculate Summary Stats
    const totalApps = applications.length;
    const interviewsCount = interviews.length; // Or use applications.filter if interviews not fully synced
    const offers = applications.filter(a => ['Selected', 'Offer'].includes(a.status)).length;
    const rejections = applications.filter(a => a.status === 'Rejected').length;

    // 2. Prepare Data for Pie Chart (Status Distribution)
    const pieData = useMemo(() => {
        const counts = applications.reduce((acc, app) => {
            const s = app.status || 'Applied';
            acc[s] = (acc[s] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(counts).map(status => ({
            name: status,
            value: counts[status]
        }));
    }, [applications]);

    const PIE_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

    // 3. Prepare Data for Bar Chart (Top Industries)
    const barData = useMemo(() => {
        const counts = applications.reduce((acc, app) => {
            const ind = app.industry || 'Other';
            acc[ind] = (acc[ind] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(counts).map(ind => ({
            name: ind,
            count: counts[ind]
        })).sort((a, b) => b.count - a.count).slice(0, 5);
    }, [applications]);

    // 4. Mock Activity Data (Monthly)
    // In a real app, you would group applications by createdAt timestamp
    const activityData = [
        { name: 'Jan', apps: 4 },
        { name: 'Feb', apps: 8 },
        { name: 'Mar', apps: 12 },
        { name: 'Apr', apps: 5 },
        { name: 'May', apps: 15 },
        { name: 'Jun', apps: totalApps > 44 ? totalApps - 44 : 3 }, // Adjust dynamic mock
    ];

    const isDark = theme === 'dark';
    const gridColor = isDark ? '#262626' : '#e5e7eb';
    const textColor = isDark ? '#A1A1AA' : '#6b7280';
    const tooltipBg = isDark ? '#0A0A0A' : '#ffffff';
    const tooltipBorder = isDark ? '#262626' : '#e5e7eb';
    const tooltipText = isDark ? '#EDEDED' : '#111827';

    return (
        <div className="space-y-6 pb-20">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">Analytics Overview</h1>
                <p className="text-gray-500 dark:text-dark-muted mt-1">Deep dive into your application performance and stats.</p>
            </div>

            {/* SUMMARY STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Total Applications" value={totalApps} icon={Briefcase} color="brand" />
                <StatsCard title="Interviews" value={interviewsCount} icon={Clock} color="amber" />
                <StatsCard title="Offers Received" value={offers} icon={CheckCircle} color="emerald" />
                <StatsCard title="Rejections" value={rejections} icon={XCircle} color="rose" />
            </div>

            {/* CHARTS ROW 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* STATUS DISTRIBUTION */}
                <GlassCard className="flex flex-col h-[400px]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-6">Application Status</h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px' }}
                                    itemStyle={{ color: tooltipText }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-gray-500 dark:text-dark-muted ml-1">{value}</span>}
                                />
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-900 dark:fill-dark-text font-bold text-2xl">
                                    {totalApps}
                                </text>
                                <text x="50%" y="50%" dy={20} textAnchor="middle" dominantBaseline="middle" className="fill-gray-500 dark:fill-dark-muted text-sm uppercase">
                                    Apps
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* MONTHLY ACTIVITY */}
                <GlassCard className="flex flex-col h-[400px]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-6">Application Activity</h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke={textColor}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    stroke={textColor}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px' }}
                                    itemStyle={{ color: '#6366f1' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="apps"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorApps)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </div>

            {/* CHARTS ROW 2 - INDUSTRIES */}
            <GlassCard className="flex flex-col h-[400px]">
                <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-6">Top Industries</h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke={textColor}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                stroke={textColor}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: tooltipBorder, opacity: 0.5 }}
                                contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px' }}
                                itemStyle={{ color: tooltipText }}
                            />
                            <Bar
                                dataKey="count"
                                fill="#8b5cf6"
                                radius={[4, 4, 0, 0]}
                                barSize={60}
                            >
                                {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>
        </div>
    );
};

const StatsCard = ({ title, value, icon: Icon, color = 'brand' }) => {
    const colors = {
        brand: 'text-brand bg-brand/10',
        amber: 'text-accent-amber bg-accent-amber/10',
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

export default Analytics;
