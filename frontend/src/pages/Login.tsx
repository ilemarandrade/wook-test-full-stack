import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { LoginFormValues, loginSchema } from '../schemas/authSchemas';
import { TextFieldControlled } from '../components/form/TextFieldControlled';
import { PasswordFieldControlled } from '../components/form/PasswordFieldControlled';
/// <reference types="vite/client" />

const API_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: joiResolver(loginSchema),

  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { email: values.email, password: values.password },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
      } else {
        login(data.jwt);
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      setError('Unexpected error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-700 rounded px-3 py-2">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextFieldControlled<LoginFormValues>
            name="email"
            control={control}
            label="Email"
            type="email"
          />
          <PasswordFieldControlled<LoginFormValues>
            name="password"
            control={control}
            label="Password"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 inline-flex justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:bg-slate-600"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

