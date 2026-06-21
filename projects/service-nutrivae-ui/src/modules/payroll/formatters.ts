import type { Payslip } from "@/modules/payroll/types";
const number = (value: number) => Number(value ?? 0);
export const payslipAllowances = (item: Payslip) =>
  number(item.da) + number(item.conveyance) + number(item.educationAllowance) + number(item.otherAllowances);
export const payslipDeductions = (item: Payslip) =>
  number(item.providentFund) +
  number(item.esic) +
  number(item.professionalTax) +
  number(item.tds) +
  number(item.otherDeductions);
export const payslipNet = (item: Payslip) =>
  number(item.basic) + number(item.hra) + payslipAllowances(item) - payslipDeductions(item);
export const formatSalaryMoney = (value = 0, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(
    Number(value)
  );
export const salaryMonthName = (month: number) =>
  new Date(2026, month - 1).toLocaleString("en", { month: "long" });
export const payslipExportRow = (item: Payslip) => ({
  month: `${salaryMonthName(item.month)} ${item.year}`,
  basic: number(item.basic),
  hra: number(item.hra),
  allowances: payslipAllowances(item),
  deductions: payslipDeductions(item),
  net: payslipNet(item)
});
