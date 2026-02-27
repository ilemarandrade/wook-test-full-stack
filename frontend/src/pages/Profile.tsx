import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useTranslation } from "react-i18next";
import { ProfileFormValues, profileSchema } from "../schemas/authSchemas";
import { TextFieldControlled } from "../components/form/TextFieldControlled";
import { Button } from "../components/ui/Button";
import { useUpdateProfileMutation, useUserInformation } from "../hooks/api";
import { getApiErrorMessage } from "../config/axiosInstance";

const Profile: React.FC = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useUserInformation();
  const updateProfileMutation = useUpdateProfileMutation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: joiResolver(profileSchema),
  });
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name,
      lastname: user.lastname,
      document: user.document,
      phone: user.phone,
    });
  }, [user, reset, login]);

  const profileUser = user;

  const onSubmit = (values: ProfileFormValues) => {
    setError(null);
    if (!profileUser) return;
    updateProfileMutation.mutate(
      {
        ...values,
      },
      {
        onSuccess: (_data, values) => {
          toast.success(t("profile.updated"));
          refetchUser();
        },
        onError: (err) => {
          setError(getApiErrorMessage(err));
        },
      },
    );
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-slate-400">{t("profile.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-slate-900/70 border border-slate-800 rounded-xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">{t("profile.title")}</h1>
        </div>
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
              label={t("profile.name")}
              inputFilterType="letters"
            />
            <TextFieldControlled
              name="lastname"
              control={control}
              label={t("profile.lastname")}
              inputFilterType="letters"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextFieldControlled
              name="document"
              control={control}
              label={t("profile.document")}
              inputFilterType="numbers"
            />
            <TextFieldControlled
              name="phone"
              control={control}
              label={t("profile.phone")}
              inputFilterType="numbers"
            />
          </div>
          <Button
            type="submit"
            disabled={
              isSubmitting || updateProfileMutation.isPending || !isDirty
            }
            fullWidth
            className="mt-2"
          >
            {isSubmitting || updateProfileMutation.isPending
              ? t("profile.saving")
              : t("profile.save")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
