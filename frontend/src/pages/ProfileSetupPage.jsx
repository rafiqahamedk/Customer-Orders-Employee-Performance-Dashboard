import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, User, Calendar, Briefcase, Phone, Building2, CheckCircle } from "lucide-react";
import { usersApi } from "../utils/api";
import { useAuthStore } from "../store/useAuthStore";

function Field({ label, children, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/60 uppercase tracking-wider">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function Input({ icon: Icon, ...props }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white/5 border border-white/10 focus-within:border-primary/50 transition-colors">
      {Icon && <Icon size={15} className="text-white/40 flex-shrink-0" />}
      <input
        {...props}
        className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
      />
    </div>
  );
}

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();
  const [form, setForm] = useState({
    age: "", dateOfBirth: "", dateOfJoining: "", experienceYears: "",
    experienceType: "", department: "", phone: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.age) e.age = "Required";
    if (!form.dateOfBirth) e.dateOfBirth = "Required";
    if (!form.dateOfJoining) e.dateOfJoining = "Required";
    if (!form.experienceYears) e.experienceYears = "Required";
    if (!form.experienceType) e.experienceType = "Required";
    if (!form.department) e.department = "Required";
    if (!form.phone) e.phone = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setApiError("");
    try {
      const updated = await usersApi.updateMyProfile({
        age: Number(form.age),
        dateOfBirth: form.dateOfBirth,
        dateOfJoining: form.dateOfJoining,
        experienceYears: Number(form.experienceYears),
        experienceType: form.experienceType,
        department: form.department,
        phone: form.phone,
      });
      updateUser(updated);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to save profile");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1117 50%, #0a0f1e 100%)" }}>
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">Complete Your Profile</p>
            <p className="text-white/40 text-xs">Help your admin know you better</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}
          className="rounded-2xl p-6 flex flex-col gap-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Age" error={errors.age}>
              <Input icon={User} type="number" placeholder="e.g. 28" value={form.age} onChange={(e) => set("age", e.target.value)} min="18" max="70" />
            </Field>
            <Field label="Phone Number" error={errors.phone}>
              <Input icon={Phone} type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of Birth" error={errors.dateOfBirth}>
              <Input icon={Calendar} type="date" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
            </Field>
            <Field label="Date of Joining" error={errors.dateOfJoining}>
              <Input icon={Calendar} type="date" value={form.dateOfJoining} onChange={(e) => set("dateOfJoining", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Years of Experience" error={errors.experienceYears}>
              <Input icon={Briefcase} type="number" placeholder="e.g. 3" value={form.experienceYears} onChange={(e) => set("experienceYears", e.target.value)} min="0" max="50" />
            </Field>
            <Field label="Department" error={errors.department}>
              <Input icon={Building2} type="text" placeholder="e.g. Sales" value={form.department} onChange={(e) => set("department", e.target.value)} />
            </Field>
          </div>

          <Field label="Type of Experience" error={errors.experienceType}>
            <Input icon={Briefcase} type="text" placeholder="e.g. Sales & Customer Support" value={form.experienceType} onChange={(e) => set("experienceType", e.target.value)} />
          </Field>

          {apiError && <p className="text-xs text-red-400 text-center">{apiError}</p>}

          <button type="submit" disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-dark
              disabled:opacity-60 text-white font-semibold text-sm transition-all shadow-lg shadow-primary/25 mt-1">
            <CheckCircle size={15} />
            {saving ? "Saving..." : "Complete Setup"}
          </button>

          <button type="button" onClick={() => navigate("/dashboard")}
            className="text-center text-xs text-white/30 hover:text-white/60 transition-colors">
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}
