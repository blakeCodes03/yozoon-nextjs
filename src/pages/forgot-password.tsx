// src/pages/forgot-password.tsx

import React, { useState } from 'react';
import axios from 'axios';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);

    if (!validateEmail(value)) {
      setEmailError('Invalid email format.');
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    if (!validateEmail(email)) {
      setEmailError('Invalid email format.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/request-password-reset', { email });

      if (response.status === 200) {
        toast.success('If an account with that email exists, a reset link has been sent.');
        // Optionally, redirect to login page after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        toast.error(response.data.message || 'An error occurred.');
      }
    } catch (error: any) {
      console.error('Password reset request error:', error);
      toast.error(error.response?.data?.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg1 p-4">
      <div className="max-w-md w-full p-6 bg-bg6 text-textPrimary shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            required
            className="bg-bg3 text-textPrimary"
          />
          {emailError && <p className="text-red-500 text-sm mb-2">{emailError}</p>}
          <Button type="submit" variant="primary" disabled={loading || emailError !== null}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
        <div className="text-center mt-4">
          <Button href="/login" variant="secondary">
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
