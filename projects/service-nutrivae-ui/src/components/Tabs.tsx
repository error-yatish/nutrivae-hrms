import { clsx } from "clsx";
import type { ReactNode } from "react";

export type TabItem<T extends string> = {
  id: T;
  label: string;
  icon?: ReactNode;
  count?: number;
};

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  ariaLabel = "Sections"
}: {
  items: Array<TabItem<T>>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div className="scrollbar-none overflow-x-auto">
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex min-w-max gap-1 rounded-xl border border-line bg-base-200 p-1"
      >
        {items.map((item) => {
          const active = item.id === value;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(item.id)}
              className={clsx(
                "flex min-h-10 items-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition",
                active
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-muted hover:bg-base-100 hover:text-base-content"
              )}
            >
              {item.icon}
              {item.label}
              {item.count !== undefined && (
                <span
                  className={clsx(
                    "rounded-full px-1.5 py-0.5 text-[10px]",
                    active ? "bg-white/15" : "bg-base-300"
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
