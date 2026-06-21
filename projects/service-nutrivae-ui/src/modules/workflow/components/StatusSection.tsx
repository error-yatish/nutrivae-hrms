import { Badge } from "@/components";

export function StatusSection({ counts }: { counts: Record<string, number> }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        ["Pending", counts.PENDING ?? 0, "amber"],
        ["Approved", counts.APPROVED ?? 0, "green"],
        ["Rejected", counts.REJECTED ?? 0, "red"],
        ["Total", counts.TOTAL ?? 0, "neutral"]
      ].map(([label, value, tone]) => (
        <div className="card p-5" key={label}>
          <Badge tone={tone as "amber" | "green" | "red" | "neutral"}>{label}</Badge>
          <p className="mt-4 font-display text-3xl font-bold">{value}</p>
          <p className="text-xs text-muted">Across assigned workflows</p>
        </div>
      ))}
    </section>
  );
}
