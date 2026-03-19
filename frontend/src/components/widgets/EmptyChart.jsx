import React from "react";
import { Settings2 } from "lucide-react";

export default function EmptyChart({ label = "Click the settings icon to configure this widget" }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2 text-muted p-4">
      <Settings2 size={22} className="opacity-30" />
      <p className="text-xs text-center">{label}</p>
    </div>
  );
}
