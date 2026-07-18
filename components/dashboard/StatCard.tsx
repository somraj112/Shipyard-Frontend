import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, hint, icon }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
          {hint && (
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">{hint}</p>
          )}
        </div>
        {icon && (
          <span className={cn('rounded-lg p-2 text-[var(--muted-foreground)]')}>
            {icon}
          </span>
        )}
      </div>
    </Card>
  );
}
