import React, { useState } from "react";
import { Settings2, Trash2, GripHorizontal } from "lucide-react";
import WidgetRenderer from "../widgets/WidgetRenderer";

export default function WidgetCard({ widget, orders, isActive, onSettings, onDelete }) {
  const [hovered, setHovered] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete widget "${widget.title}"?`)) onDelete();
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        "h-full flex flex-col bg-white dark:bg-[#161b27] rounded-2xl border overflow-hidden transition-all duration-150",
        isActive ? "border-primary shadow-lg shadow-primary/15" : "border-border dark:border-[#1e2535] shadow-card",
        hovered ? "shadow-panel" : "",
      ].join(" ")}
    >
      <div className="drag-handle flex items-center gap-2 px-3 py-2 bg-bg dark:bg-white/5 border-b border-border dark:border-[#1e2535] cursor-grab active:cursor-grabbing flex-shrink-0">
        <GripHorizontal size={13} className="text-muted/50" />
        <span className="text-xs font-semibold text-dark/70 dark:text-white/70 flex-1 truncate">{widget.title}</span>
        {hovered && (
          <div className="flex items-center gap-1">
            <button
              onClick={onSettings}
              className="w-6 h-6 rounded-lg bg-white dark:bg-white/10 border border-border dark:border-[#1e2535] flex items-center justify-center text-muted hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              <Settings2 size={11} />
            </button>
            <button
              onClick={handleDelete}
              className="w-6 h-6 rounded-lg bg-white dark:bg-white/10 border border-border dark:border-[#1e2535] flex items-center justify-center text-muted hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
            >
              <Trash2 size={11} />
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden p-2">
        <WidgetRenderer widget={widget} orders={orders} />
      </div>
    </div>
  );
}
