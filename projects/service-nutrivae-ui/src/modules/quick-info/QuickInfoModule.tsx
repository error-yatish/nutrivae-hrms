import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Calculator, FileText, Gift, Search, WalletCards } from "lucide-react";
import { PageHeader, Skeleton, Tabs } from "@/components";
import { api } from "@/lib/api";
import {
  DirectorySection,
  LeaveBalancesSection,
  LoansSection,
  ReimbursementsSection,
  ResourceListSection
} from "@/modules/quick-info/components";
import type { QuickInfoData, QuickInfoTab } from "@/modules/quick-info/types";

export function QuickInfoPage() {
  const [tab, setTab] = useState<QuickInfoTab>("leave");
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["ess-quick-info"],
    queryFn: () => api.get<QuickInfoData>("/ess/quick-info")
  });
  if (query.isLoading) return <Skeleton className="h-96" />;
  const data = query.data?.data;
  return (
    <div className="page">
      <PageHeader
        eyebrow="Quick info"
        title="Everyday resources"
        description="Balances, benefits, documents, holidays, and colleagues in one searchable place."
      />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "leave", label: "Leave balances", icon: <CalendarDays size={16} /> },
          { id: "loans", label: "Loans", icon: <WalletCards size={16} /> },
          { id: "reimbursements", label: "Reimbursements", icon: <Calculator size={16} /> },
          { id: "holidays", label: "Holidays", icon: <Gift size={16} /> },
          { id: "documents", label: "Documents", icon: <FileText size={16} /> },
          { id: "directory", label: "Employee search", icon: <Search size={16} /> }
        ]}
      />
      {tab === "leave" && <LeaveBalancesSection rows={data?.leaveBalances ?? []} />}
      {tab === "loans" && <LoansSection rows={data?.loans ?? []} />}
      {tab === "reimbursements" && <ReimbursementsSection rows={data?.reimbursements ?? []} />}
      {tab === "holidays" && (
        <ResourceListSection
          title="Company holidays"
          rows={(data?.holidays ?? []).map((item) => [
            new Date(item.date).toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric"
            }),
            item.name
          ])}
        />
      )}
      {tab === "documents" && (
        <ResourceListSection
          title="My documents"
          rows={(data?.documents ?? []).map((item) => [item.name, `${item.type} · ${item.url}`])}
        />
      )}
      {tab === "directory" && (
        <DirectorySection rows={data?.directory ?? []} search={search} onSearch={setSearch} />
      )}
    </div>
  );
}
