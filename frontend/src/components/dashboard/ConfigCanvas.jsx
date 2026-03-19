import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import WidgetCard from "./WidgetCard";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGrid = WidthProvider(Responsive);

export default function ConfigCanvas({
  widgets = [],
  editable = false,
  onLayoutChange,
  onConfigure,
  onDelete,
}) {
  const generateLayouts = () => {
    const items = widgets.map((w) => ({
      i: w.id || w._tempId,
      x: w.grid_x ?? w.layout?.x ?? 0,
      y: w.grid_y ?? w.layout?.y ?? 0,
      w: w.grid_w ?? w.layout?.w ?? 4,
      h: w.grid_h ?? w.layout?.h ?? 4,
      minW: 1,
      minH: 2,
    }));
    return { lg: items, md: items, sm: items };
  };

  const handleLayoutChange = (layout) => {
    if (onLayoutChange && editable) {
      onLayoutChange(layout);
    }
  };

  return (
    <div className="min-h-[400px]">
      <ResponsiveGrid
        className="layout"
        layouts={generateLayouts()}
        breakpoints={{ lg: 1024, md: 768, sm: 0 }}
        cols={{ lg: 12, md: 8, sm: 4 }}
        rowHeight={60}
        isDraggable={editable}
        isResizable={editable}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        compactType="vertical"
        margin={[12, 12]}
        containerPadding={[12, 12]}
        useCSSTransforms
      >
        {widgets.map((widget) => (
          <div key={widget.id || widget._tempId}>
            <WidgetCard
              widget={widget}
              editable={editable}
              onConfigure={onConfigure}
              onDelete={onDelete}
            />
          </div>
        ))}
      </ResponsiveGrid>
    </div>
  );
}
