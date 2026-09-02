import React from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </ErrorBoundary>
  );
}
