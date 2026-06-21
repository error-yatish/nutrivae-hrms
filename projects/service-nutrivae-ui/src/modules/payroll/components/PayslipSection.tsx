import { Download, FileText } from "lucide-react";
import { SectionCard } from "@/components";
import { downloadCsv } from "@/lib/download";
import {
  formatSalaryMoney,
  payslipExportRow,
  payslipNet,
  salaryMonthName
} from "@/modules/payroll/formatters";
import type { Payslip } from "@/modules/payroll/types";

export function PayslipSection({ payslips }: { payslips: Payslip[] }) {
  return (
    <SectionCard title="Payslip archive" description="Monthly salary statements">
      <div className="divide-y divide-line">
        {payslips.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <FileText size={18} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {salaryMonthName(item.month)} {item.year} payslip
              </p>
              <p className="text-xs text-muted">
                {Number(item.paidDays)} paid days · Net salary{" "}
                {formatSalaryMoney(payslipNet(item), item.currency)}
              </p>
            </div>
            <button
              className="btn-secondary !min-h-9 !px-3"
              onClick={() => downloadCsv(`${item.year}-${item.month}-payslip.csv`, [payslipExportRow(item)])}
            >
              <Download size={15} />
              Download
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
