import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { ProfileFormValues, profileSchema } from '../schemas/authSchemas';
import { TextFieldControlled } from '../components/form/TextFieldControlled';
/// <reference types="vite/client" />

const API_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

const Profile: React.FC = () => {
  const { user, token, logout, login } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {  isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: joiResolver(profileSchema),
  
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name,
      lastname: user.lastname,
      document: user.document,
      phone: user.phone,
      lang: user.lang ?? 'en',
    });
  }, [user, reset]);

  if (!user) {
    return null;
  }

  const onSubmit = async (values: ProfileFormValues) => {
    setError(null);
    setMessage(null);

    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/update_user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          lang: values.lang,
        },
        body: JSON.stringify({
          user: {
            name: values.name,
            lastname: values.lastname,
            document: values.document,
            phone: values.phone,
            lang: values.lang,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Update failed');
      } else {
        setMessage(data.message || 'Profile updated');
        login(token, {
          ...user,
          name: values.name,
          lastname: values.lastname,
          document: values.document,
          phone: values.phone,
          lang: values.lang,
        });
      }
    } catch (err) {
      console.error(err);
      setError('Unexpected error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-slate-900/70 border border-slate-800 rounded-xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <button
            onClick={logout}
            className="text-sm text-red-300 hover:text-red-200"
          >
            Logout
          </button>
        </div>
        {message && (
          <div className="mb-4 text-sm text-emerald-300 bg-emerald-900/30 border border-emerald-700 rounded px-3 py-2">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-700 rounded px-3 py-2">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <TextFieldControlled<ProfileFormValues>
              name="name"
              control={control}
              label="Name"
            />
            <TextFieldControlled<ProfileFormValues>
              name="lastname"
              control={control}
              label="Lastname"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextFieldControlled<ProfileFormValues>
              name="document"
              control={control}
              label="Document"
            />
            <TextFieldControlled<ProfileFormValues>
              name="phone"
              control={control}
              label="Phone"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="lang">
              Language
            </label>
            <select
              id="lang"
              className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              {...register('lang')}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 inline-flex justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:bg-slate-600"
          >
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

