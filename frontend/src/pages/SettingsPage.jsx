import React, { useEffect, useState } from "react";
import { User, Shield, Bell, Save, Phone, Building2, Briefcase, Calendar, CheckCircle } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { usersApi } from "../utils/api";

// ── Admin Settings ──────────────────────────────────────────────
function AdminSettings({ user, theme, toggle }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-dark dark:text-white">Settings</h1>
        <p className="text-sm text-muted mt-0.5">Manage your account and preferences</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <span className="text-[10px] capitalize bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium mt-1.5 inline-block">{user?.role}</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              <h3 className="font-semibold text-sm text-dark dark:text-white">Security</h3>
            </div>
            <span className="text-[10px] bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-full font-semibold">Active</span>
          </div>
          <p className="text-sm font-medium text-dark dark:text-white">JWT Authentication</p>
          <p className="text-xs text-muted mt-1">Token-based authentication with 7-day expiry</p>
        </div>
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
            <button onClick={toggle}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${theme === "dark" ? "bg-primary" : "bg-gray-200 dark:bg-white/20"}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Employee Settings ────────────────────────────────────────────
function FormField({ label, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={12} />}{label}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, ...props }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
      className="w-full px-3 py-2.5 text-sm rounded-xl border border-border dark:border-[#1e2535]
        bg-bg dark:bg-white/5 text-dark dark:text-white placeholder:text-muted
        focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
    />
  );
}

function EmployeeSettings({ user, theme, toggle, updateUser }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age || "",
    phone: user?.phone || "",
    department: user?.department || "",
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
    dateOfJoining: user?.dateOfJoining ? user.dateOfJoining.slice(0, 10) : "",
    experienceYears: user?.experienceYears || "",
    experienceType: user?.experienceType || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await usersApi.updateMyProfile({
        name: form.name,
        age: Number(form.age) || undefined,
        phone: form.phone,
        department: form.department,
        dateOfBirth: form.dateOfBirth || undefined,
        dateOfJoining: form.dateOfJoining || undefined,
        experienceYears: Number(form.experienceYears) || undefined,
        experienceType: form.experienceType,
      });
      updateUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-dark dark:text-white">Account Settings</h1>
        <p className="text-sm text-muted mt-0.5">View and update your profile information</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Profile header card */}
        <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-border dark:border-[#1e2535]">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-3xl">{form.name?.[0]?.toUpperCase() || "U"}</span>
            </div>
            <div>
              <p className="font-bold text-dark dark:text-white">{form.name}</p>
              <p className="text-xs text-muted">{user?.email}</p>
              <span className="text-[10px] capitalize bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium mt-1 inline-block">{user?.role}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Full Name" icon={User}>
              <TextInput value={form.name} onChange={(v) => set("name", v)} placeholder="Your full name" />
            </FormField>
            <FormField label="Email Address" icon={User}>
              <TextInput value={user?.email || ""} onChange={() => {}} disabled
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-border dark:border-[#1e2535] bg-bg dark:bg-white/5 text-muted cursor-not-allowed" />
            </FormField>
            <FormField label="Age" icon={User}>
              <TextInput type="number" value={form.age} onChange={(v) => set("age", v)} placeholder="e.g. 28" min="18" max="70" />
            </FormField>
            <FormField label="Phone Number" icon={Phone}>
              <TextInput type="tel" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+1 234 567 8900" />
            </FormField>
            <FormField label="Date of Birth" icon={Calendar}>
              <TextInput type="date" value={form.dateOfBirth} onChange={(v) => set("dateOfBirth", v)} />
            </FormField>
            <FormField label="Date of Joining" icon={Calendar}>
              <TextInput type="date" value={form.dateOfJoining} onChange={(v) => set("dateOfJoining", v)} />
            </FormField>
            <FormField label="Years of Experience" icon={Briefcase}>
              <TextInput type="number" value={form.experienceYears} onChange={(v) => set("experienceYears", v)} placeholder="e.g. 3" min="0" />
            </FormField>
            <FormField label="Department" icon={Building2}>
              <TextInput value={form.department} onChange={(v) => set("department", v)} placeholder="e.g. Sales" />
            </FormField>
            <FormField label="Type of Experience" icon={Briefcase}>
              <TextInput value={form.experienceType} onChange={(v) => set("experienceType", v)} placeholder="e.g. Sales & Customer Support" />
            </FormField>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-primary" />
            <h3 className="font-semibold text-sm text-dark dark:text-white">Appearance</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark dark:text-white">Dark Mode</p>
              <p className="text-xs text-muted mt-0.5">Switch between light and dark theme</p>
            </div>
            <button type="button" onClick={toggle}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${theme === "dark" ? "bg-primary" : "bg-gray-200 dark:bg-white/20"}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button type="submit" disabled={saving}
          className="self-start flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60
            text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/25 transition-all">
          {saved ? <CheckCircle size={15} /> : <Save size={15} />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const { theme, toggle } = useThemeStore();

  if (user?.role === "employee" || user?.role === "manager") {
    return <EmployeeSettings user={user} theme={theme} toggle={toggle} updateUser={updateUser} />;
  }
  return <AdminSettings user={user} theme={theme} toggle={toggle} />;
}
