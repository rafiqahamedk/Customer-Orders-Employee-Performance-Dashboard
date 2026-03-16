import React, { useState } from "react";
import { BarChart2, PieChart, TrendingUp, Table2, ArrowRight, Zap, Shield, Globe } from "lucide-react";
import SignInModal from "../components/auth/SignInModal";
import SignUpModal from "../components/auth/SignUpModal";

const FEATURES = [
  { icon: BarChart2, title: "Smart Charts", desc: "Bar, line, area, scatter & pie charts built from your order data in real time." },
  { icon: TrendingUp, title: "KPI Cards", desc: "Track revenue, quantity, and order metrics with configurable KPI widgets." },
  { icon: Table2, title: "Data Tables", desc: "Sortable, filterable tables with pagination to explore every order detail." },
  { icon: PieChart, title: "Drag & Drop", desc: "Build your perfect layout by dragging widgets onto a responsive 12-column grid." },
  { icon: Shield, title: "Role Based", desc: "Admin, Manager, and Employee roles with scoped access to data and actions." },
  { icon: Globe, title: "Responsive", desc: "Fully responsive across desktop, tablet, and mobile — your data anywhere." },
];

const STATS = [
  { value: "7+", label: "Widget Types" },
  { value: "12", label: "Column Grid" },
  { value: "5", label: "Date Filters" },
  { value: "∞", label: "Dashboards" },
];

export default function LandingPage() {
  const [modal, setModal] = useState(null); // "signin" | "signup" | null

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 35%, #0f2d1f 70%, #0f172a 100%)"
    }}>
      {/* Ambient blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #54bd95, transparent 70%)" }} />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #54bd95, transparent 70%)" }} />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Halleyx</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setModal("signin")}
            className="glass-btn-outline text-white text-sm font-medium px-5 py-2 rounded-xl">
            Sign In
          </button>
          <button onClick={() => setModal("signup")}
            className="glass-btn text-white text-sm font-semibold px-5 py-2 rounded-xl">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-20 md:pt-24">
        <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-white/70 font-medium mb-6 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Analytics Dashboard Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight max-w-4xl animate-fade-up"
          style={{ animationDelay: "0.1s" }}>
          Customer Order
          <span className="block bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
            Analytics Dashboard
          </span>
        </h1>

        <p className="mt-6 text-white/60 text-base md:text-lg max-w-2xl leading-relaxed animate-fade-up"
          style={{ animationDelay: "0.2s" }}>
          A dynamic analytics platform that transforms your customer order data into powerful visual insights.
          Manage orders, track purchases, and build custom dashboards with KPI cards, charts, and tables — all in one place.
        </p>

        <div className="flex items-center gap-4 mt-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <button onClick={() => setModal("signup")}
            className="glass-btn text-white font-semibold px-8 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-lg shadow-primary/25">
            Get Started Free <ArrowRight size={16} />
          </button>
          <button onClick={() => setModal("signin")}
            className="glass-btn-outline text-white font-medium px-8 py-3.5 rounded-2xl text-sm">
            Sign In
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full max-w-2xl animate-fade-up" style={{ animationDelay: "0.4s" }}>
          {STATS.map((s) => (
            <div key={s.label} className="glass-card rounded-2xl py-4 px-3 text-center">
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-xs text-white/50 mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Overview */}
      <section className="relative z-10 px-6 md:px-12 py-16 max-w-5xl mx-auto">
        <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
          <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-3">Platform Overview</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Turn Order Data into Visual Intelligence
          </h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
            The Customer Order Analytics Dashboard is a full-stack SaaS platform that lets you create, manage,
            and analyze customer orders in real time. Build personalized dashboards by combining widgets — KPI cards,
            bar charts, line charts, pie charts, scatter plots, area charts, and data tables — all powered by live
            order data. Configure layouts with drag-and-drop, filter by date range, and get instant visual insights
            across any device.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 py-8 pb-20 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2">Features</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Everything you need</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title}
              className="glass-card rounded-2xl p-6 flex flex-col gap-3 hover:scale-[1.02] transition-transform duration-200 cursor-default">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Icon size={18} className="text-primary" />
              </div>
              <p className="text-white font-semibold text-sm">{title}</p>
              <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="relative z-10 px-6 pb-20 text-center">
        <div className="glass-card rounded-3xl p-10 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to get started?</h2>
          <p className="text-white/50 text-sm mb-7">Create your free account and build your first dashboard in minutes.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button onClick={() => setModal("signup")}
              className="glass-btn text-white font-semibold px-8 py-3 rounded-2xl text-sm flex items-center gap-2">
              Create Free Account <ArrowRight size={15} />
            </button>
            <button onClick={() => setModal("signin")}
              className="glass-btn-outline text-white font-medium px-8 py-3 rounded-2xl text-sm">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8 text-white/25 text-xs">
        © 2026 Halleyx · Customer Order Analytics Dashboard
      </footer>

      {/* Modals */}
      {modal === "signin" && (
        <SignInModal onClose={() => setModal(null)} onSwitchToSignUp={() => setModal("signup")} />
      )}
      {modal === "signup" && (
        <SignUpModal onClose={() => setModal(null)} onSwitchToSignIn={() => setModal("signin")} />
      )}
    </div>
  );
}
