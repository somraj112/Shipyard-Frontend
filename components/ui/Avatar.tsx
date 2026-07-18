import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizePixels = {
  sm: 28,
  md: 36,
  lg: 48,
};

function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function avatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-fuchsia-500',
    'bg-lime-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({
  src,
  name,
  size = 'md',
  className,
}: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={sizes}
        height={sizes}
        unoptimized
        className={cn(
          'rounded-full object-cover ring-2 ring-white dark:ring-zinc-800',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium text-white ring-2 ring-white dark:ring-zinc-800',
        avatarColor(name),
        sizeClasses[size],
        className
      )}
      title={name}
    >
      {initials(name)}
    </span>
  );
}