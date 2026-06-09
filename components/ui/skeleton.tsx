import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-card bg-gray-200 dark:bg-dark-border",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
