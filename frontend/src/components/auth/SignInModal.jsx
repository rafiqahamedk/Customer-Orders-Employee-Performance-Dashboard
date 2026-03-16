import React, { useState } from "react";
import { X, Mail, Lock, Eye, EyeOff, Zap } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function SignInModal({ onClose, onSwitchToSignUp }) {
  const navigate = useNavigate();
  const { signIn, loading } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Please fill the field";
    if (!form.password) e.password = "Please fill the field";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setApiError("");
    const result = await signIn(form.email, form.password);
    if (result.success) {
      onClose();
      navigate("/dashboard");
    } else {
      setApiError(result.error || "Sign in failed");
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <ModalHeader title="Welcome back" sub="Sign in to your account" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
        <GlassField icon={Mail} type="email" placeholder="Email address"
          value={form.email} onChange={(v) => set("email", v)} error={errors.email} />
        <GlassField icon={Lock} type={showPw ? "text" : "password"} placeholder="Password"
          value={form.password} onChange={(v) => set("password", v)} error={errors.password}
          suffix={
            <button type="button" onClick={() => setShowPw(!showPw)} className="text-white/40 hover:text-white/80 transition-colors">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          } />
        <div className="text-right -mt-1">
          <button type="button" className="text-xs text-primary hover:text-primary-dark transition-colors">
            Forgot Password?
          </button>
        </div>
        {apiError && <p className="text-xs text-red-400 text-center -mt-1">{apiError}</p>}
        <button type="submit" disabled={loading}
          className="glass-btn w-full py-3 rounded-xl text-white font-semibold text-sm mt-1 disabled:opacity-60">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="text-center text-xs text-white/40 mt-5">
        Don't have an account?{" "}
        <button onClick={onSwitchToSignUp} className="text-primary hover:underline font-medium">Sign Up</button>
      </p>
    </ModalShell>
  );
}

export function ModalShell({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(10,15,30,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass-card rounded-3xl w-full max-w-md p-8 relative animate-fade-up shadow-modal">
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <X size={15} />
        </button>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Zap size={13} className="text-white" />
          </div>
          <span className="text-white/60 text-xs font-semibold tracking-widest uppercase">Halleyx</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, sub }) {
  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="text-white/45 text-sm mt-1">{sub}</p>
    </div>
  );
}

export function GlassField({ icon: Icon, suffix, error, onChange, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`flex items-center gap-3 glass-input rounded-xl px-4 py-3 transition-all ${error ? "border-red-400/60" : ""}`}>
        {Icon && <Icon size={15} className="text-white/40 flex-shrink-0" />}
        <input
          {...props}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white placeholder-white/35 outline-none"
        />
        {suffix}
      </div>
      {error && <p className="text-xs text-red-400 pl-1">{error}</p>}
    </div>
  );
}
