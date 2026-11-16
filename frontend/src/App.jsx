import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WebsiteProvider } from './context/WebsiteContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WebsiteProvider>
          <AppRoutes />
        </WebsiteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
