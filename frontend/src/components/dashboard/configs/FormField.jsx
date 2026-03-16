import React from "react";

export function Field({ label, children, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-dark/80 dark:text-white/70">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 text-sm bg-bg dark:bg-white/5 border border-border dark:border-[#1e2535] rounded-lg outline-none
        text-dark dark:text-white placeholder:text-muted
        focus:border-primary focus:bg-white dark:focus:bg-white/10 transition-colors
        read-only:opacity-60 read-only:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}

export function Select({ children, className = "", ...props }) {
  return (
    <select
      className={`w-full px-3 py-2 text-sm bg-bg dark:bg-[#0d1117] border border-border dark:border-[#1e2535] rounded-lg outline-none
        text-dark dark:text-white focus:border-primary transition-colors cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full px-3 py-2 text-sm bg-bg dark:bg-white/5 border border-border dark:border-[#1e2535] rounded-lg outline-none
        text-dark dark:text-white focus:border-primary dark:focus:bg-white/10 transition-colors resize-none min-h-[64px] ${className}`}
      {...props}
    />
  );
}

export function SectionTitle({ children }) {
  return (
    <p className="text-[10px] font-bold text-muted uppercase tracking-widest pt-2 border-t border-border dark:border-[#1e2535]">
      {children}
    </p>
  );
}
