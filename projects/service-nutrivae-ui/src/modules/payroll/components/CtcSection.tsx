import { IndianRupee } from "lucide-react";
import { SectionCard } from "@/components";
import { formatSalaryMoney } from "@/modules/payroll/formatters";
import type { SalaryData } from "@/modules/payroll/types";

export function CtcSection({ data }: { data?: SalaryData }) {
  const ctc = data?.ctc;
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Annual CTC" value={formatSalaryMoney(ctc?.annualCtc, ctc?.currency)} />
        <Metric label="Gross monthly" value={formatSalaryMoney(ctc?.grossMonthly, ctc?.currency)} />
        <Metric label="Monthly deductions" value={formatSalaryMoney(ctc?.monthlyDeductions, ctc?.currency)} />
        <Metric label="Net take home" value={formatSalaryMoney(ctc?.netTakeHome, ctc?.currency)} />
      </section>
      <SectionCard
        title="Compensation structure"
        description={
          ctc?.effectiveFrom
            ? `Effective from ${new Date(ctc.effectiveFrom).toLocaleDateString()}`
            : undefined
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Fixed annual compensation", formatSalaryMoney(ctc?.annualCtc, ctc?.currency)],
            ["Monthly gross", formatSalaryMoney(ctc?.grossMonthly, ctc?.currency)],
            ["Monthly deductions", formatSalaryMoney(ctc?.monthlyDeductions, ctc?.currency)],
            ["Monthly take home", formatSalaryMoney(ctc?.netTakeHome, ctc?.currency)]
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-line bg-canvas p-4">
              <p className="text-sm font-semibold">{label}</p>
              <p className="mt-2 font-display text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <IndianRupee size={18} className="text-brand-600" />
      <p className="mt-4 text-xs text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
