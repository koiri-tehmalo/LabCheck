import { Badge } from "@/components/ui/badge";
import type { EquipmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CircleCheckBig, TriangleAlert, CircleHelp } from "lucide-react";

type StatusBadgeProps = {
  status: EquipmentStatus;
};

const statusConfig = {
  usable: {
    label: "Usable",
    icon: CircleCheckBig,
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800",
  },
  broken: {
    label: "Broken",
    icon: TriangleAlert,
    className: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800",
  },
  lost: {
    label: "Lost",
    icon: CircleHelp,
    className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("capitalize gap-1.5", config.className)}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </Badge>
  );
}
