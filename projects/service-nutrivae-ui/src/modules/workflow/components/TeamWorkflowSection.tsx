import { SectionCard } from "@/components";
import type { WorkflowData } from "@/modules/workflow/types";

export function TeamWorkflowSection({
  rows,
  requests,
  onReview
}: {
  rows: WorkflowData["reports"];
  requests: WorkflowData["pendingRequests"];
  onReview: (id: string, status: string) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <SectionCard title="Employees assigned to me">
        <div className="divide-y divide-line">
          {rows.length ? (
            rows.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold">
                    {item.firstName} {item.lastName}
                  </p>
                  <p className="text-xs text-muted">{item.employeeNumber}</p>
                </div>
                <span className="text-sm">{item.jobTitle?.name ?? "Direct report"}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">No employees currently report to you.</p>
          )}
        </div>
      </SectionCard>
      <SectionCard title="Pending profile changes">
        <div className="divide-y divide-line">
          {requests.length ? (
            requests.map((request) => (
              <div key={request.id} className="py-4 first:pt-0">
                <p className="text-sm font-semibold">
                  {request.employee.firstName} {request.employee.lastName}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {request.section} · {Object.keys(request.changes).join(", ")}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    className="btn-primary !min-h-9 !px-3"
                    onClick={() => onReview(request.id, "APPROVED")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-secondary !min-h-9 !px-3"
                    onClick={() => onReview(request.id, "REJECTED")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">No pending profile changes.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
