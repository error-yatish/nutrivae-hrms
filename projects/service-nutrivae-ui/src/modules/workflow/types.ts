export type WorkflowTab = "approvers" | "team" | "status" | "organization";

export type WorkflowData = {
  approvers: Array<{ module: string; name: string; level: string }>;
  reports: Array<{
    id: string;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    jobTitle?: { name: string };
  }>;
  counts: Record<string, number>;
  pendingRequests: Array<{
    id: string;
    section: string;
    changes: Record<string, unknown>;
    employee: { firstName: string; lastName: string; employeeNumber: string };
  }>;
  organization: Array<{
    id: string;
    managerId?: string;
    firstName: string;
    lastName: string;
    department?: { name: string };
    jobTitle?: { name: string };
  }>;
};
