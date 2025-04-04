// src/pages/verify-email.tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const VerifyEmailPage: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [resendEmail, setResendEmail] = useState<string>('');
  const [resending, setResending] = useState<boolean>(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || typeof token !== 'string') {
        setStatus('error');
        return;
      }

      try {
        const response = await axios.get(`/api/auth/verify-email?token=${token}`);
        if (response.status === 200) {
          setStatus('success');
          toast.success('Email verified successfully! Redirecting to login...');
          // Redirect to login page after a delay
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setStatus('error');
        }
      } catch (error: any) {
        console.error('Email Verification Error:', error);
        setStatus('error');
        toast.error(error.response?.data?.message || 'Failed to verify email.');
      }
    };

    if (router.isReady) {
      verifyEmail();
    }
  }, [token, router]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResending(true);
    setResendError(null);
    setResendSuccess(null);
    toast.dismiss(); // Dismiss any existing toasts

    try {
      const response = await axios.post('/api/auth/resend-verification', { email: resendEmail });
      if (response.status === 200) {
        setResendSuccess('Verification email resent! Please check your email.');
        toast.success('Verification email resent! Please check your email.');
      } else {
        setResendError(response.data.message || 'Failed to resend verification email.');
        toast.error(response.data.message || 'Failed to resend verification email.');
      }
    } catch (error: any) {
      console.error('Resend Verification Error:', error);
      setResendError(error.response?.data?.message || 'Failed to resend verification email.');
      toast.error(error.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg1">
        <div className="text-center">
          <p className="body-text">Verifying your email...</p>
          <svg className="animate-spin h-10 w-10 text-accentBlue mx-auto mt-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg1">
        <div className="text-center">
          <p className="text-red-500 body-text">
            Verification failed. The link may have expired or is invalid.
          </p>
          <form onSubmit={handleResend} className="mt-6">
            <Input
              label="Email"
              name="email"
              type="email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              required
              className="bg-bg3 text-textPrimary"
              placeholder="your-email@example.com"
            />
            {resendError && <p className="text-red-500 text-sm mb-2">{resendError}</p>}
            {resendSuccess && <p className="text-green-500 text-sm mb-2">{resendSuccess}</p>}
            <Button type="submit" variant="primary" disabled={resending || !resendEmail}>
              {resending ? 'Resending...' : 'Resend Verification Email'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return null; // When status is 'success', the user is redirected.
};

export default VerifyEmailPage;
