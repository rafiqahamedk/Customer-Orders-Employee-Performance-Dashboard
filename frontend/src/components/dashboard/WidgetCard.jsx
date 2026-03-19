import React from "react";
import { Settings2, Trash2, GripHorizontal } from "lucide-react";
import WidgetRenderer from "../widgets/WidgetRenderer";

export default function WidgetCard({ widget, isActive, onConfigure, onDelete, editable = true }) {
  // Prevent react-grid-layout from capturing button clicks
  const stopDrag = (e) => e.stopPropagation();

  return (
    <div
      className={[
        "h-full flex flex-col bg-white dark:bg-[#161b27] rounded-2xl border overflow-hidden transition-all duration-150 group",
        isActive
          ? "border-primary shadow-lg shadow-primary/15"
          : "border-border dark:border-[#1e2535] shadow-card",
      ].join(" ")}
    >
      {/* Header / drag handle */}
      <div className="drag-handle flex items-center gap-2 px-3 py-2 bg-bg dark:bg-white/5 border-b border-border dark:border-[#1e2535] cursor-grab active:cursor-grabbing flex-shrink-0">
        <GripHorizontal size={13} className="text-muted/50 shrink-0" />
        <span className="text-xs font-semibold text-dark/70 dark:text-white/70 flex-1 truncate">
          {widget.title || "Untitled"}
        </span>

        {editable && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onMouseDown={stopDrag}
              onClick={(e) => { e.stopPropagation(); onConfigure?.(widget.id || widget._tempId); }}
              className="w-6 h-6 rounded-lg bg-white dark:bg-white/10 border border-border dark:border-[#1e2535] flex items-center justify-center text-muted hover:bg-primary hover:text-white hover:border-primary transition-all"
              title="Configure"
            >
              <Settings2 size={11} />
            </button>
            <button
              onMouseDown={stopDrag}
              onClick={(e) => { e.stopPropagation(); onDelete?.(widget.id || widget._tempId); }}
              className="w-6 h-6 rounded-lg bg-white dark:bg-white/10 border border-border dark:border-[#1e2535] flex items-center justify-center text-muted hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
              title="Delete"
            >
              <Trash2 size={11} />
            </button>
          </div>
        )}
      </div>

      {/* Widget content */}
      <div className="flex-1 overflow-hidden p-2 min-h-0">
        <WidgetRenderer widget={widget} />
      </div>
    </div>
  );
}
