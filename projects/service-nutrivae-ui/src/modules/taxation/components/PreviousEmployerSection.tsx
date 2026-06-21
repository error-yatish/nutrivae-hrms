import { Plus } from "lucide-react";
import { SectionCard } from "@/components";
import { formatTaxMoney } from "@/modules/taxation/formatters";
import type { PreviousEmployerTax } from "@/modules/taxation/types";

export function PreviousEmployerSection({ data, onAdd }: { data?: PreviousEmployerTax; onAdd: () => void }) {
  return (
    <SectionCard title="Previous employer Form 16">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["Employer", data?.employerName ?? "Not provided"],
          ["Total basic", formatTaxMoney(data?.basic)],
          ["Total allowances", formatTaxMoney(data?.allowances)],
          ["Gross salary", formatTaxMoney(data?.grossSalary)],
          ["Professional tax", formatTaxMoney(data?.professionalTax)],
          ["TDS deducted", formatTaxMoney(data?.tdsDeducted)],
          ["PF deducted", formatTaxMoney(data?.pfDeducted)]
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-line p-4">
            <span className="text-xs text-muted">{label}</span>
            <p className="mt-1 font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <button className="btn-secondary mt-5" onClick={onAdd}>
        <Plus size={16} />
        {data ? "Update" : "Add"} previous employer details
      </button>
    </SectionCard>
  );
}
