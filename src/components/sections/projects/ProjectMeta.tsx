import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/lib/content";
import { statusLabel } from "@/lib/format";

export function StatusBadge({ status }: { status: Project["status"] }) {
  return (
    <Badge tone={status === "live" || status === "demo" ? "accent" : "neutral"}>
      {statusLabel[status]}
    </Badge>
  );
}
