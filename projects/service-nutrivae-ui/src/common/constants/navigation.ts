import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Target,
  BriefcaseBusiness,
  WalletCards,
  BarChart3,
  FolderKanban,
  ReceiptIndianRupee,
  ListChecks,
  Network
} from "lucide-react";

export const navigationItems = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "People", path: "/employees", icon: Users },
  { label: "Time off", path: "/leave", icon: CalendarDays },
  { label: "Performance", path: "/performance", icon: Target },
  { label: "Recruitment", path: "/recruitment", icon: BriefcaseBusiness },
  { label: "Compensation", path: "/payroll", icon: WalletCards },
  { label: "Taxation", path: "/taxation", icon: ReceiptIndianRupee },
  { label: "Quick info", path: "/quick-info", icon: ListChecks },
  { label: "Workflow", path: "/workflow", icon: Network },
  { label: "Payouts", path: "/payouts", icon: WalletCards },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "Analytics", path: "/analytics", icon: BarChart3 }
];
