CREATE TABLE "EmployeeEssProfile" (
  "id" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "employment" JSONB NOT NULL DEFAULT '{}',
  "personal" JSONB NOT NULL DEFAULT '{}',
  "family" JSONB NOT NULL DEFAULT '[]',
  "nominees" JSONB NOT NULL DEFAULT '[]',
  "immigration" JSONB NOT NULL DEFAULT '[]',
  "licenses" JSONB NOT NULL DEFAULT '[]',
  "skills" JSONB NOT NULL DEFAULT '[]',
  "languages" JSONB NOT NULL DEFAULT '[]',
  "qualifications" JSONB NOT NULL DEFAULT '[]',
  "assets" JSONB NOT NULL DEFAULT '[]',
  "experience" JSONB NOT NULL DEFAULT '[]',
  "social" JSONB NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EmployeeEssProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProfileChangeRequest" (
  "id" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "section" TEXT NOT NULL,
  "changes" JSONB NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "reviewerId" TEXT,
  "reviewNote" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProfileChangeRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Payslip" (
  "id" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "month" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  "paidDays" DECIMAL(5,1) NOT NULL,
  "presentDays" DECIMAL(5,1) NOT NULL,
  "basic" DECIMAL(12,2) NOT NULL,
  "da" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "hra" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "conveyance" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "educationAllowance" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "otherAllowances" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "providentFund" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "esic" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "professionalTax" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "tds" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "otherDeductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'INR',
  "documentUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Payslip_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmployeeTaxProfile" (
  "id" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "financialYear" TEXT NOT NULL,
  "useNewRegime" BOOLEAN NOT NULL DEFAULT true,
  "claimParentMedical" BOOLEAN NOT NULL DEFAULT false,
  "claimDisability" BOOLEAN NOT NULL DEFAULT false,
  "physicallyHandicapped" BOOLEAN NOT NULL DEFAULT false,
  "numberOfChildren" INTEGER NOT NULL DEFAULT 0,
  "projectedGross" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "exemptAllowances" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "projectedDeductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "projectedTax" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "tdsDeducted" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EmployeeTaxProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TaxDeclaration" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "financialYear" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "narration" TEXT NOT NULL,
  "declaredAmount" DECIMAL(12,2) NOT NULL,
  "approvedAmount" DECIMAL(12,2),
  "claimedAmount" DECIMAL(12,2),
  "documentUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'DECLARED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TaxDeclaration_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PreviousEmployerTax" (
  "id" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "financialYear" TEXT NOT NULL,
  "employerName" TEXT NOT NULL,
  "basic" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "allowances" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "hra" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "da" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "grossSalary" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "professionalTax" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "tdsDeducted" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "pfDeducted" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "documentUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PreviousEmployerTax_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmployeeLoan" (
  "id" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "loanNumber" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "issuedOn" TIMESTAMP(3) NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "balance" DECIMAL(12,2) NOT NULL,
  "installment" DECIMAL(12,2) NOT NULL,
  "interestRate" DECIMAL(5,2) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "ledger" JSONB NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EmployeeLoan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReimbursementAccount" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "paymentHead" TEXT NOT NULL,
  "financialYear" TEXT NOT NULL,
  "openingBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "currentYearCredit" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "claimedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "monthlyVoucherAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReimbursementAccount_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EmployeeEssProfile_employeeId_key" ON "EmployeeEssProfile"("employeeId");
CREATE INDEX "ProfileChangeRequest_employeeId_status_idx" ON "ProfileChangeRequest"("employeeId", "status");
CREATE INDEX "ProfileChangeRequest_reviewerId_status_idx" ON "ProfileChangeRequest"("reviewerId", "status");
CREATE UNIQUE INDEX "Payslip_employeeId_month_year_key" ON "Payslip"("employeeId", "month", "year");
CREATE INDEX "Payslip_employeeId_year_idx" ON "Payslip"("employeeId", "year");
CREATE UNIQUE INDEX "EmployeeTaxProfile_employeeId_key" ON "EmployeeTaxProfile"("employeeId");
CREATE INDEX "TaxDeclaration_employeeId_financialYear_idx" ON "TaxDeclaration"("employeeId", "financialYear");
CREATE INDEX "TaxDeclaration_companyId_status_idx" ON "TaxDeclaration"("companyId", "status");
CREATE UNIQUE INDEX "PreviousEmployerTax_employeeId_key" ON "PreviousEmployerTax"("employeeId");
CREATE UNIQUE INDEX "EmployeeLoan_employeeId_loanNumber_key" ON "EmployeeLoan"("employeeId", "loanNumber");
CREATE UNIQUE INDEX "ReimbursementAccount_employeeId_paymentHead_financialYear_key" ON "ReimbursementAccount"("employeeId", "paymentHead", "financialYear");
CREATE INDEX "ReimbursementAccount_companyId_idx" ON "ReimbursementAccount"("companyId");

ALTER TABLE "EmployeeEssProfile" ADD CONSTRAINT "EmployeeEssProfile_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProfileChangeRequest" ADD CONSTRAINT "ProfileChangeRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProfileChangeRequest" ADD CONSTRAINT "ProfileChangeRequest_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payslip" ADD CONSTRAINT "Payslip_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EmployeeTaxProfile" ADD CONSTRAINT "EmployeeTaxProfile_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TaxDeclaration" ADD CONSTRAINT "TaxDeclaration_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TaxDeclaration" ADD CONSTRAINT "TaxDeclaration_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PreviousEmployerTax" ADD CONSTRAINT "PreviousEmployerTax_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EmployeeLoan" ADD CONSTRAINT "EmployeeLoan_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReimbursementAccount" ADD CONSTRAINT "ReimbursementAccount_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReimbursementAccount" ADD CONSTRAINT "ReimbursementAccount_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
