import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { STORAGE_LANG_KEY } from '../i18n/config';

const LANG_OPTIONS: Array<{ value: 'es' | 'en' }> = [
  { value: 'es' },
  { value: 'en' },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const { user } = useAuth();
  const currentLang = (i18n.language === 'en' || i18n.language === 'es') ? i18n.language : 'es';

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLang = event.target.value === 'en' ? 'en' : 'es';
    i18n.changeLanguage(nextLang).catch(() => {});
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_LANG_KEY, nextLang);
    }
    if (user) {
      authService
        .updateProfile({ lang: nextLang })
        .then(() => {
        })
        .catch(() => {});
    }
  };

  return (
    <select
      value={currentLang}
      onChange={handleChange}
      className="rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-xs"
    >
      {LANG_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {t(`language.${opt.value}`)}
        </option>
      ))}
    </select>
  );
};

