import { useMemo } from "react";
import { Search } from "lucide-react";
import { SectionCard } from "@/components";
import type { QuickInfoData } from "@/modules/quick-info/types";
export function DirectorySection({
  rows,
  search,
  onSearch
}: {
  rows: QuickInfoData["directory"];
  search: string;
  onSearch: (value: string) => void;
}) {
  const filtered = useMemo(
    () =>
      rows.filter((item) =>
        `${item.firstName} ${item.lastName} ${item.employeeNumber} ${item.department?.name ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [rows, search]
  );
  return (
    <SectionCard title="Employee search">
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
        <input
          className="input pl-9"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search employees…"
        />
      </div>
      <div className="divide-y divide-line">
        {filtered.map((item) => (
          <div key={item.id} className="py-3">
            <p className="text-sm font-semibold">
              {item.firstName} {item.lastName}
            </p>
            <p className="text-xs text-muted">
              {item.jobTitle?.name ?? "Employee"} · {item.department?.name ?? "No department"} ·{" "}
              {item.city ?? item.workEmail}
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
