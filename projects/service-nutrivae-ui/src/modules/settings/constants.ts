export const permissions: Array<[string, string]> = [
  ["employees.manage", "Manage employees"],
  ["organization.manage", "Manage departments and titles"],
  ["leave.approve", "Approve leave"],
  ["goals.manage", "Manage goals"],
  ["recruitment.manage", "Manage recruitment"],
  ["payouts.manage", "Manage payouts"],
  ["projects.manage", "Manage projects and assignments"]
];

export const countryOptions = [
  { value: "United States", label: "United States" },
  { value: "India", label: "India" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "United Arab Emirates", label: "United Arab Emirates" }
];

export const currencyOptions = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "AED", label: "AED — UAE Dirham" }
];

export const timezoneOptions = [
  { value: "America/New_York", label: "Eastern Time (US)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US)" },
  { value: "Asia/Kolkata", label: "India Standard Time" },
  { value: "Europe/London", label: "London" },
  { value: "Asia/Dubai", label: "Dubai" }
];
