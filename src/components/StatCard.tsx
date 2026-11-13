import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent?: boolean;
  warning?: boolean;
}

export default function StatCard({ title, value, subtitle, icon: Icon, accent, warning }: StatCardProps) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
        accent ? 'bg-teal bg-opacity-10' : warning ? 'bg-amber-50' : 'bg-bg'
      }`}>
        <Icon size={18} className={accent ? 'text-teal' : warning ? 'text-amber-600' : 'text-secondary'} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-secondary mb-0.5">{title}</p>
        <p className="text-xl font-semibold text-navy truncate">{value}</p>
        {subtitle && <p className="text-xs text-secondary mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
