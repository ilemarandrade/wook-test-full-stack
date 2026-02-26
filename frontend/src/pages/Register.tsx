import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { RegisterFormValues, registerSchema } from '../schemas/authSchemas';
import { TextFieldControlled } from '../components/form/TextFieldControlled';
import { PasswordFieldControlled } from '../components/form/PasswordFieldControlled';
import { useRegisterMutation } from '../hooks/api';
import { getApiErrorMessage } from '../config/axiosInstance';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const registerMutation = useRegisterMutation();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: joiResolver(registerSchema),
  });

  const onSubmit = (values: RegisterFormValues) => {
    setError(null);
    registerMutation.mutate(values, {
      onSuccess: () => {
        navigate('/login');
      },
      onError: (err) => {
        setError(getApiErrorMessage(err));
      },
    });
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
            <TextFieldControlled
              name="name"
              control={control}
              label="Name"
            />
            <TextFieldControlled
              name="lastname"
              control={control}
              label="Lastname"
            />
          </div>
          <TextFieldControlled
            name="email"
            control={control}
            label="Email"
            type="email"
          />
          <TextFieldControlled
            name="document"
            control={control}
            label="Document"
          />
          <TextFieldControlled
            name="phone"
            control={control}
            label="Phone"
          />
          <div className="grid grid-cols-2 gap-3">
            <PasswordFieldControlled
              name="password"
              control={control}
              label="Password"
            />
            <PasswordFieldControlled
              name="confirmPassword"
              control={control}
              label="Confirm password"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || registerMutation.isPending}
            className="w-full mt-2 inline-flex justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:bg-slate-600"
          >
            {isSubmitting || registerMutation.isPending ? 'Registering...' : 'Register'}
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

