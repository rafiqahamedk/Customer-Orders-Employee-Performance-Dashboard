import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { ModalShell, ModalHeader, GlassField } from "./SignInModal";

const ROLES = ["Admin", "Employee", "Manager"];

export default function SignUpModal({ onClose, onSwitchToSignIn }) {
  const navigate = useNavigate();
  const { signUp, loading } = useAuthStore();
  const [form, setForm] = useState({ name: "", role: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Please fill the field";
    if (!form.role) e.role = "Please select a role";
    if (!form.email) e.email = "Please fill the field";
    if (!form.password) e.password = "Please fill the field";
    if (!form.confirm) e.confirm = "Please fill the field";
    if (form.password && form.confirm && form.password !== form.confirm)
      e.confirm = "Passwords do not match";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setApiError("");
    const result = await signUp({ name: form.name, role: form.role, email: form.email, password: form.password });
    if (result.success) {
      onClose();
      const role = form.role.toLowerCase();
      navigate(role === "employee" ? "/profile-setup" : "/dashboard");
    } else {
      setApiError(result.error || "Registration failed");
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <ModalHeader title="Create account" sub="Join Halleyx and start building dashboards" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-6">
        <GlassField icon={User} type="text" placeholder="Full name"
          value={form.name} onChange={(v) => set("name", v)} error={errors.name} />

        <div className="flex flex-col gap-1.5">
          <div className={`flex items-center gap-3 glass-input rounded-xl px-4 py-3 ${errors.role ? "border-red-400/60" : ""}`}>
            <ChevronDown size={15} className="text-white/40 flex-shrink-0" />
            <select
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none cursor-pointer appearance-none"
              style={{ color: form.role ? "white" : "rgba(255,255,255,0.35)" }}
            >
              <option value="" disabled style={{ background: "#1e1b4b", color: "#94a3b8" }}>Type of user</option>
              {ROLES.map((r) => (
                <option key={r} value={r} style={{ background: "#1e1b4b", color: "white" }}>{r}</option>
              ))}
            </select>
          </div>
          {errors.role && <p className="text-xs text-red-400 pl-1">{errors.role}</p>}
        </div>

        <GlassField icon={Mail} type="email" placeholder="Email address"
          value={form.email} onChange={(v) => set("email", v)} error={errors.email} />

        <GlassField icon={Lock} type={showPw ? "text" : "password"} placeholder="Password"
          value={form.password} onChange={(v) => set("password", v)} error={errors.password}
          suffix={
            <button type="button" onClick={() => setShowPw(!showPw)} className="text-white/40 hover:text-white/80 transition-colors">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          } />

        <GlassField icon={Lock} type={showCp ? "text" : "password"} placeholder="Confirm password"
          value={form.confirm} onChange={(v) => set("confirm", v)} error={errors.confirm}
          suffix={
            <button type="button" onClick={() => setShowCp(!showCp)} className="text-white/40 hover:text-white/80 transition-colors">
              {showCp ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          } />

        {apiError && <p className="text-xs text-red-400 text-center">{apiError}</p>}

        <button type="submit" disabled={loading}
          className="glass-btn w-full py-3 rounded-xl text-white font-semibold text-sm mt-1 disabled:opacity-60">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="text-center text-xs text-white/40 mt-5">
        Already have an account?{" "}
        <button onClick={onSwitchToSignIn} className="text-primary hover:underline font-medium">Sign In</button>
      </p>
    </ModalShell>
  );
}
