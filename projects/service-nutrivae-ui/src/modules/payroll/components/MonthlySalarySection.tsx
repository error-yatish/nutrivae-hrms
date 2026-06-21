import { SectionCard } from "@/components";
import {
  formatSalaryMoney,
  payslipAllowances,
  payslipDeductions,
  payslipNet,
  salaryMonthName
} from "@/modules/payroll/formatters";
import type { Payslip } from "@/modules/payroll/types";

export function MonthlySalarySection({ payslips }: { payslips: Payslip[] }) {
  return (
    <SectionCard title="Monthly salary report">
      <div className="table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Basic</th>
              <th>HRA</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net salary</th>
            </tr>
          </thead>
          <tbody>
            {payslips.map((item) => (
              <tr key={item.id}>
                <td className="font-semibold">
                  {salaryMonthName(item.month)} {item.year}
                </td>
                <td>{formatSalaryMoney(item.basic, item.currency)}</td>
                <td>{formatSalaryMoney(item.hra, item.currency)}</td>
                <td>{formatSalaryMoney(payslipAllowances(item), item.currency)}</td>
                <td className="text-error">−{formatSalaryMoney(payslipDeductions(item), item.currency)}</td>
                <td className="font-bold">{formatSalaryMoney(payslipNet(item), item.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
