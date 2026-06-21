import { SectionCard } from "@/components";
import type { QuickInfoData } from "@/modules/quick-info/types";
export function LeaveBalancesSection({ rows }: { rows: QuickInfoData["leaveBalances"] }) {
  return (
    <SectionCard title="Leave balances">
      <div className="table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th>Leave type</th>
              <th>Opening</th>
              <th>Consumed</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id}>
                <td className="font-semibold">{item.leaveType.name}</td>
                <td>{Number(item.allowance)}</td>
                <td>{Number(item.used)}</td>
                <td className="font-semibold">{Number(item.allowance) - Number(item.used)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
