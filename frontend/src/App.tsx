import React from 'react';

import { AuthProvider } from './context/AuthContext';
import AppRoutes from './Routes';
import MainLayout from './components/layout/MainLayout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </AuthProvider>
  );
};

export default App;
