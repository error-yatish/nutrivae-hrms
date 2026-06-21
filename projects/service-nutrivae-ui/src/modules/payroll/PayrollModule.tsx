import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText, TrendingUp, WalletCards } from "lucide-react";
import { PageHeader, Skeleton, Tabs } from "@/components";
import { downloadCsv } from "@/lib/download";
import { api } from "@/lib/api";
import { CtcSection, MonthlySalarySection, PayslipSection } from "@/modules/payroll/components";
import { payslipExportRow } from "@/modules/payroll/formatters";
import type { SalaryData, SalaryTab } from "@/modules/payroll/types";

export function PayrollPage() {
  const [tab, setTab] = useState<SalaryTab>("ctc");
  const query = useQuery({ queryKey: ["ess-salary"], queryFn: () => api.get<SalaryData>("/ess/salary") });
  if (query.isLoading) return <Skeleton className="h-96" />;
  const data = query.data?.data;
  return (
    <div className="page">
      <PageHeader
        eyebrow="Salary"
        title="Pay & compensation"
        description="Understand your CTC, monthly earnings, deductions, and payslips."
        actions={
          <button
            className="btn-secondary"
            disabled={!data?.payslips.length}
            onClick={() => downloadCsv("salary-report.csv", (data?.payslips ?? []).map(payslipExportRow))}
          >
            <Download size={16} />
            Export report
          </button>
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "ctc", label: "CTC breakdown", icon: <WalletCards size={16} /> },
          { id: "payslips", label: "Payslips", icon: <FileText size={16} /> },
          { id: "monthly", label: "Monthly report", icon: <TrendingUp size={16} /> }
        ]}
      />
      {tab === "ctc" && <CtcSection data={data} />}
      {tab === "payslips" && <PayslipSection payslips={data?.payslips ?? []} />}
      {tab === "monthly" && <MonthlySalarySection payslips={data?.payslips ?? []} />}
    </div>
  );
}
