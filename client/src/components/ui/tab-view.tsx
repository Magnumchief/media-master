import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LayoutGrid, ListChecks, ImageIcon } from "lucide-react";

interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface TabViewProps {
  tabs: TabItem[];
  defaultValue?: string;
  children: ReactNode;
  onChange?: (value: string) => void;
  className?: string;
}

export function TabView({
  tabs,
  defaultValue,
  children,
  onChange,
  className,
}: TabViewProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value || "");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>
      <div className="flex flex-wrap items-center border-b">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={cn(
              "tab-button py-4 px-6 font-medium flex items-center",
              activeTab === tab.value ? "active" : ""
            )}
            onClick={() => handleTabChange(tab.value)}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

export const defaultTabs = [
  {
    value: "table",
    label: "Materials Table",
    icon: <ListChecks className="h-5 w-5" />
  },
  {
    value: "board",
    label: "Board View",
    icon: <LayoutGrid className="h-5 w-5" />
  },
  {
    value: "gallery",
    label: "Gallery View",
    icon: <ImageIcon className="h-5 w-5" />
  }
];
