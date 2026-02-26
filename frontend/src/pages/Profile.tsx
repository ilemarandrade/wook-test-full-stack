import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
/// <reference types="vite/client" />

const API_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

const Profile: React.FC = () => {
  const { user, token, logout, login } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [lastname, setLastname] = useState(user?.lastname ?? '');
  const [document, setDocument] = useState(user?.document ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [lang, setLang] = useState(user?.lang ?? 'en');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !token) return;

    setName(user.name);
    setLastname(user.lastname);
    setDocument(user.document);
    setPhone(user.phone);
    setLang(user.lang ?? 'en');
  }, [user, token]);

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/update_user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          lang,
        },
        body: JSON.stringify({
          user: {
            name,
            lastname,
            document,
            phone,
            lang,
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
          name,
          lastname,
          document,
          phone,
          lang,
        });
      }
    } catch (err) {
      console.error(err);
      setError('Unexpected error');
    } finally {
      setLoading(false);
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
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="lastname">
                Lastname
              </label>
              <input
                id="lastname"
                className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1" htmlFor="document">
                Document
              </label>
              <input
                id="document"
                className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="lang">
              Language
            </label>
            <select
              id="lang"
              className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={lang ?? 'en'}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:bg-slate-600"
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

