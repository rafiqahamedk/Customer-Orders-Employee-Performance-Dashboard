import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useDashboardStore } from "../../store/useDashboardStore";
import { useOrderStore } from "../../store/useOrderStore";
import WidgetCard from "./WidgetCard";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGrid = WidthProvider(Responsive);
const BREAKPOINTS = { lg: 1200, md: 768, sm: 0 };
const COLS = { lg: 12, md: 8, sm: 4 };

export default function ConfigCanvas({ onSelectWidget, activeWidgetId }) {
  const { widgets, addWidget, updateWidgetLayout, deleteWidget } = useDashboardStore();
  const { orders } = useOrderStore();

  const layouts = {
    lg: widgets.map((w) => ({ i: w.id, x: w.layout.x, y: w.layout.y, w: Math.min(w.layout.w, 12), h: w.layout.h, minW: 1, minH: 1 })),
    md: widgets.map((w) => ({ i: w.id, x: Math.min(w.layout.x, 7), y: w.layout.y, w: Math.min(w.layout.w, 8), h: w.layout.h, minW: 1, minH: 1 })),
    sm: widgets.map((w) => ({ i: w.id, x: 0, y: w.layout.y, w: Math.min(w.layout.w, 4), h: w.layout.h, minW: 1, minH: 1 })),
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("widgetType");
    if (type) addWidget(type);
  };

  const handleLayoutChange = (_, allLayouts) => {
    const lgLayout = allLayouts.lg || [];
    updateWidgetLayout(lgLayout);
  };

  return (
    <div
      className="flex-1 bg-white dark:bg-[#161b27] border border-border dark:border-[#1e2535] rounded-2xl overflow-y-auto scrollbar-thin relative min-h-0"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {widgets.length === 0 && (
        <div className="absolute inset-4 flex flex-col items-center justify-center border-2 border-dashed border-border dark:border-[#1e2535] rounded-xl pointer-events-none gap-2">
          <p className="text-sm text-muted font-medium">Drag & drop widgets here</p>
          <p className="text-xs text-muted/60">Or click a widget from the panel on the left</p>
        </div>
      )}
      <ResponsiveGrid
        layouts={layouts}
        breakpoints={BREAKPOINTS}
        cols={COLS}
        rowHeight={80}
        isDraggable
        isResizable
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
      >
        {widgets.map((w) => (
          <div key={w.id}>
            <WidgetCard
              widget={w}
              orders={orders}
              isActive={activeWidgetId === w.id}
              onSettings={() => onSelectWidget(w)}
              onDelete={() => deleteWidget(w.id)}
            />
          </div>
        ))}
      </ResponsiveGrid>
    </div>
  );
}
