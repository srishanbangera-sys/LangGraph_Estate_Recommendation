import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Pre-configured mock user profiles for 3 distinct user tiers:
 * 1. Regular User (Buyer / Renter)
 * 2. Property Seller (Scoped to own properties & inquiries)
 * 3. Regional Broker (Mangalore & Coastal Karnataka administrative oversight)
 */
export const MOCK_USERS = {
  user: {
    id: 'usr_buyer_01',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    title: 'Home Buyer / Investor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    permissions: {
      canSearch: true,
      canChatAI: true,
      canSaveProperties: true,
      canAccessSellerCMS: false,
      canAccessBrokerCMS: false,
    }
  },
  seller: {
    id: 'usr_seller_02',
    name: 'Priya Sharma',
    email: 'priya.sharma@mangalorealty.com',
    role: 'seller',
    title: 'Verified Property Owner / Seller',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    company: 'OceanView Properties Mangalore',
    managedPropertyIds: ['prop-1', 'prop-3', 'PROP068'],
    permissions: {
      canSearch: true,
      canChatAI: true,
      canSaveProperties: true,
      canAccessSellerCMS: true,
      canAccessBrokerCMS: false,
    }
  },
  broker: {
    id: 'usr_broker_03',
    name: 'Vikram Hegde',
    email: 'vikram.hegde@proppilot.com',
    role: 'broker',
    title: 'Principal Regional Broker',
    zone: 'Mangalore Coastal Zone (Kadri, Bejai, Surathkal, Urwa, Falnir)',
    licenseNumber: 'RERA-KA-2024-0089',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    permissions: {
      canSearch: true,
      canChatAI: true,
      canSaveProperties: true,
      canAccessSellerCMS: true,
      canAccessBrokerCMS: true,
    }
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize from localStorage or default to Regular User
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('proppilot_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (MOCK_USERS[parsed.role]) return parsed;
      }
    } catch {
      // ignore
    }
    return MOCK_USERS.user;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('proppilot_auth_user', JSON.stringify(currentUser));
    } catch {
      // ignore
    }
  }, [currentUser]);

  const login = (role, customData = {}) => {
    const baseUser = MOCK_USERS[role] || MOCK_USERS.user;
    const user = { ...baseUser, ...customData };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    return user;
  };

  const logout = () => {
    setCurrentUser(MOCK_USERS.user);
  };

  const switchRole = (newRole) => {
    if (MOCK_USERS[newRole]) {
      setCurrentUser(MOCK_USERS[newRole]);
    }
  };

  const canAccess = (requiredRole) => {
    if (requiredRole === 'user') return true;
    if (requiredRole === 'seller') {
      return currentUser.role === 'seller' || currentUser.role === 'broker';
    }
    if (requiredRole === 'broker') {
      return currentUser.role === 'broker';
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        logout,
        switchRole,
        canAccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
