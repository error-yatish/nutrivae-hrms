export type QuickInfoTab = "leave" | "loans" | "reimbursements" | "holidays" | "documents" | "directory";
export type QuickInfoData = {
  leaveBalances: Array<{ id: string; allowance: number; used: number; leaveType: { name: string } }>;
  loans: Array<{
    id: string;
    loanNumber: string;
    name: string;
    issuedOn: string;
    amount: number;
    balance: number;
    installment: number;
    interestRate: number;
    status: string;
  }>;
  reimbursements: Array<{
    id: string;
    paymentHead: string;
    openingBalance: number;
    currentYearCredit: number;
    paidAmount: number;
    claimedAmount: number;
    monthlyVoucherAmount: number;
  }>;
  holidays: Array<{ id: string; name: string; date: string; location?: string }>;
  documents: Array<{ id: string; name: string; type: string; url: string }>;
  directory: Array<{
    id: string;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    workEmail: string;
    phone?: string;
    city?: string;
    department?: { name: string };
    jobTitle?: { name: string };
  }>;
};
