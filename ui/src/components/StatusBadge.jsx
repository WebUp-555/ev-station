import { CheckCircle2, AlertCircle, PowerOff } from "lucide-react";

const CONFIG = {
  available: {
    label: "Available",
    icon: CheckCircle2,
    classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  busy: {
    label: "Busy",
    icon: AlertCircle,
    classes: "bg-red-500/15 text-red-400 border-red-500/30",
    dot: "bg-red-400",
  },
  offline: {
    label: "Offline",
    icon: PowerOff,
    classes: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
    dot: "bg-zinc-400",
  },
};

export const StatusBadge = ({ status = "available", showIcon = true, size = "sm" }) => {
  const cfg = CONFIG[status] || CONFIG.available;
  const Icon = cfg.icon;
  const sizeCls = size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs";

  return (
    <span
      data-testid={`status-badge-${status}`}
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${sizeCls} ${cfg.classes}`}
    >
      {showIcon ? (
        <Icon className={size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      )}
      {cfg.label}
    </span>
  );
};

export default StatusBadge;

