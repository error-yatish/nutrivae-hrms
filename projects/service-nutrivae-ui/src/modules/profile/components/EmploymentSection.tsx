import { ProfileDetails } from "@/modules/profile/components/ProfileDetails";
import { formatProfileDate } from "@/modules/profile/formatters";
import type { ProfileRecord } from "@/modules/profile/types";

export function EmploymentSection({ profile }: { profile: ProfileRecord }) {
  const employment = profile.essProfile?.employment ?? {};
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ProfileDetails
        title="Employment details"
        items={[
          ["Employee code", profile.employeeNumber],
          ["Designation", profile.jobTitle?.name],
          ["Department", profile.department?.name],
          ["Branch", employment.branch],
          ["Division", employment.division],
          ["Grade", employment.grade],
          ["Joining date", new Date(profile.startDate).toLocaleDateString()],
          ["Confirmation date", formatProfileDate(employment.confirmationDate)],
          [
            "Manager",
            profile.manager ? `${profile.manager.firstName} ${profile.manager.lastName}` : undefined
          ]
        ]}
      />
      <ProfileDetails
        title="Contact details"
        items={[
          ["Work email", profile.workEmail],
          ["Personal email", profile.personalEmail],
          ["Mobile", profile.phone],
          ["Address", profile.address],
          ["City", profile.city],
          ["State", profile.state],
          ["PIN code", profile.postalCode],
          ["Country", profile.country]
        ]}
      />
    </div>
  );
}
