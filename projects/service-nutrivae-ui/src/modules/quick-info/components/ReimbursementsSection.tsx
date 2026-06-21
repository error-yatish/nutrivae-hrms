import { SectionCard } from "@/components";
import { formatQuickInfoMoney } from "@/modules/quick-info/formatters";
import type { QuickInfoData } from "@/modules/quick-info/types";
export function ReimbursementsSection({ rows }: { rows: QuickInfoData["reimbursements"] }) {
  return (
    <SectionCard title="Reimbursement balances">
      <div className="grid gap-4 md:grid-cols-3">
        {rows.map((item) => (
          <div key={item.id} className="rounded-xl border border-line p-4">
            <p className="text-sm font-semibold">{item.paymentHead}</p>
            <p className="mt-3 text-xs text-muted">Available</p>
            <p className="font-display text-xl font-bold">
              {formatQuickInfoMoney(
                Number(item.openingBalance) + Number(item.currentYearCredit) - Number(item.paidAmount)
              )}
            </p>
            <p className="mt-2 text-xs text-muted">
              Already claimed {formatQuickInfoMoney(item.claimedAmount)}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
