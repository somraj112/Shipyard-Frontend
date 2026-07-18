import { cn } from '@/lib/utils';

type BadgeVariant = 'neutral' | 'blue' | 'amber' | 'green' | 'purple' | 'red';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  purple: 'bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  red: 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

export default function Badge({
  children,
  variant = 'neutral',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}