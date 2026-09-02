import React, { useState } from 'react';
import { X, Shield, User, Building, Home, Check, ArrowRight, Sparkles, Lock } from 'lucide-react';
import { useAuth, MOCK_USERS } from '../../context/AuthContext';

export default function LoginModal({ isOpen, onClose, targetRole = null }) {
  const { currentUser, login } = useAuth();
  const [selectedRole, setSelectedRole] = useState(targetRole || currentUser.role || 'user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const roles = [
    {
      id: 'user',
      label: 'Regular User',
      sublabel: 'Home Buyer / Renter',
      icon: User,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Public Access',
      features: ['AI Real Estate Concierge', 'Interactive Map Search', 'Saved Favorites', 'Market Telemetry']
    },
    {
      id: 'seller',
      label: 'Property Seller',
      sublabel: 'Property Owner / Agent',
      icon: Home,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Seller CMS',
      features: ['Manage Own Listings', 'Status Updates (Available/Sold)', 'Lead & Inquiry Inbox', 'Listing Analytics']
    },
    {
      id: 'broker',
      label: 'Regional Broker',
      sublabel: 'Mangalore Zone Admin',
      icon: Building,
      color: 'from-amber-600 to-orange-600',
      badge: 'Regional Oversight',
      features: ['Mangalore Regional Verification', 'Approve/Reject Seller Listings', 'Zone Pricing Telemetry', 'Broker Admin Queue']
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    const mock = MOCK_USERS[roleId];
    if (mock) {
      setEmail(mock.email);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(selectedRole, email ? { email } : {});
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const activeRoleData = roles.find(r => r.id === selectedRole) || roles[0];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with PropPilot Branding */}
        <div className="px-8 pt-8 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center space-x-2.5 mb-2">
            <img src="/logo.png" alt="PropPilot" className="h-9 w-auto object-contain" />
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200/60">
              Role Access Control
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Sign in to PropPilot Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose your account tier to experience scoped permissions and dedicated dashboard views.
          </p>

          {/* 3-Tier Segmented Control Role Selector */}
          <div className="grid grid-cols-3 gap-2 mt-5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/60">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r.id)}
                  className={`flex flex-col items-center py-2.5 px-2 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-md font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="text-xs">{r.label}</span>
                  <span className="text-[9px] text-slate-400 font-normal">{r.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form and Scoped Permission Details */}
        <div className="p-8 space-y-6">
          {/* Active Role Privilege Summary */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeRoleData.color}`} />
                <span className="text-xs font-bold text-slate-800">
                  {activeRoleData.label} Privileges
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                Tier: {activeRoleData.id.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {activeRoleData.features.map((feat, idx) => (
                <div key={idx} className="flex items-center text-[11px] text-slate-600">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick 1-Click Demo Login Banner */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Email ({activeRoleData.label})
              </label>
              <input
                type="email"
                value={email || MOCK_USERS[selectedRole]?.email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800"
                required
              />
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Authenticating...' : `Enter as ${activeRoleData.label}`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  login(selectedRole);
                  onClose();
                }}
                className="py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all border border-indigo-200/60 shrink-0"
              >
                1-Click Demo
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
