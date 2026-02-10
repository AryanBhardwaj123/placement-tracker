import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Linkedin,
    Github,
    Globe,
    Edit3,
    Camera,
    Save,
    CheckCircle,
    TrendingUp,
    Target,
    X,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { toast } from 'react-toastify';

const Profile = () => {
    const { currentUser, userProfile, updateProfile, logout } = useAuth();
    const { applications, interviews } = useApp();
    const [isEditing, setIsEditing] = useState(false);

    // Initial State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        role: '',
        phone: '',
        city: '',
        bio: '',
        skills: [],
        links: { linkedin: '', github: '', portfolio: '' },
        preferences: { targetRole: '', targetSalary: '', locations: [] }
    });

    // Validated Data Load
    useEffect(() => {
        if (userProfile) {
            setFormData({
                firstName: userProfile.firstName || '',
                lastName: userProfile.lastName || '',
                role: userProfile.role || '',
                phone: userProfile.phone || '',
                city: userProfile.city || '',
                bio: userProfile.bio || '',
                skills: userProfile.skills || [],
                links: {
                    linkedin: userProfile.links?.linkedin || '',
                    github: userProfile.links?.github || '',
                    portfolio: userProfile.links?.portfolio || ''
                },
                preferences: {
                    targetRole: userProfile.preferences?.targetRole || '',
                    targetSalary: userProfile.preferences?.targetSalary || '',
                    locations: userProfile.preferences?.locations || []
                }
            });
        }
    }, [userProfile]);

    // Stats
    const totalApps = applications.length;
    const interviewsCount = interviews.length;
    const offers = applications.filter(a => ['Selected', 'Offer'].includes(a.status)).length;
    const successRate = totalApps > 0 ? ((offers / totalApps) * 100).toFixed(1) + '%' : '0%';

    const handleSave = async () => {
        try {
            await updateProfile(formData);
            setIsEditing(false);
            toast.success("Profile saved successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save profile.");
        }
    };

    const handleChange = (section, field, value) => {
        if (section === 'root') {
            setFormData({ ...formData, [field]: value });
        } else {
            setFormData({ ...formData, [section]: { ...formData[section], [field]: value } });
        }
    };

    const handleAddSkill = () => {
        const skill = prompt("Enter new skill:");
        if (skill) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skill]
            }));
        }
    };

    const handleRemoveSkill = (index) => {
        if (!isEditing) return;
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    if (!userProfile) return <div className="p-8 text-gray-900 dark:text-dark-text">Loading profile...</div>;

    return (
        <div className="space-y-6 pb-20">
            {/* HER0 SECTION */}
            <GlassCard className="relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-brand/20 to-accent-purple/20"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 p-6 pt-12 md:pt-16">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-card bg-gray-100 dark:bg-dark-hover flex items-center justify-center overflow-hidden shadow-2xl">
                            {currentUser?.photoURL ? (
                                <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-bold text-gray-400 dark:text-dark-muted">{formData.firstName[0]}</span>
                            )}
                        </div>
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 p-2 bg-brand text-white rounded-full shadow-lg hover:bg-brand-hover transition-colors">
                                <Camera size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex-grow text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                                {isEditing ? (
                                    <div className="flex gap-2 mb-2">
                                        <Input value={formData.firstName} onChange={(e) => handleChange('root', 'firstName', e.target.value)} placeholder="First Name" />
                                        <Input value={formData.lastName} onChange={(e) => handleChange('root', 'lastName', e.target.value)} placeholder="Last Name" />
                                    </div>
                                ) : (
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">{formData.firstName} {formData.lastName}</h1>
                                )}

                                {isEditing ? (
                                    <Input value={formData.role} onChange={(e) => handleChange('root', 'role', e.target.value)} placeholder="Current Role / Tagline" className="text-brand font-medium" />
                                ) : (
                                    <p className="text-brand font-medium text-lg">{formData.role || "Add your role"}</p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                    variant={isEditing ? "success" : "secondary"}
                                    icon={isEditing ? Save : Edit3}
                                >
                                    {isEditing ? "Save Changes" : "Edit Profile"}
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 dark:text-dark-muted text-sm items-center">
                            <span className="flex items-center gap-1.5"><Mail size={14} /> {currentUser.email}</span>
                            <span className="flex items-center gap-1.5">
                                <Phone size={14} />
                                {isEditing ? (
                                    <input
                                        value={formData.phone}
                                        onChange={(e) => handleChange('root', 'phone', e.target.value)}
                                        className="bg-transparent border-b border-gray-300 dark:border-dark-border focus:border-brand outline-none w-24 text-gray-900 dark:text-dark-text"
                                        placeholder="Phone"
                                    />
                                ) : (formData.phone || 'Add Phone')}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin size={14} />
                                {isEditing ? (
                                    <input
                                        value={formData.city}
                                        onChange={(e) => handleChange('root', 'city', e.target.value)}
                                        className="bg-transparent border-b border-gray-300 dark:border-dark-border focus:border-brand outline-none w-24 text-gray-900 dark:text-dark-text"
                                        placeholder="City"
                                    />
                                ) : (formData.city || 'Add City')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div className="p-6 border-t border-gray-200 dark:border-dark-border">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-dark-muted uppercase tracking-wider mb-2">About Me</h3>
                    {isEditing ? (
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleChange('root', 'bio', e.target.value)}
                            className="w-full bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg p-3 text-gray-900 dark:text-dark-text focus:outline-none focus:border-brand max-h-32"
                            placeholder="Tell us about yourself..."
                        />
                    ) : (
                        <p className="text-gray-700 dark:text-dark-text/80 leading-relaxed max-w-3xl">{formData.bio || "No bio added yet."}</p>
                    )}
                </div>
            </GlassCard>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard label="Applications" value={totalApps} icon={Briefcase} color="blue" />
                <StatsCard label="Interviews" value={interviewsCount} icon={User} color="amber" />
                <StatsCard label="Offers" value={offers} icon={CheckCircle} color="emerald" />
                <StatsCard label="Success Rate" value={successRate} icon={TrendingUp} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* PREFERENCES & SKILLS */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Target className="text-accent-purple" size={20} />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">Career Preferences</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Input
                                label="Target Role"
                                value={formData.preferences.targetRole}
                                onChange={(e) => handleChange('preferences', 'targetRole', e.target.value)}
                                disabled={!isEditing}
                                placeholder="e.g. Frontend Engineer"
                            />
                            <Input
                                label="Expected Salary"
                                value={formData.preferences.targetSalary}
                                onChange={(e) => handleChange('preferences', 'targetSalary', e.target.value)}
                                disabled={!isEditing}
                                placeholder="e.g. 15-20 LPA"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-dark-muted mb-3">Top Skills</label>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, i) => (
                                    <Badge key={i} variant="default" className="px-3 py-1 text-sm bg-gray-100 dark:bg-dark-hover border-gray-200 dark:border-dark-border text-gray-900 dark:text-dark-text">
                                        {skill}
                                        {isEditing && (
                                            <button onClick={() => handleRemoveSkill(i)} className="ml-2 hover:text-accent-rose">
                                                <X size={12} />
                                            </button>
                                        )}
                                    </Badge>
                                ))}
                                {isEditing && (
                                    <button
                                        onClick={handleAddSkill}
                                        className="px-3 py-1 rounded-full text-sm border border-dashed border-gray-300 dark:border-dark-border text-gray-500 dark:text-dark-muted hover:text-brand hover:border-brand transition-colors"
                                    >
                                        + Add Skill
                                    </button>
                                )}
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Globe className="text-accent-cyan" size={20} />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">Social & Portfolio</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Linkedin className="text-gray-400 dark:text-dark-muted w-5" />
                                <Input
                                    className="flex-grow"
                                    value={formData.links.linkedin}
                                    onChange={(e) => handleChange('links', 'linkedin', e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="LinkedIn URL"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <Github className="text-gray-400 dark:text-dark-muted w-5" />
                                <Input
                                    className="flex-grow"
                                    value={formData.links.github}
                                    onChange={(e) => handleChange('links', 'github', e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="GitHub URL"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <Globe className="text-gray-400 dark:text-dark-muted w-5" />
                                <Input
                                    className="flex-grow"
                                    value={formData.links.portfolio}
                                    onChange={(e) => handleChange('links', 'portfolio', e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="Portfolio Website"
                                />
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* SIDEBAR ACTIONS */}
                <div className="space-y-6">
                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-4">Account Actions</h3>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start" onClick={() => logout()}>
                                <LogOut size={16} className="mr-2" /> Logout
                            </Button>
                        </div>
                    </GlassCard>
                </div>

            </div>
        </div>
    );
};

const StatsCard = ({ label, value, icon: Icon, color = 'brand' }) => {
    const colors = {
        brand: 'text-brand bg-brand/10',
        blue: 'text-accent-cyan bg-accent-cyan/10',
        amber: 'text-accent-amber bg-accent-amber/10',
        emerald: 'text-accent-emerald bg-accent-emerald/10',
        purple: 'text-accent-purple bg-accent-purple/10',
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

export default Profile;
