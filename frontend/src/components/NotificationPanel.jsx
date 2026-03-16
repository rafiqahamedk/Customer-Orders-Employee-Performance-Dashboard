import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Bell, X, CheckCheck,
  TrendingDown, TrendingUp, Star, Mail, Lightbulb, Activity,
} from "lucide-react";
import { useNotificationStore } from "../store/useNotificationStore";

const typeIcon = {
  below_target:  <TrendingDown size={15} className="text-red-400" />,
  high_performer:<TrendingUp  size={15} className="text-green-400" />,
  milestone:     <Star        size={15} className="text-yellow-400" />,
  email_sent:    <Mail        size={15} className="text-blue-400" />,
  performance:   <Activity    size={15} className="text-primary" />,
  insight:       <Lightbulb  size={15} className="text-purple-400" />,
};

const typeBg = {
  below_target:  "bg-red-500/10",
  high_performer:"bg-green-500/10",
  milestone:     "bg-yellow-500/10",
  email_sent:    "bg-blue-500/10",
  performance:   "bg-primary/10",
  insight:       "bg-purple-500/10",
};

const typeLabel = {
  below_target:  "Below Target",
  high_performer:"High Performer",
  milestone:     "Milestone",
  email_sent:    "Email Sent",
  performance:   "Performance",
  insight:       "Insight",
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationPanel({ open, onClose }) {
  const { notifications, fetch, markAllRead, markOneRead } = useNotificationStore();
  const panelRef = useRef(null);

  useEffect(() => { if (open) fetch(); }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    // slight delay so the open-click doesn't immediately close
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [open, onClose]);

  const unread = notifications.filter((n) => !n.read).length;

  const panel = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-[60] transition-opacity duration-300
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 bottom-0 z-[70] w-[380px] max-w-[95vw]
          flex flex-col bg-white dark:bg-[#161b27]
          border-l border-border dark:border-[#1e2535] shadow-2xl
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-[#1e2535] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell size={15} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm text-dark dark:text-white">Notifications</p>
              <p className="text-[10px] text-muted">{unread} unread</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors
                  px-2.5 py-1.5 rounded-lg hover:bg-primary/10"
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-muted
                hover:bg-bg dark:hover:bg-white/10 transition-colors ml-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Bell size={24} className="text-primary/50" />
              </div>
              <p className="text-sm font-medium text-dark dark:text-white">All caught up</p>
              <p className="text-xs text-muted">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border dark:divide-[#1e2535]">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.read && markOneRead(n._id)}
                  className={`flex gap-3 px-5 py-4 cursor-pointer transition-colors
                    ${n.read
                      ? "opacity-55"
                      : "hover:bg-bg dark:hover:bg-white/5"
                    }`}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5
                    ${typeBg[n.type] || "bg-gray-100 dark:bg-white/5"}`}>
                    {typeIcon[n.type] || <Lightbulb size={15} className="text-muted" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-dark dark:text-slate-200 leading-relaxed">{n.message}</p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium
                        ${typeBg[n.type] || "bg-gray-100 dark:bg-white/5"}
                        ${n.type === "below_target" ? "text-red-500" :
                          n.type === "high_performer" ? "text-green-500" :
                          n.type === "milestone" ? "text-yellow-600" :
                          n.type === "email_sent" ? "text-blue-500" :
                          n.type === "performance" ? "text-primary" :
                          "text-purple-500"}`}>
                        {typeLabel[n.type] || "Insight"}
                      </span>
                      <span className="text-[10px] text-muted">{timeAgo(n.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border dark:border-[#1e2535] flex-shrink-0">
          <p className="text-[10px] text-muted text-center">
            Performance insights refresh every 24 hours
          </p>
        </div>
      </div>
    </>
  );

  return createPortal(panel, document.body);
}
