import { Router, type Request } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "@nutrivae/database";
import {
  previousEmployerTaxSchema,
  profileChangeSchema,
  taxDeclarationSchema,
  taxProfileSchema
} from "@nutrivae/shared";
import { authenticate } from "../../lib/auth.js";
import { audit } from "../../lib/audit.js";
import { AppError, asyncHandler } from "../../lib/errors.js";

export const essRouter = Router();
essRouter.use(authenticate);
const financialYear = "2026-27";

function employeeId(req: Request) {
  const id = req.user?.employeeId;
  if (!id) throw new AppError(400, "This account is not linked to an employee.", "EMPLOYEE_REQUIRED");
  return id;
}

async function scopedEmployee(req: Request) {
  const employee = await prisma.employee.findFirst({
    where: { id: employeeId(req), companyId: req.user!.companyId },
    include: {
      department: true,
      team: true,
      jobTitle: true,
      manager: { select: { id: true, firstName: true, lastName: true, workEmail: true } },
      documents: true,
      essProfile: true,
      profileChangeRequests: { orderBy: { createdAt: "desc" }, take: 10 }
    }
  });
  if (!employee) throw new AppError(404, "Employee profile not found.", "NOT_FOUND");
  return employee;
}

essRouter.get(
  "/ess/profile",
  asyncHandler(async (req, res) => res.json({ data: await scopedEmployee(req) }))
);

essRouter.post(
  "/ess/profile/change-requests",
  asyncHandler(async (req, res) => {
    const input = profileChangeSchema.parse(req.body);
    const employee = await scopedEmployee(req);
    const request = await prisma.profileChangeRequest.create({
      data: {
        employeeId: employee.id,
        reviewerId: employee.managerId,
        section: input.section,
        changes: input.changes as Prisma.InputJsonValue
      }
    });
    await audit(req, "PROFILE_CHANGE_REQUESTED", "ProfileChangeRequest", request.id, {
      section: input.section
    });
    res.status(201).json({ data: request });
  })
);

essRouter.get(
  "/ess/salary",
  asyncHandler(async (req, res) => {
    const id = employeeId(req);
    const [salary, payslips] = await Promise.all([
      prisma.salaryRecord.findFirst({ where: { employeeId: id }, orderBy: { effectiveFrom: "desc" } }),
      prisma.payslip.findMany({ where: { employeeId: id }, orderBy: [{ year: "desc" }, { month: "desc" }] })
    ]);
    const latest = payslips[0];
    const annualCtc = salary ? Number(salary.amount) : 0;
    const grossMonthly = latest
      ? Number(latest.basic) +
        Number(latest.da) +
        Number(latest.hra) +
        Number(latest.conveyance) +
        Number(latest.educationAllowance) +
        Number(latest.otherAllowances)
      : annualCtc / 12;
    const monthlyDeductions = latest
      ? Number(latest.providentFund) +
        Number(latest.esic) +
        Number(latest.professionalTax) +
        Number(latest.tds) +
        Number(latest.otherDeductions)
      : 0;
    res.json({
      data: {
        ctc: {
          annualCtc,
          grossMonthly,
          monthlyDeductions,
          netTakeHome: grossMonthly - monthlyDeductions,
          currency: salary?.currency ?? latest?.currency ?? "INR",
          effectiveFrom: salary?.effectiveFrom ?? null
        },
        payslips
      }
    });
  })
);

essRouter.get(
  "/ess/taxation",
  asyncHandler(async (req, res) => {
    const id = employeeId(req);
    const [profile, declarations, previousEmployer] = await Promise.all([
      prisma.employeeTaxProfile.findUnique({ where: { employeeId: id } }),
      prisma.taxDeclaration.findMany({
        where: { employeeId: id, financialYear },
        orderBy: { createdAt: "desc" }
      }),
      prisma.previousEmployerTax.findUnique({ where: { employeeId: id } })
    ]);
    res.json({ data: { profile, declarations, previousEmployer, financialYear } });
  })
);

essRouter.patch(
  "/ess/taxation/profile",
  asyncHandler(async (req, res) => {
    const input = taxProfileSchema.parse(req.body);
    const id = employeeId(req);
    const profile = await prisma.employeeTaxProfile.upsert({
      where: { employeeId: id },
      update: input,
      create: { employeeId: id, financialYear, ...input }
    });
    await audit(req, "TAX_PROFILE_UPDATED", "EmployeeTaxProfile", profile.id);
    res.json({ data: profile });
  })
);

essRouter.post(
  "/ess/taxation/declarations",
  asyncHandler(async (req, res) => {
    const input = taxDeclarationSchema.parse(req.body);
    const declaration = await prisma.taxDeclaration.create({
      data: {
        ...input,
        employeeId: employeeId(req),
        companyId: req.user!.companyId,
        financialYear,
        status: input.claimedAmount ? "PROOF_SUBMITTED" : "DECLARED"
      }
    });
    await audit(req, "TAX_DECLARATION_CREATED", "TaxDeclaration", declaration.id, { type: input.type });
    res.status(201).json({ data: declaration });
  })
);

essRouter.patch(
  "/ess/taxation/previous-employer",
  asyncHandler(async (req, res) => {
    const input = previousEmployerTaxSchema.parse(req.body);
    const id = employeeId(req);
    const record = await prisma.previousEmployerTax.upsert({
      where: { employeeId: id },
      update: input,
      create: { ...input, employeeId: id, financialYear }
    });
    await audit(req, "PREVIOUS_EMPLOYER_TAX_UPDATED", "PreviousEmployerTax", record.id);
    res.json({ data: record });
  })
);

