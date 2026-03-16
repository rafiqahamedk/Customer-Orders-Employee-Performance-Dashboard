import React from "react";
import { BarChart2 } from "lucide-react";

export default function EmptyChart({ label = "No data" }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2 text-muted">
      <BarChart2 size={24} className="opacity-30" />
      <p className="text-xs">{label}</p>
    </div>
  );
}
