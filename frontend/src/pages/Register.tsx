import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { RegisterFormValues, registerSchema } from '../schemas/authSchemas';
import { TextFieldControlled } from '../components/form/TextFieldControlled';
import { PasswordFieldControlled } from '../components/form/PasswordFieldControlled';
/// <reference types="vite/client" />

const API_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: {  isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: joiResolver(registerSchema),
    
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            name: values.name,
            lastname: values.lastname,
            email: values.email,
            document: values.document,
            phone: values.phone,
            password: values.password,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Register failed');
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      setError('Unexpected error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">Register</h1>
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-700 rounded px-3 py-2">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <TextFieldControlled<RegisterFormValues>
              name="name"
              control={control}
              label="Name"
            />
            <TextFieldControlled<RegisterFormValues>
              name="lastname"
              control={control}
              label="Lastname"
            />
          </div>
          <TextFieldControlled<RegisterFormValues>
            name="email"
            control={control}
            label="Email"
            type="email"
          />
          <TextFieldControlled<RegisterFormValues>
            name="document"
            control={control}
            label="Document"
          />
          <TextFieldControlled<RegisterFormValues>
            name="phone"
            control={control}
            label="Phone"
          />
          <div className="grid grid-cols-2 gap-3">
            <PasswordFieldControlled<RegisterFormValues>
              name="password"
              control={control}
              label="Password"
            />
            <PasswordFieldControlled<RegisterFormValues>
              name="confirmPassword"
              control={control}
              label="Confirm password"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 inline-flex justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:bg-slate-600"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

