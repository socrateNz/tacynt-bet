import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Link href={href} className="text-muted-foreground hover:text-foreground flex items-center text-sm">
        Voir tout <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}
