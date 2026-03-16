import React, { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, Users, Settings,
  Zap, LogOut, Bell, Sun, Moon,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useNotificationStore } from "../store/useNotificationStore";
import NotificationPanel from "./NotificationPanel";

const adminNav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/employees", icon: Users, label: "Employees" },
  { to: "/orders", icon: ShoppingCart, label: "Customer Orders" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const employeeNav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/orders", icon: ShoppingCart, label: "Customer Orders" },
];

function NavTooltip({ label }) {
  return (
    <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1e2535] text-white text-xs rounded-lg
      whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none
      transition-opacity duration-150 z-[60] shadow-lg">
      {label}
    </span>
  );
}

export default function Layout() {
  const [expanded, setExpanded] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const { notifications, fetch } = useNotificationStore();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const navLinks = isAdmin ? adminNav : employeeNav;
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => { fetch(); }, []);
  const handleSignOut = () => { signOut(); navigate("/"); };

  return (
    <div className="flex min-h-screen bg-bg dark:bg-[#0d1117]">

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col
          bg-dark dark:bg-[#0b0f1a] border-r border-white/5
          transition-[width] duration-300 ease-in-out overflow-hidden
          ${expanded ? "w-60" : "w-[72px]"}`}
      >
        {/* Logo — clicking toggles sidebar */}
        <div className="flex items-center h-14 border-b border-white/10 flex-shrink-0 px-3 gap-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg flex-shrink-0
              hover:bg-primary-dark transition-colors cursor-pointer"
            aria-label="Toggle sidebar"
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Zap size={18} className="text-white" />
          </button>

          {/* Brand text — only when expanded */}
          <div className={`flex-1 min-w-0 overflow-hidden transition-all duration-300 ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
            <p className="text-white font-bold text-sm leading-tight whitespace-nowrap">Halleyx</p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest whitespace-nowrap">Analytics</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 p-2 flex-1 mt-1 overflow-visible">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) =>
                `relative group flex items-center rounded-xl text-sm font-medium
                 transition-all duration-150
                 ${expanded ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5 w-full"}
                 ${isActive
                   ? "bg-primary text-white shadow-md shadow-primary/30"
                   : "text-white/50 hover:text-white hover:bg-white/10"}`
              }
            >
              <Icon size={17} className="flex-shrink-0" />
              {expanded
                ? <span className="whitespace-nowrap overflow-hidden">{label}</span>
                : <NavTooltip label={label} />
              }
            </NavLink>
          ))}
        </nav>

        {/* Footer profile */}
        <div className={`border-t border-white/10 flex-shrink-0 ${expanded ? "p-3" : "p-2"}`}>
          <div
            className={`flex items-center rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors
              ${expanded ? "gap-2.5 px-2 py-2" : "justify-center py-2"}`}
            onClick={() => navigate("/settings")}
            title={!expanded ? user?.name : undefined}
          >
            <div className="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-xs font-bold">{user?.name?.[0]?.toUpperCase() || "U"}</span>
            </div>
            {expanded && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-white text-xs font-medium truncate">{user?.name}</p>
                <p className="text-white/40 text-[10px] capitalize">{user?.role}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className={`flex-1 flex flex-col min-w-0 transition-[margin-left] duration-300 ease-in-out
        ${expanded ? "ml-60" : "ml-[72px]"}`}>

        {/* Topbar */}
        <header className="h-14 bg-white dark:bg-[#161b27] border-b border-border dark:border-[#1e2535]
          flex items-center px-4 gap-3 sticky top-0 z-40 shadow-sm">

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            {/* Dark mode */}
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-xl border border-border dark:border-[#1e2535] flex items-center justify-center
                text-muted hover:bg-bg dark:hover:bg-white/10 transition-all"
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun size={15} className="text-yellow-400" /> : <Moon size={15} />}
            </button>

            {/* Bell — opens full-height panel */}
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative w-8 h-8 rounded-xl border border-border dark:border-[#1e2535] flex items-center justify-center
                text-muted hover:bg-bg dark:hover:bg-white/10 transition-all"
            >
              <Bell size={15} />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>

            {/* Profile chip */}
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg dark:bg-white/5
                border border-border dark:border-[#1e2535] hover:border-primary/40 hover:bg-primary/5 transition-all"
              title="Settings"
            >
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-[10px] font-bold">{user?.name?.[0]?.toUpperCase() || "U"}</span>
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-xs font-medium text-dark dark:text-slate-200">{user?.name}</span>
                <span className="text-[10px] text-muted capitalize">{user?.role}</span>
              </div>
            </button>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="w-8 h-8 rounded-xl border border-border dark:border-[#1e2535] flex items-center justify-center
                text-muted hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* ── Full-height notification panel ── */}
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
