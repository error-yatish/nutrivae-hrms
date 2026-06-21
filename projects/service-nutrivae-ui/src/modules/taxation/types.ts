export type TaxTab = "projection" | "declarations" | "claims" | "previous";
export type TaxProfile = {
  useNewRegime: boolean;
  claimParentMedical: boolean;
  claimDisability: boolean;
  physicallyHandicapped: boolean;
  numberOfChildren: number;
  projectedGross: number;
  exemptAllowances: number;
  projectedDeductions: number;
  projectedTax: number;
  tdsDeducted: number;
};
export type TaxDeclaration = {
  id: string;
  type: string;
  narration: string;
  declaredAmount: number;
  approvedAmount?: number;
  claimedAmount?: number;
  documentUrl?: string;
  status: string;
};
export type PreviousEmployerTax = {
  employerName: string;
  basic: number;
  allowances: number;
  hra: number;
  da: number;
  grossSalary: number;
  professionalTax: number;
  tdsDeducted: number;
  pfDeducted: number;
};
export type TaxData = {
  profile?: TaxProfile;
  declarations: TaxDeclaration[];
  previousEmployer?: PreviousEmployerTax;
  financialYear: string;
};
export const defaultTaxProfile: TaxProfile = {
  useNewRegime: true,
  claimParentMedical: false,
  claimDisability: false,
  physicallyHandicapped: false,
  numberOfChildren: 0,
  projectedGross: 0,
  exemptAllowances: 0,
  projectedDeductions: 0,
  projectedTax: 0,
  tdsDeducted: 0
};
