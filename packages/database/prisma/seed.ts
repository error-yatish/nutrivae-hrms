import {
  PrismaClient,
  Role,
  EmployeeStatus,
  LeaveStatus,
  GoalStatus,
  JobStatus,
  CandidateStatus
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.taxDeclaration.deleteMany();
  await prisma.previousEmployerTax.deleteMany();
  await prisma.employeeTaxProfile.deleteMany();
  await prisma.reimbursementAccount.deleteMany();
  await prisma.employeeLoan.deleteMany();
  await prisma.payslip.deleteMany();
  await prisma.profileChangeRequest.deleteMany();
  await prisma.employeeEssProfile.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.projectAssignment.deleteMany();
  await prisma.project.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.leaveBalance.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.review.deleteMany();
  await prisma.salaryRecord.deleteMany();
  await prisma.document.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.jobOpening.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.companyMembership.deleteMany();
  await prisma.roleProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();
  await prisma.department.deleteMany();
  await prisma.jobTitle.deleteMany();
  await prisma.leaveType.deleteMany();
  await prisma.holiday.deleteMany();
  await prisma.company.deleteMany();

  const company = await prisma.company.create({
    data: {
      name: "Nutrivae Labs",
      legalName: "Nutrivae Labs Inc.",
      slug: "nutrivae-labs",
      theme: "emerald",
      currency: "USD",
      country: "United States",
      timezone: "America/New_York",
      email: "people@nutrivae.com",
      phone: "+1 415 555 0134",
      address: "548 Market Street, San Francisco, CA"
    }
  });
  const [adminRole, managerRole, employeeRole] = await Promise.all([
    prisma.roleProfile.create({
      data: {
        companyId: company.id,
        name: "Company admin",
        description: "Full company access",
        permissions: ["*"],
        isSystem: true
      }
    }),
    prisma.roleProfile.create({
      data: {
        companyId: company.id,
        name: "People manager",
        description: "Manage people and approvals",
        permissions: [
          "employees.manage",
          "leave.approve",
          "organization.manage",
          "goals.manage",
          "payouts.manage",
          "projects.manage"
        ],
        isSystem: true
      }
    }),
    prisma.roleProfile.create({
      data: {
        companyId: company.id,
        name: "Employee",
        description: "Employee self-service",
        permissions: ["profile.self", "leave.self", "goals.self", "payouts.self"],
        isSystem: true
      }
    })
  ]);

  const [people, product, growth] = await Promise.all([
    prisma.department.create({ data: { companyId: company.id, name: "People & Culture", code: "PPL" } }),
    prisma.department.create({ data: { companyId: company.id, name: "Product & Engineering", code: "PRD" } }),
    prisma.department.create({ data: { companyId: company.id, name: "Growth", code: "GRO" } })
  ]);
  const [director, engineer, designer, recruiter] = await Promise.all([
    prisma.jobTitle.create({ data: { companyId: company.id, name: "People Director", level: "L6" } }),
    prisma.jobTitle.create({ data: { companyId: company.id, name: "Senior Engineer", level: "L4" } }),
    prisma.jobTitle.create({ data: { companyId: company.id, name: "Product Designer", level: "L4" } }),
    prisma.jobTitle.create({ data: { companyId: company.id, name: "Talent Partner", level: "L3" } })
  ]);
  const passwordHash = await bcrypt.hash("Welcome123!", 12);
  const adminUser = await prisma.user.create({
    data: { email: "admin@nutrivae.com", passwordHash, role: Role.ADMIN }
  });
  await prisma.companyMembership.create({
    data: { userId: adminUser.id, companyId: company.id, systemRole: Role.ADMIN, roleId: adminRole.id }
  });
  const admin = await prisma.employee.create({
    data: {
      companyId: company.id,
      employeeNumber: "NV-1001",
      firstName: "Amara",
      lastName: "Okafor",
      workEmail: adminUser.email,
      startDate: new Date("2021-03-15"),
      status: EmployeeStatus.ACTIVE,
      userId: adminUser.id,
      departmentId: people.id,
      jobTitleId: director.id
    }
  });
  const names = [
    ["Maya", "Chen", "maya@nutrivae.com", product.id, designer.id],
    ["Leo", "Martins", "leo@nutrivae.com", product.id, engineer.id],
    ["Sofia", "Rivera", "sofia@nutrivae.com", growth.id, recruiter.id],
    ["Noah", "Williams", "noah@nutrivae.com", product.id, engineer.id],
    ["Ava", "Patel", "ava@nutrivae.com", people.id, recruiter.id]
  ] as const;
  const employees = [];
  for (let i = 0; i < names.length; i++) {
    const [firstName, lastName, workEmail, departmentId, jobTitleId] = names[i]!;
    const user = await prisma.user.create({
      data: { email: workEmail, passwordHash, role: i === 0 ? Role.MANAGER : Role.EMPLOYEE }
    });
    await prisma.companyMembership.create({
      data: {
        userId: user.id,
        companyId: company.id,
        systemRole: i === 0 ? Role.MANAGER : Role.EMPLOYEE,
        roleId: i === 0 ? managerRole.id : employeeRole.id
      }
    });
    employees.push(
      await prisma.employee.create({
        data: {
          companyId: company.id,
          employeeNumber: `NV-${1002 + i}`,
          firstName,
          lastName,
          workEmail,
          startDate: new Date(2022 + (i % 3), i, 10),
          status: i === 4 ? EmployeeStatus.PROBATION : EmployeeStatus.ACTIVE,
          userId: user.id,
          departmentId,
          jobTitleId,
          managerId: admin.id
        }
      })
    );
  }
  const [annual, sick, wellness] = await Promise.all([
    prisma.leaveType.create({
      data: { companyId: company.id, name: "Annual leave", color: "#30776b", defaultAllowance: 20 }
    }),
    prisma.leaveType.create({
      data: { companyId: company.id, name: "Sick leave", color: "#e26d5a", defaultAllowance: 10 }
    }),
    prisma.leaveType.create({
      data: { companyId: company.id, name: "Wellness day", color: "#8b72be", defaultAllowance: 4 }
    })
  ]);
  for (const employee of [admin, ...employees]) {
    for (const type of [annual, sick, wellness]) {
      await prisma.leaveBalance.create({
        data: { employeeId: employee.id, leaveTypeId: type.id, year: 2026, allowance: type.defaultAllowance }
      });
    }
  }
  await prisma.leaveRequest.createMany({
    data: [
      {
        employeeId: employees[0]!.id,
        leaveTypeId: annual.id,
        startDate: new Date("2026-06-24"),
        endDate: new Date("2026-06-26"),
        days: 3,
        reason: "Family trip",
        status: LeaveStatus.PENDING,
        approverId: admin.id
      },
      {
        employeeId: employees[2]!.id,
        leaveTypeId: sick.id,
        startDate: new Date("2026-06-16"),
        endDate: new Date("2026-06-16"),
        days: 1,
        reason: "Medical appointment",
        status: LeaveStatus.APPROVED,
        approverId: admin.id,
        decidedAt: new Date()
      }
    ]
  });
  await prisma.goal.createMany({
    data: [
      {
        title: "Launch onboarding 2.0",
        employeeId: admin.id,
        progress: 72,
        status: GoalStatus.ACTIVE,
        dueDate: new Date("2026-07-31")
      },
      {
        title: "Improve activation rate",
        employeeId: employees[0]!.id,
        progress: 48,
        status: GoalStatus.AT_RISK,
        dueDate: new Date("2026-07-15")
      },
      {
        title: "Reduce time-to-hire",
        employeeId: employees[2]!.id,
        progress: 84,
        status: GoalStatus.ACTIVE,
        dueDate: new Date("2026-06-30")
      }
    ]
  });
  const job = await prisma.jobOpening.create({
    data: {
      companyId: company.id,
      title: "Staff Product Engineer",
      location: "Remote · US",
      employmentType: "Full-time",
      status: JobStatus.OPEN,
      departmentId: product.id
    }
  });
  await prisma.candidate.createMany({
    data: [
      {
        firstName: "Jamie",
        lastName: "Brooks",
        email: "jamie@example.com",
        status: CandidateStatus.INTERVIEW,
        currentStage: "Technical interview",
        source: "Referral",
        jobOpeningId: job.id
      },
      {
        firstName: "Rina",
        lastName: "Kapoor",
        email: "rina@example.com",
        status: CandidateStatus.SCREENING,
        currentStage: "Hiring manager screen",
        source: "LinkedIn",
        jobOpeningId: job.id
      },
      {
        firstName: "Eli",
        lastName: "Stone",
        email: "eli@example.com",
        status: CandidateStatus.OFFER,
        currentStage: "Offer",
        source: "Careers page",
        jobOpeningId: job.id
      }
    ]
  });
  await prisma.holiday.createMany({
    data: [
      {
        companyId: company.id,
        name: "Independence Day",
        date: new Date("2026-07-04"),
        location: "United States"
      },
      { companyId: company.id, name: "Labor Day", date: new Date("2026-09-07"), location: "United States" }
    ]
  });
  await prisma.payout.createMany({
    data: [
      {
        companyId: company.id,
        employeeId: employees[0]!.id,
        amount: 7800,
        currency: "USD",
        type: "SALARY",
        status: "PAID",
        scheduledFor: new Date("2026-06-30"),
        paidAt: new Date("2026-06-30"),
        reference: "PAY-2026-061"
      },
      {
        companyId: company.id,
        employeeId: employees[2]!.id,
        amount: 1200,
        currency: "USD",
        type: "BONUS",
        status: "PROCESSING",
        scheduledFor: new Date("2026-07-05"),
        reference: "BONUS-Q2"
      }
    ]
  });
  for (const employee of [admin, ...employees]) {
    await prisma.salaryRecord.create({
      data: {
        employeeId: employee.id,
        amount: employee.id === admin.id ? 2400000 : 1464000,
        currency: "INR",
        frequency: "ANNUAL",
        effectiveFrom: new Date("2026-04-01")
      }
    });
    await prisma.employeeEssProfile.create({
      data: {
        employeeId: employee.id,
        employment: {
          confirmationDate: "2024-10-01",
          grade: employee.id === admin.id ? "G8" : "G5",
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
          { name: "Meera Sharma", relation: "Spouse", emergency: true, contactNumber: "+91 98765 43210" },
          { name: "Ravi Sharma", relation: "Father", age: 64 }
        ],
        nominees: [{ name: "Meera Sharma", type: "Provident fund", percentage: 100 }],
        immigration: [
          {
            passportNumber: "P1234567",
            issueDate: "2021-08-15",
            expiryDate: "2031-08-14",
            issuePlace: "Bengaluru"
          }
        ],
        licenses: [
          { licenseNumber: "KA01 20200012345", vehicleType: "Four wheeler", expiryDate: "2035-06-18" }
        ],
        skills: [
          { name: "Product strategy", years: 7, competency: "Excellent" },
          { name: "Data analysis", years: 5, competency: "Very good" }
        ],
        languages: [
          { language: "English", fluency: "Speak, read, write", competency: "Excellent" },
          { language: "Hindi", fluency: "Speak, read, write", competency: "Excellent" }
        ],
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
    await prisma.employeeTaxProfile.create({
      data: {
        employeeId: employee.id,
        financialYear: "2026-27",
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
    await prisma.payslip.createMany({
      data: [4, 5, 6].map((month) => ({
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
      }))
    });
    await prisma.taxDeclaration.createMany({
      data: [
        {
          companyId: company.id,
          employeeId: employee.id,
          financialYear: "2026-27",
          type: "80C",
          narration: "EPF and ELSS",
          declaredAmount: 150000,
          approvedAmount: 150000,
          status: "APPROVED"
        },
        {
          companyId: company.id,
          employeeId: employee.id,
          financialYear: "2026-27",
          type: "HRA",
          narration: "Rent",
          declaredAmount: 240000,
          claimedAmount: 120000,
          status: "PROOF_SUBMITTED"
        }
      ]
    });
    await prisma.reimbursementAccount.createMany({
      data: [
        {
          companyId: company.id,
          employeeId: employee.id,
          paymentHead: "Medical",
          financialYear: "2026-27",
          currentYearCredit: 25000,
          claimedAmount: 6500,
          paidAmount: 6500
        },
        {
          companyId: company.id,
          employeeId: employee.id,
          paymentHead: "Learning",
          financialYear: "2026-27",
          currentYearCredit: 25000
        },
        {
          companyId: company.id,
          employeeId: employee.id,
          paymentHead: "Mobile & internet",
          financialYear: "2026-27",
          currentYearCredit: 12000,
          claimedAmount: 2400,
          paidAmount: 2400
        }
      ]
    });
  }
  await prisma.employeeLoan.create({
    data: {
      employeeId: employees[0]!.id,
      loanNumber: "LN-2026-001",
      name: "Salary advance",
      issuedOn: new Date("2026-01-10"),
      amount: 120000,
      balance: 60000,
      installment: 10000,
      interestRate: 0,
      ledger: [
        { date: "2026-06-01", amount: 10000, type: "DEDUCTION" },
        { date: "2026-05-01", amount: 10000, type: "DEDUCTION" }
      ]
    }
  });
  await prisma.document.createMany({
    data: [
      {
        employeeId: admin.id,
        name: "Employment agreement.pdf",
        type: "EMPLOYMENT",
        url: "/documents/employment-agreement.pdf"
      },
      { employeeId: admin.id, name: "PAN card.pdf", type: "IDENTITY", url: "/documents/pan-card.pdf" }
    ]
  });
  const project = await prisma.project.create({
    data: {
      companyId: company.id,
      name: "Employee Experience 2.0",
      code: "EX-20",
      clientName: "Internal",
      description: "Modernize onboarding, self-service, and people operations.",
      status: "ACTIVE"
    }
  });
  await prisma.projectAssignment.createMany({
    data: [
      { projectId: project.id, employeeId: admin.id, role: "Sponsor", allocation: 20 },
      { projectId: project.id, employeeId: employees[0]!.id, role: "Product lead", allocation: 60 },
      { projectId: project.id, employeeId: employees[1]!.id, role: "Engineer", allocation: 80 }
    ]
  });
  console.log("Seeded Nutrivae HRMS. Login: admin@nutrivae.com / Welcome123!");
}

main().finally(() => prisma.$disconnect());
