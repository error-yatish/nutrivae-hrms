import { Badge, SectionCard } from "@/components";
import type { WorkflowData } from "@/modules/workflow/types";

export function ApproversSection({ rows }: { rows: WorkflowData["approvers"] }) {
  return (
    <SectionCard title="Assigned approvers">
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((item) => (
          <div key={item.module} className="rounded-xl border border-line p-4">
            <div className="flex justify-between">
              <p className="text-sm font-semibold">{item.module}</p>
              <Badge tone="green">Primary</Badge>
            </div>
            <p className="mt-3 font-medium">{item.name}</p>
            <p className="text-xs text-muted">{item.level}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
