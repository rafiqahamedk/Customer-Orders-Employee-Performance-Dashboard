import React from "react";
import { User, Shield, Bell } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, toggle } = useThemeStore();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-dark dark:text-white">Settings</h1>
        <p className="text-sm text-muted mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Two-column responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Profile card */}
        <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-5">
            <User size={16} className="text-primary" />
            <h3 className="font-semibold text-sm text-dark dark:text-white">Profile</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-3xl">{user?.name?.[0]?.toUpperCase() || "U"}</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-dark dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-muted mt-0.5 truncate">{user?.email}</p>
              <span className="text-[10px] capitalize bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium mt-1.5 inline-block">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Security card */}
        <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              <h3 className="font-semibold text-sm text-dark dark:text-white">Security</h3>
            </div>
            <span className="text-[10px] bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-full font-semibold">
              Active
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-dark dark:text-white">JWT Authentication</p>
            <p className="text-xs text-muted mt-1">Token-based authentication with 7-day expiry</p>
          </div>
        </div>

        {/* Appearance card */}
        <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-primary" />
            <h3 className="font-semibold text-sm text-dark dark:text-white">Appearance</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark dark:text-white">Dark Mode</p>
              <p className="text-xs text-muted mt-0.5">Switch between light and dark theme</p>
            </div>
            <button
              onClick={toggle}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${theme === "dark" ? "bg-primary" : "bg-gray-200 dark:bg-white/20"}`}
              aria-label="Toggle dark mode"
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
