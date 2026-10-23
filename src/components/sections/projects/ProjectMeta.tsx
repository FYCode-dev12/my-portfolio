import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/lib/content";

const statusLabel: Record<Project["status"], string> = {
  live: "Live",
  "in-progress": "Dalam pengerjaan",
  archived: "Arsip",
};

export function StatusBadge({ status }: { status: Project["status"] }) {
  return <Badge tone={status === "live" ? "accent" : "neutral"}>{statusLabel[status]}</Badge>;
}
