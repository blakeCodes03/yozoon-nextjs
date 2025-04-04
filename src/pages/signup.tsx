// src/pages/signup.tsx

import React from 'react';
import SignupForm from '../components/forms/SignupForm';

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg1">
      <SignupForm />
    </div>
  );
};

export default SignupPage;
