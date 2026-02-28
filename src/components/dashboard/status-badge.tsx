import type { EquipmentStatus } from "@/lib/types";

const STATUS_CONFIG: Record<EquipmentStatus, {
  label: string;
  bgClass: string;
  textClass: string;
  glowClass: string;
}> = {
  USABLE: {
    label: 'ใช้งานได้',
    bgClass: 'bg-emerald-500/15',
    textClass: 'text-emerald-400',
    glowClass: 'glow-green',
  },
  BROKEN: {
    label: 'ชำรุด',
    bgClass: 'bg-amber-500/15',
    textClass: 'text-amber-400',
    glowClass: 'glow-orange',
  },
  LOST: {
    label: 'สูญหาย',
    bgClass: 'bg-rose-500/15',
    textClass: 'text-rose-400',
    glowClass: 'glow-red',
  },
};

export function StatusBadge({ status }: { status: EquipmentStatus | null }) {
  if (!status) return null;
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgClass} ${config.textClass} ${config.glowClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.textClass.replace('text-', 'bg-')} mr-1.5 animate-glow-pulse`} />
      {config.label}
    </span>
  );
}
