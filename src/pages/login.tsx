// src/pages/login.tsx

import React from 'react';
import LoginForm from '../components/forms/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg1">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
