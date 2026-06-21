export type LeaveRecord = {
  id: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  employee: { firstName: string; lastName: string; department?: { name: string } };
  leaveType: { id: string; name: string; color: string };
};
export type LeaveTypeRecord = { id: string; name: string; color: string };
export type LeaveBalanceRecord = {
  id: string;
  allowance: number;
  used: number;
  leaveType: LeaveTypeRecord;
};
