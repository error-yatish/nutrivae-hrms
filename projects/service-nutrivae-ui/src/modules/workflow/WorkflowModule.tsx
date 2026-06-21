import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Network, Users, Workflow } from "lucide-react";
import { PageHeader, Skeleton, Tabs } from "@/components";
import { api } from "@/lib/api";
import {
  ApproversSection,
  OrganizationSection,
  StatusSection,
  TeamWorkflowSection
} from "@/modules/workflow/components";
import type { WorkflowData, WorkflowTab } from "@/modules/workflow/types";

export function WorkflowPage() {
  const [tab, setTab] = useState<WorkflowTab>("approvers");
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["ess-workflow"],
    queryFn: () => api.get<WorkflowData>("/ess/workflow")
  });
  const review = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/ess/profile/change-requests/${id}/review`, { status }),
    onSuccess: () => void client.invalidateQueries({ queryKey: ["ess-workflow"] })
  });
  if (query.isLoading) return <Skeleton className="h-96" />;
  const data = query.data?.data;
  return (
    <div className="page">
      <PageHeader
        eyebrow="Workflow"
        title="Approvals & organization"
        description="See who approves your requests and how reporting lines are structured."
      />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "approvers", label: "My approvers", icon: <Workflow size={16} /> },
          { id: "team", label: "My workflow", icon: <Users size={16} /> },
          { id: "status", label: "Approval status", icon: <CheckCircle2 size={16} /> },
          { id: "organization", label: "Organization chart", icon: <Network size={16} /> }
        ]}
      />
      {tab === "approvers" && <ApproversSection rows={data?.approvers ?? []} />}
      {tab === "team" && (
        <TeamWorkflowSection
          rows={data?.reports ?? []}
          requests={data?.pendingRequests ?? []}
          onReview={(id, status) => review.mutate({ id, status })}
        />
      )}
      {tab === "status" && <StatusSection counts={data?.counts ?? {}} />}
      {tab === "organization" && <OrganizationSection rows={data?.organization ?? []} />}
    </div>
  );
}
