export type SalaryTab = "ctc" | "payslips" | "monthly";
export type Payslip = {
  id: string;
  month: number;
  year: number;
  paidDays: number;
  presentDays: number;
  basic: number;
  da: number;
  hra: number;
  conveyance: number;
  educationAllowance: number;
  otherAllowances: number;
  providentFund: number;
  esic: number;
  professionalTax: number;
  tds: number;
  otherDeductions: number;
  currency: string;
  documentUrl?: string;
};
export type SalaryData = {
  ctc: {
    annualCtc: number;
    grossMonthly: number;
    monthlyDeductions: number;
    netTakeHome: number;
    currency: string;
    effectiveFrom?: string;
  };
  payslips: Payslip[];
};
