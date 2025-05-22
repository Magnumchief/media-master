import { cn, Status, getStatusColorClass } from "@/lib/utils";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

function StatusBadge({ status, className }: StatusBadgeProps) {
  const displayText = status.replace(/-/g, ' ');
  
  return (
    <span
      className={cn(
        "status-badge",
        getStatusColorClass(status),
        className
      )}
    >
      {displayText}
    </span>
  );
}

export default StatusBadge;
