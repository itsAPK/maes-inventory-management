import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export const CountCard = ({
  name,
  icon,
  count,
  color,
}: {
  name: string;
  icon: any;
  count: string;
  color: string;
}) => {
  return (
    <div className="flex h-full w-full grid-cols-2 items-center space-x-6 rounded bg-background px-10 py-4 align-middle shadow md:grid md:h-32 md:grid-cols-4 md:px-8">
      <div
        className={cn(
          `${color} col-span-1 flex h-[64px] w-[64px] items-center justify-center rounded-full`,
        )}
      >
        {icon}
      </div>
      <div className="col-span-3">
        <div className="v text-[15px] font-semibold text-muted-foreground">{name}</div>
        <div className="px-1 py-1 text-xl font-semibold">{count}</div>
      </div>
    </div>
  );
};
