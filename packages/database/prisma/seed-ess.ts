import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const financialYear = "2026-27";

async function main() {
  const employees = await prisma.employee.findMany({ include: { company: true } });
  for (const employee of employees) {
    await prisma.salaryRecord.upsert({
      where: {
        id: (await prisma.salaryRecord.findFirst({ where: { employeeId: employee.id } }))?.id ?? "missing"
      },
      update: {},
      create: {
        employeeId: employee.id,
        amount: 1464000,
        currency: "INR",
        frequency: "ANNUAL",
        effectiveFrom: new Date("2026-04-01")
      }
    });
    await prisma.employeeEssProfile.upsert({
      where: { employeeId: employee.id },
      update: {},
      create: {
        employeeId: employee.id,
        employment: {
          confirmationDate: "2024-10-01",
          grade: "G5",
          branch: "Bengaluru",
          division: "Technology",
          category: "Permanent",
          unit: "India"
        },
        personal: {
          religion: "Not specified",
          languages: ["English", "Hindi"],
          identificationMark: "Not specified",
          aadhaarNumber: "XXXX XXXX 4421",
          uan: "100123456789",
          pfNumber: "KN/BNG/0012345/000/0000123",
          accountType: "Salary"
        },
        family: [
          { name: "Meera Sharma", relation: "Spouse", emergency: true, contactNumber: "+91 98765 43210" }
        ],
        nominees: [{ name: "Meera Sharma", type: "Provident fund", percentage: 100 }],
        immigration: [{ passportNumber: "P1234567", expiryDate: "2031-08-14", issuePlace: "Bengaluru" }],
        licenses: [
          { licenseNumber: "KA01 20200012345", vehicleType: "Four wheeler", expiryDate: "2035-06-18" }
        ],
        skills: [
          { name: "Product strategy", years: 7, competency: "Excellent" },
          { name: "Data analysis", years: 5, competency: "Very good" }
        ],
        languages: [{ language: "English", fluency: "Speak, read, write", competency: "Excellent" }],
        qualifications: [
          {
            degree: "MBA",
            specification: "Strategy",
            institute: "IIM Bangalore",
            year: 2021,
            courseType: "Full time"
          }
        ],
        assets: [{ code: "AST-1042", description: "MacBook Pro 14", cost: 182000, issueDate: "2024-06-03" }],
        experience: [
          {
            company: "Acme Labs",
            designation: "Senior Analyst",
            joiningDate: "2021-01-01",
            leftDate: "2024-05-31"
          }
        ],
        social: [{ organization: "Product Leaders Forum", post: "Member", duration: "Since 2023" }]
      }
    });
    await prisma.employeeTaxProfile.upsert({
      where: { employeeId: employee.id },
      update: {},
      create: {
        employeeId: employee.id,
        financialYear,
        useNewRegime: true,
        claimParentMedical: true,
        numberOfChildren: 2,
        projectedGross: 1464000,
        exemptAllowances: 72000,
        projectedDeductions: 150000,
        projectedTax: 118560,
        tdsDeducted: 29640
      }
    });
    for (const month of [4, 5, 6]) {
      await prisma.payslip.upsert({
        where: { employeeId_month_year: { employeeId: employee.id, month, year: 2026 } },
        update: {},
        create: {
          employeeId: employee.id,
          month,
          year: 2026,
          paidDays: 30,
          presentDays: 30,
          basic: month === 4 ? 62500 : 65000,
          hra: month === 4 ? 25000 : 26000,
          conveyance: 3500,
          educationAllowance: 1500,
          otherAllowances: month === 4 ? 13000 : 13500,
          providentFund: 7800,
          professionalTax: 200,
          tds: month === 4 ? 4100 : 4600,
          currency: "INR"
        }
      });
    }
    for (const reimbursement of [
      { paymentHead: "Medical", credit: 25000, claimed: 6500 },
      { paymentHead: "Learning", credit: 25000, claimed: 0 },
      { paymentHead: "Mobile & internet", credit: 12000, claimed: 2400 }
    ]) {
      await prisma.reimbursementAccount.upsert({
        where: {
          employeeId_paymentHead_financialYear: {
            employeeId: employee.id,
            paymentHead: reimbursement.paymentHead,
            financialYear
          }
        },
        update: {},
        create: {
          companyId: employee.companyId,
          employeeId: employee.id,
          paymentHead: reimbursement.paymentHead,
          financialYear,
          currentYearCredit: reimbursement.credit,
          claimedAmount: reimbursement.claimed,
          paidAmount: reimbursement.claimed
        }
      });
    }
    const declaration = await prisma.taxDeclaration.findFirst({
      where: { employeeId: employee.id, financialYear, type: "80C" }
    });
    if (!declaration) {
      await prisma.taxDeclaration.create({
        data: {
          companyId: employee.companyId,
          employeeId: employee.id,
          financialYear,
          type: "80C",
          narration: "EPF and ELSS",
          declaredAmount: 150000,
          approvedAmount: 150000,
          status: "APPROVED"
        }
      });
    }
  }
  console.log(`Backfilled ESS data for ${employees.length} employees.`);
}

main().finally(() => prisma.$disconnect());
