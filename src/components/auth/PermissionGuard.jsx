import React from 'react';
import { ShieldAlert, Lock, ArrowRight, Home, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PermissionGuard({ requiredRole = 'seller', children }) {
  const { currentUser, canAccess, setIsAuthModalOpen } = useAuth();

  const isAllowed = canAccess(requiredRole);

  if (isAllowed) {
    return children;
  }

  const roleName = requiredRole === 'broker' ? 'Regional Broker' : 'Property Seller';

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 text-center h-full select-none">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-sm">
        <Lock className="w-7 h-7" />
      </div>

      <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
        Access Restricted: {roleName} Privileges Required
      </h2>

      <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
        Your current account is logged in as <strong className="text-slate-800 font-semibold">{currentUser.name} ({currentUser.role.toUpperCase()})</strong>.
        This administrative portal is only accessible to authorized {roleName} accounts.
      </p>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
        >
          <span>Switch to {roleName} Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
