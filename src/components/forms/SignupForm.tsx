// src/components/forms/SignupForm.tsx

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Input from '../common/Input';
import Link from 'next/link';
import Image from 'next/image';

import Button from '../common/Button';
import {
  FaGoogle,
  FaFacebook,
  FaTwitter,
  FaTelegram,
  FaApple,
} from 'react-icons/fa'; // Import Apple icon
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { isValidEmail, isValidPassword } from '../../utils/validators';
import SmallerLoaderSpin from '../common/SmallerLoaderSpin';

const SignupForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      if (!isValidEmail(value)) {
        setEmailError('Invalid email format.');
      } else {
        setEmailError(null);
      }
    }

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

  const handleSocialSignIn = (provider: string) => () => {
    signIn(provider, { callbackUrl: '/' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss(); // Dismiss existing toasts to prevent duplicates

    // Additional validation
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!isValidPassword(formData.password)) {
      setPasswordError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      // Exclude confirmPassword from the request payload
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast(  'Signup successful! Please verify your email within 30 minutes.',
          
        );
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        toast.error(data.message || 'An error occurred during signup.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#181A20]">
      <div className="flex items-center justify-center my-5 text-white py-5">
        <div className="bg-[#1E2329CC] bg-opacity-80 rounded-[40px] border-[2px] border-[#4B4B4B] shadow-lg p-3 w-full max-w-lg mx-4 sm:mx-0">
          <div className="flex justify-between items-center mb-2 sm:mb-0">
            <button className="text-white">
              <i className="fas fa-times mr-2"></i>
            </button>
          </div>
          <div className="md:mt-[-30px]">
            <h2 className="sofia-fonts font-[700] text-center text-[30px] sm:text-[45px]">
              Sign Up
            </h2>
          </div>
          <p className="text-center mb-6 inter-fonts font-[400] text-[14px] px-3 md:px-10">
            Sign up with Email or Continue with Social Accounts
          </p>
          <div className="flex justify-center items-center gap-1 mb-6 px-3 md:px-10">
            <button onClick={() => signIn('twitter', { callbackUrl: '/' })}>
              <img
                className="w-[100px] sm:w-[130px] h-auto"
                src="assets/images/signup-twitter-icon.png"
                alt=""
              />
            </button>
            <button onClick={() => signIn('discord', { callbackUrl: '/' })}>
              <img
                className="w-[100px] sm:w-[130px] h-auto"
                src="assets/images//discord-signup-button.png"
                alt=""
              />
            </button>
            <button onClick={() => handleSocialSignIn('google')}>
              <img
                className="ml-1 w-[100px] sm:w-[130px] h-auto"
                src="assets/images/signup-google-icon.png"
                alt=""
              />
            </button>
          </div>
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-white inter-fonts font-[700] text-[14px] md:text-[20px]">
              OR
            </span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          <form className="px-3 md:px-10">
            <Input
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Johan Waang"
              reacticon="fa-user"
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johanwaan123@gmail.com"
              reacticon="fa-envelope"
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm mb-2">{emailError}</p>
            )}
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="********"
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mb-2">{passwordError}</p>
            )}
          </form>
          <p className="text-center text-white robboto-fonts font-[400] text-[14px] my-4">
            Already a member?{' '}
            <Link href="/login" className="text-[#FFB92D] hover:underline">
              {' '}
              LOGIN{' '}
            </Link>{' '}
            to continue your journey.
          </p>
        </div>
      </div>
      <div className="text-center py-4 flex justify-center items-center">
        <button
        onClick={handleSubmit}
          className="inter-fonts flex justify-center items-center font-[700] text-[14px] sm:text-[18px] bg-[#FFB92D] rounded-[10px] text-black px-5 py-2 hover:bg-[#FFB92D]"
          type="submit"
          disabled={loading || emailError !== null}
        >
        
            <span className='mr-2'>Sign Up</span> {loading && <SmallerLoaderSpin/>}
          
        </button>
      </div>

      {/* <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required          
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
              />
        <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}               
              />
        {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}
        <div className="text-center py-4">
              <button
                className="inter-fonts font-[700] text-[14px] sm:text-[18px] bg-[#FFB92D] rounded-[10px] text-black px-10 py-2 hover:bg-yellow-600"
                type="submit"
                disabled={loading || emailError !== null}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      viewBox="0 0 24 24"
                    >
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
              </button>
            </div>/
      </form> */}
    </div>
  );
};

export default SignupForm;
