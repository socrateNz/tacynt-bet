import Image from 'next/image';

import { cn } from '@/lib/utils';

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function TeamAvatar({
  name,
  logo,
  className,
}: {
  name: string;
  logo?: string;
  className?: string;
}) {
  if (logo) {
    return (
      <Image
        src={logo}
        alt={name}
        width={32}
        height={32}
        className={cn('size-8 rounded-full object-contain', className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'bg-secondary text-secondary-foreground flex size-8 items-center justify-center rounded-full text-xs font-semibold',
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}
