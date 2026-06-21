import { SectionCard } from "@/components";
import { formatQuickInfoMoney } from "@/modules/quick-info/formatters";
import type { QuickInfoData } from "@/modules/quick-info/types";
export function LoansSection({ rows }: { rows: QuickInfoData["loans"] }) {
  return (
    <SectionCard title="Loan details">
      <div className="divide-y divide-line">
        {rows.length ? (
          rows.map((item) => (
            <div key={item.id} className="grid gap-3 py-4 first:pt-0 sm:grid-cols-4">
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted">{item.loanNumber}</p>
              </div>
              <Value label="Original amount" value={formatQuickInfoMoney(item.amount)} />
              <Value label="Balance" value={formatQuickInfoMoney(item.balance)} />
              <Value label="Installment" value={formatQuickInfoMoney(item.installment)} />
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">No active loans.</p>
        )}
      </div>
    </SectionCard>
  );
}
function Value({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
