import { SectionCard } from "@/components";
import type { WorkflowData } from "@/modules/workflow/types";

export function OrganizationSection({ rows }: { rows: WorkflowData["organization"] }) {
  const roots = rows.filter(
    (item) => !item.managerId || !rows.some((candidate) => candidate.id === item.managerId)
  );
  return (
    <SectionCard title="Organization chart" description="Reporting hierarchy">
      <div className="space-y-5">
        {roots.map((root) => (
          <div key={root.id}>
            <Person employee={root} />
            <div className="mx-auto h-5 w-px bg-line" />
            <div className="grid gap-3 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-3">
              {rows
                .filter((item) => item.managerId === root.id)
                .map((child) => (
                  <Person key={child.id} employee={child} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function Person({ employee }: { employee: WorkflowData["organization"][number] }) {
  return (
    <div className="rounded-xl border border-line bg-base-200 p-4 text-center shadow-sm">
      <p className="text-sm font-semibold">
        {employee.firstName} {employee.lastName}
      </p>
      <p className="text-xs text-muted">
        {employee.jobTitle?.name ?? "Employee"} · {employee.department?.name ?? "No department"}
      </p>
    </div>
  );
}
