import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AuthProvider, useAuth } from "./context/AuthContext";
import AppRoutes from "./Routes";
import { Button } from "./components/ui/Button";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="text-sm font-semibold">
            {t("layout.title")}
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <nav className="flex gap-4 items-center">
              {user ? (
                <>
                  {user.role === "ADMIN" && (
                    <Link to="/user-list">{t("layout.users")}</Link>
                  )}
                  <Link to="/profile">{t("layout.profile")}</Link>
                  <Button type="button" onClick={logout} variant="ghostDanger">
                    {t("layout.logout")}
                  </Button>
                </>
              ) : (
                <></>
              )}
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Layout>
        <AppRoutes />
      </Layout>
    </AuthProvider>
  );
};

export default App;
