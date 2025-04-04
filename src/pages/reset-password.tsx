// src/pages/reset-password.tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [formData, setFormData] = useState<{ password: string; confirmPassword: string }>({
    password: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || typeof token !== 'string') {
        setStatus('invalid');
        return;
      }

      try {
        console.log(`Verifying reset token: ${token}`); // Added log
        const response = await axios.get(`/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        console.log('API response:', response.data); // Added log
        if (response.status === 200) {
          setStatus('valid');
          console.log('Token is valid. Proceeding to show reset form.'); // Added log
        } else {
          setStatus('invalid');
          console.log('Token verification failed with status:', response.status); // Added log
        }
      } catch (error) {
        console.error('Token verification error:', error);
        setStatus('invalid');
      }
    };

    if (router.isReady) {
      verifyToken();
    }
  }, [token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setPasswordError('Passwords do not match.');
      } else {
        setPasswordError(null);
      }
    }

    if (name === 'password') {
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setPasswordError('Passwords do not match.');
      } else {
        setPasswordError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting new password for token:', token); // Added log
      const response = await axios.post('/api/auth/reset-password', {
        token,
        password: formData.password,
      }, {
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('API response:', response.data); // Added log

      if (response.status === 200) {
        toast.success('Password reset successful! You can now log in with your new password.');
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        toast.error(response.data.message || 'An error occurred.');
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg1">
        <div className="text-center">
          <p className="body-text">Verifying your reset token...</p>
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

  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg1 p-4">
        <div className="max-w-md w-full p-6 bg-bg6 text-textPrimary shadow rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Invalid or Expired Token</h2>
          <p className="mb-4">Your password reset link is invalid or has expired.</p>
          <Button href="/forgot-password" variant="primary">
            Request New Password Reset
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg1 p-4">
      <div className="max-w-md w-full p-6 bg-bg6 text-textPrimary shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="bg-bg3 text-textPrimary"
          />
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="bg-bg3 text-textPrimary"
          />
          {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}
          <Button type="submit" variant="primary" disabled={loading || passwordError !== null}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
