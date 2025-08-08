// src/components/forms/LoginForm.tsx

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
// import Input from '../common/Input';
import Button from '../common/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Link from 'next/link';
import axios from 'axios';
import { FaGoogle, FaApple, FaEnvelope, FaEye } from 'react-icons/fa'; // Import Apple icon
import SmallerLoaderSpin from '../common/SmallerLoaderSpin';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: '',
      password: '',
    }
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      if (!validateEmail(value)) {
        setEmailError('Invalid email format.');
      } else {
        setEmailError(null);
      }
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/resend-verification', {
        email: formData.email,
      });

      if (response.status === 200) {
        toast.success('Verification email resent! Please check your email.');
      }
    } catch (error: any) {
      console.error('Resend Verification Error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to resend verification email.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss(); // Dismiss existing toasts to prevent duplicates
    setUnverified(false);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        if (result.error === 'Please verify your email before logging in.') {
          setUnverified(true);
          toast.error(result.error, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
          });
        } else {
          toast.error(result.error);
        }
      } else {
        // toast.success('Logged in successfully!');
        // Redirect to desired page
        router.push('/');
      }
    } catch {
      toast.error('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => () => {
    signIn(provider, { callbackUrl: '/coin' });
  };

  return (
    <div className="bg-[#181A20]">
      <div className="flex items-center justify-center my-5 text-white py-5">
        <div className="bg-[#1E2329CC] bg-opacity-80 rounded-[40px] border-[2px] border-[#4B4B4B] shadow-lg p-3 w-full max-w-lg mx-4 sm:mx-0">
          <div className="flex justify-end items-center">
            <button className="text-white">
              <i className="fas fa-times mr-2"></i>
            </button>
          </div>
          <div className="md:mt-[-30px] sm:pt-4">
            <h2 className="sofia-fonts font-[400] text-center text-[22px] sm:text-[35px]">
              Welcome To
            </h2>
            <h2 className="sofia-fonts font-[700] text-center text-[22px] sm:text-[35px] md:mt-[-15px] text-[#FFB92D]">
              YOZOON
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="px-3 md:px-10 py-5">
            <div className="mb-4">
              <label
                className="block text-white font-[700] text-sm sm:text-[18px] inter-fonts mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="bg-[#1E2329CC] w-full text-whitetext-sm font-[300] pr-8 py-2 focus:outline-none border-white border-b-[1px] placeholder:text-[14px]"
                  type="email"
                  id="email"
                  name='email'
                  placeholder="johanwaan123@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <i className=" absolute right-0 top-3 text-[#B2B2B2]">
                  <FaEnvelope />
                </i>
              </div>
              {/* <Input
                // label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="johanwaan123@gmail.com"
                // reacticon="fas fa-envelope"
                required
                className="p-2 mr-2 border-black !bg-red-500 border-solid border-2 rounded-2xl focus:outline-none placeholder:text-black"
              /> */}
              {emailError && (
                <p className="text-red-500 text-sm mb-2">{emailError}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-white font-[700] text-sm sm:text-[18px] inter-fonts mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  className="bg-[#1E2329CC] w-full text-white text-sm font-[300] pr-8 py-3 focus:outline-none border-white border-b-[1px] placeholder:text-[14px]"
                  type="password"
                  id="password"
                  placeholder="********"
                  minLength={6}
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <i className=" absolute right-0 top-3 text-[#B2B2B2]">
                  <FaEye />
                </i>
              </div>
              {/* <Input
                // label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="********"
                // reacticon=""
                                className="bg-inherit text-white pr-8 py-2 focus:outline-none border-b-[1px] placeholder:text-[14px] z-50"

              /> */}
            </div>
            <div>
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center text-white">
                  <input
                    className="form-checkbox bg-gray-700 text-yellow-500"
                    type="checkbox"
                  />
                  <span className="ml-2 robboto-fonts font-[400] text-sm sm:text-[14px]">
                    Remember me
                  </span>
                </label>
                <a
                  className="text-white robboto-fonts font-[400] text-sm sm:text-[14px]"
                  href="/forgot-password"
                >
                  Forgot Password
                </a>
              </div>
            </div>
            <div className="text-center py-4">
              <button
                className="inter-fonts font-[700] text-[14px] sm:text-[18px] bg-[#FFB92D] rounded-[10px] text-black px-10 py-2 hover:bg-yellow-800"
                type="submit"
                disabled={loading || emailError !== null}
              >
                <span className="flex items-center justify-center ">
                  Login {loading && <SmallerLoaderSpin />}
                </span>
              </button>
            </div>
          </form>
          {unverified && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              <p>Your email is not verified.</p>
              <button
                onClick={handleResendVerification}
                className="mt-2 px-4 py-2 bg-accentBlue text-white rounded hover:bg-accentBlue-dark transition-colors"
                disabled={loading}
              >
                {loading ? 'Resending...' : 'Resend Verification Email'}
              </button>
            </div>
          )}
          <p className="text-center text-white robboto-fonts font-[400] text-[14px]">
            Don’t have an account?{' '}
            <a
              href="/signup"
              className="text-[#FFB92D] underline hover:underline"
            >
              {' '}
              SIGN UP{' '}
            </a>
          </p>
          <div className="flex items-center mt-5">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-white inter-fonts font-[700] text-[14px] md:text-[20px]">
              OR
            </span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          <h2 className="inter-fonts font-[400] text-white text-center text-[14px] sm:text-[16px] py-4">
            Sign in with
          </h2>
          <div className="flex justify-center items-center gap-1 mb-6 px-3 md:px-10 flex-wrap">
            <button onClick={() => signIn('twitter')}>
              <img
                className="w-[100px] sm:w-[130px] h-auto"
                src="assets/images/signup-twitter-icon.png"
                alt=""
              />
            </button>
            <button onClick={handleSocialLogin('google')}>
              <img
                className="w-[100px] sm:w-[130px] h-auto"
                src="assets/images/signup-google-icon.png"
                alt=""
              />
            </button>
            <button onClick={handleSocialLogin('apple')}>
              <img
                className="ml-1 w-[100px] sm:w-[130px] h-auto"
                src="assets/images/signup-apple.png"
                alt=""
              />
            </button>
          </div>
        </div>
      </div>

      {/* <div className="max-w-md mx-auto p-6  text-textPrimary shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-bg3 text-textPrimary"
        />
        {emailError && <p className="text-red-500 text-sm mb-2">{emailError}</p>}
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          className="bg-bg3 text-textPrimary"
        />
        <Button type="submit" variant="primary" disabled={loading || emailError !== null}>
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
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
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>
      </form>
      {unverified && (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p>Your email is not verified.</p>
          <button
            onClick={handleResendVerification}
            className="mt-2 px-4 py-2 bg-accentBlue text-white rounded hover:bg-accentBlue-dark transition-colors"
            disabled={loading}
          >
            {loading ? 'Resending...' : 'Resend Verification Email'}
          </button>
        </div>
      )}
      <div className="text-center mt-4">
        <p>Don't have an account?</p>
        <Button href="/signup" variant="secondary">
          Signup
        </Button>
      </div>
      <div className="text-center mt-4">
        <Link href="/forgot-password" className="text-accentBlue hover:underline body-text">
          Forgot Password?
        </Link>
      </div>
      <div className="text-center mt-6">
        <p>Or login with:</p>
        <div className="flex justify-center space-x-4 mt-2">
          <button
            onClick={handleSocialLogin('google')}
            className="flex items-center justify-center bg-bg3 text-textPrimary p-3 rounded hover:bg-accentBlue transition-colors"
            aria-label="Login with Google"
          >
            <FaGoogle size={20} />
          </button>
          <button
            onClick={handleSocialLogin('apple')}
            className="flex items-center justify-center bg-bg3 text-textPrimary p-3 rounded hover:bg-accentBlue transition-colors"
            aria-label="Login with Apple"
          >
            <FaApple size={20} />
          </button>
        </div>
      </div>
    </div> */}
    </div>
  );
};

export default LoginForm;
