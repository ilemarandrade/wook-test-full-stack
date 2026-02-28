import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { useTranslation } from 'react-i18next';
import { RegisterFormValues, createRegisterSchema } from '../schemas/authSchemas';
import { TextFieldControlled } from '../components/form/TextFieldControlled';
import { PasswordFieldControlled } from '../components/form/PasswordFieldControlled';
import { Button } from '../components/ui/Button';
import { useRegisterMutation } from '../hooks/api';
import { getApiErrorMessage } from '../config/axiosInstance';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  const registerMutation = useRegisterMutation();
  const registerSchema = useMemo(() => createRegisterSchema(t), [t, i18n.language]);
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
        toast.success(t('register.success'));
      },
      onError: (err) => {
        setError(getApiErrorMessage(err));
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          {t('register.title')}
        </h1>
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
              label={t('register.name')}
              inputFilterType="letters"
            />
            <TextFieldControlled
              name="lastname"
              control={control}
              label={t('register.lastname')}
              inputFilterType="letters"
            />
          </div>
          <TextFieldControlled
            name="email"
            control={control}
            label={t('register.email')}
            type="email"
          />
          <TextFieldControlled
            name="document"
            control={control}
            label={t('register.document')}
            inputFilterType="numbers"
          />
          <TextFieldControlled
            name="phone"
            control={control}
            label={t('register.phone')}
            inputFilterType="numbers"
          />
          <div className="grid grid-cols-2 gap-3">
            <PasswordFieldControlled
              name="password"
              control={control}
              label={t('register.password')}
            />
            <PasswordFieldControlled
              name="confirmPassword"
              control={control}
              label={t('register.confirmPassword')}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || registerMutation.isPending}
            fullWidth
            className="mt-2"
          >
            {isSubmitting || registerMutation.isPending
              ? t('register.submitting')
              : t('register.submit')}
          </Button>
        </form>
        <p className="mt-4 text-sm text-center text-slate-400">
          {t('register.haveAccount')}{' '}
          <Link to="/login" className="font-medium">
            {t('register.goLogin')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

