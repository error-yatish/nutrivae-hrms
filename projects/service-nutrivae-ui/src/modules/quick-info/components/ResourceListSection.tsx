import { SectionCard } from "@/components";
export function ResourceListSection({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <SectionCard title={title}>
      <div className="divide-y divide-line">
        {rows.map(([heading, detail]) => (
          <div className="py-4 first:pt-0 last:pb-0" key={`${heading}-${detail}`}>
            <p className="text-sm font-semibold">{heading}</p>
            <p className="mt-1 text-xs text-muted">{detail}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
