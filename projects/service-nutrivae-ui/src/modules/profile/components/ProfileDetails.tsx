import { SectionCard } from "@/components";
import { displayProfileValue } from "@/modules/profile/formatters";

export function ProfileDetails({ title, items }: { title: string; items: Array<[string, unknown]> }) {
  return (
    <SectionCard title={title}>
      <dl className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="mt-1 text-sm font-semibold">{displayProfileValue(value)}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  );
}
export function ProfileList({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <SectionCard title={title}>
      <div className="divide-y divide-line">
        {rows.length ? (
          rows.map(([heading, detail], index) => (
            <div key={`${heading}-${index}`} className="py-3 first:pt-0 last:pb-0">
              <p className="text-sm font-semibold">{heading}</p>
              <p className="mt-1 text-xs text-muted">{detail}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">No records.</p>
        )}
      </div>
    </SectionCard>
  );
}