essRouter.get(
  "/ess/quick-info",
  asyncHandler(async (req, res) => {
    const id = employeeId(req);
    const [leaveBalances, loans, reimbursements, holidays, documents, directory] = await Promise.all([
      prisma.leaveBalance.findMany({
        where: { employeeId: id, year: new Date().getFullYear() },
        include: { leaveType: true }
      }),
      prisma.employeeLoan.findMany({ where: { employeeId: id }, orderBy: { issuedOn: "desc" } }),
      prisma.reimbursementAccount.findMany({
        where: { employeeId: id, financialYear },
        orderBy: { paymentHead: "asc" }
      }),
      prisma.holiday.findMany({ where: { companyId: req.user!.companyId }, orderBy: { date: "asc" } }),
      prisma.document.findMany({ where: { employeeId: id }, orderBy: { createdAt: "desc" } }),
      prisma.employee.findMany({
        where: { companyId: req.user!.companyId, status: { not: "INACTIVE" } },
        select: {
          id: true,
          employeeNumber: true,
          firstName: true,
          lastName: true,
          workEmail: true,
          phone: true,
          city: true,
          department: { select: { name: true } },
          jobTitle: { select: { name: true } }
        },
        orderBy: { firstName: "asc" }
      })
    ]);
    res.json({ data: { leaveBalances, loans, reimbursements, holidays, documents, directory } });
  })
);

essRouter.get(
  "/ess/workflow",
  asyncHandler(async (req, res) => {
    const employee = await scopedEmployee(req);
    const [reports, leaveCounts, changeCounts, organization, pendingRequests] = await Promise.all([
      prisma.employee.findMany({
        where: { managerId: employee.id },
        select: {
          id: true,
          employeeNumber: true,
          firstName: true,
          lastName: true,
          jobTitle: { select: { name: true } }
        },
        orderBy: { firstName: "asc" }
      }),
      prisma.leaveRequest.groupBy({ by: ["status"], where: { approverId: employee.id }, _count: true }),
      prisma.profileChangeRequest.groupBy({
        by: ["status"],
        where: { reviewerId: employee.id },
        _count: true
      }),
      prisma.employee.findMany({
        where: { companyId: req.user!.companyId, status: { not: "INACTIVE" } },
        select: {
          id: true,
          managerId: true,
          firstName: true,
          lastName: true,
          department: { select: { name: true } },
          jobTitle: { select: { name: true } }
        },
        orderBy: { firstName: "asc" }
      }),
      prisma.profileChangeRequest.findMany({
        where: { reviewerId: employee.id, status: "PENDING" },
        include: { employee: { select: { firstName: true, lastName: true, employeeNumber: true } } },
        orderBy: { createdAt: "asc" }
      })
    ]);
    const counts: Record<string, number> = { PENDING: 0, APPROVED: 0, REJECTED: 0, TOTAL: 0 };
    for (const item of [...leaveCounts, ...changeCounts]) {
      counts[item.status] = (counts[item.status] ?? 0) + item._count;
      counts.TOTAL = (counts.TOTAL ?? 0) + item._count;
    }
    const manager = employee.manager;
    const approverName = manager ? `${manager.firstName} ${manager.lastName}` : "HR team";
    res.json({
      data: {
        approvers: [
          { module: "Leave", name: approverName, level: "Level 1" },
          { module: "Profile changes", name: approverName, level: "Manager review" },
          { module: "Expense", name: approverName, level: "Level 1" },
          { module: "Travel", name: approverName, level: "Level 1" }
        ],
        reports,
        counts,
        organization,
        pendingRequests
      }
    });
  })
);

essRouter.patch(
  "/ess/profile/change-requests/:id/review",
  asyncHandler(async (req, res) => {
    const status = String(req.body.status);
    if (!["APPROVED", "REJECTED"].includes(status))
      throw new AppError(400, "Status must be APPROVED or REJECTED.", "VALIDATION_ERROR");
    const existing = await prisma.profileChangeRequest.findFirst({
      where: { id: String(req.params.id), reviewerId: employeeId(req) },
      include: { employee: true }
    });
    if (!existing) throw new AppError(404, "Change request not found.", "NOT_FOUND");
    const changes = existing.changes as Record<string, unknown>;
    const employeeFields = new Set([
      "personalEmail",
      "phone",
      "address",
      "city",
      "postalCode",
      "maritalStatus",
      "bloodGroup",
      "taxIdentifier"
    ]);
    const approvedEmployeeChanges = Object.fromEntries(
      Object.entries(changes)
        .map(([key, value]): [string, unknown] => [key === "pan" ? "taxIdentifier" : key, value])
        .filter(([key]) => employeeFields.has(key))
    );
    const request = await prisma.$transaction(async (tx) => {
      if (status === "APPROVED" && Object.keys(approvedEmployeeChanges).length) {
        await tx.employee.update({
          where: { id: existing.employeeId },
          data: approvedEmployeeChanges as Prisma.EmployeeUpdateInput
        });
      }
      return tx.profileChangeRequest.update({
        where: { id: existing.id },
        data: {
          status,
          reviewNote: req.body.reviewNote ? String(req.body.reviewNote) : undefined,
          reviewedAt: new Date()
        }
      });
    });
    await audit(req, "PROFILE_CHANGE_REVIEWED", "ProfileChangeRequest", request.id, { status });
    res.json({ data: request });
  })
);
