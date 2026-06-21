import { SectionCard } from "@/components";
import { formatTaxMoney } from "@/modules/taxation/formatters";
import { defaultTaxProfile, type TaxProfile } from "@/modules/taxation/types";

export function ProjectionSection({
  profile = defaultTaxProfile,
  onToggle
}: {
  profile?: TaxProfile;
  onToggle: (key: keyof TaxProfile, value: boolean) => void;
}) {
  const taxable =
    Number(profile.projectedGross) - Number(profile.exemptAllowances) - Number(profile.projectedDeductions);
  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <Summary label="Projected taxable income" value={formatTaxMoney(taxable)} />
        <Summary label="Estimated tax payable" value={formatTaxMoney(profile.projectedTax)} />
        <Summary label="TDS deducted to date" value={formatTaxMoney(profile.tdsDeducted)} />
      </section>
      <SectionCard title="Tax eligibility">
        <div className="grid gap-3 md:grid-cols-2">
          <Toggle
            label="Use new tax regime"
            enabled={profile.useNewRegime}
            onClick={() => onToggle("useNewRegime", !profile.useNewRegime)}
          />
          <Toggle
            label="Claim parent medical deduction (80D)"
            enabled={profile.claimParentMedical}
            onClick={() => onToggle("claimParentMedical", !profile.claimParentMedical)}
          />
          <Toggle
            label="Disability deduction (80DD)"
            enabled={profile.claimDisability}
            onClick={() => onToggle("claimDisability", !profile.claimDisability)}
          />
          <div className="rounded-xl border border-line p-4">
            <span className="text-xs text-muted">Number of children</span>
            <p className="mt-1 font-semibold">{profile.numberOfChildren}</p>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Projection summary">
        <div className="divide-y divide-line">
          {[
            ["Gross salary", formatTaxMoney(profile.projectedGross)],
            ["Exempt allowances", `− ${formatTaxMoney(profile.exemptAllowances)}`],
            ["Chapter VI-A deductions", `− ${formatTaxMoney(profile.projectedDeductions)}`],
            ["Taxable income", formatTaxMoney(taxable)]
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <span className="text-sm font-medium">{label}</span>
              <span className="text-sm font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
function Toggle({ label, enabled, onClick }: { label: string; enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between rounded-xl border border-line p-4 text-left"
    >
      <span className="text-sm font-semibold">{label}</span>
      <span className={`h-6 w-11 rounded-full p-1 ${enabled ? "bg-primary" : "bg-base-300"}`}>
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${enabled ? "translate-x-5" : ""}`}
        />
      </span>
    </button>
  );
}
