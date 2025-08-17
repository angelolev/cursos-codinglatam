import { Crown, Gift } from "lucide-react";
import { FilterConfig, FilterValue } from "@/utils/filterTypes";

interface FilterButtonsProps {
  config: FilterConfig;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  className?: string;
}

// Map icon names to actual components
const ICON_MAP = {
  gift: <Gift className="h-4 w-4 mr-1" />,
  crown: <Crown className="h-4 w-4 mr-1" />,
};

export default function FilterButtons({
  config,
  value,
  onChange,
  className = "",
}: FilterButtonsProps) {
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    return ICON_MAP[iconName as keyof typeof ICON_MAP] || null;
  };

  return (
    <div className={`flex justify-center space-x-2 ${className}`}>
      {config.buttons.map((button) => {
        const isActive = value === button.value;
        const colorClass = isActive
          ? button.colorClass.active
          : button.colorClass.inactive;

        return (
          <button
            key={button.value}
            onClick={() => onChange(button.value)}
            className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center cursor-pointer ${colorClass}`}
          >
            {getIcon(button.icon as string)}
            {button.label}
          </button>
        );
      })}
    </div>
  );
}
