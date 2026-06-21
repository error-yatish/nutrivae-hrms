import { Plus } from "lucide-react";
import { SectionCard } from "@/components";
import { formatTaxMoney } from "@/modules/taxation/formatters";
import type { TaxDeclaration } from "@/modules/taxation/types";

export function DeclarationsSection({
  rows,
  onAdd,
  claim = false
}: {
  rows: TaxDeclaration[];
  onAdd: () => void;
  claim?: boolean;
}) {
  return (
    <SectionCard
      title={claim ? "Proof submissions" : "Investment declarations"}
      action={
        <button className="btn-primary" onClick={onAdd}>
          <Plus size={16} />
          {claim ? "Submit proof" : "Add declaration"}
        </button>
      }
    >
      <div className="divide-y divide-line">
        {rows.length ? (
          rows.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <span className="text-sm font-medium">
                {item.type} · {item.narration}
              </span>
              <span className="text-right text-sm font-semibold">
                {formatTaxMoney(claim ? item.claimedAmount : item.declaredAmount)} ·{" "}
                {item.status.replaceAll("_", " ")}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">No records yet.</p>
        )}
      </div>
    </SectionCard>
  );
}
