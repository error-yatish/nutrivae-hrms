import { ProfileDetails } from "@/modules/profile/components/ProfileDetails";
import type { ProfileRecord } from "@/modules/profile/types";

export function PersonalSection({ profile }: { profile: ProfileRecord }) {
  const personal = profile.essProfile?.personal ?? {};
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ProfileDetails
        title="Personal information"
        items={[
          [
            "Date of birth",
            profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : undefined
          ],
          ["Gender", profile.gender],
          ["Marital status", profile.maritalStatus],
          ["Nationality", profile.nationality],
          ["Blood group", profile.bloodGroup],
          ["Religion", personal.religion],
          ["Languages", Array.isArray(personal.languages) ? personal.languages.join(", ") : undefined],
          ["Identification mark", personal.identificationMark]
        ]}
      />
      <ProfileDetails
        title="Statutory & bank"
        items={[
          ["PAN", profile.taxIdentifier],
          ["UAN", personal.uan],
          ["Aadhaar", personal.aadhaarNumber],
          ["PF number", personal.pfNumber],
          ["ESIC number", personal.esicNumber],
          ["Bank", profile.bankName],
          ["Account type", personal.accountType],
          [
            "Account number",
            profile.bankAccountNumber ? `•••• ${profile.bankAccountNumber.slice(-4)}` : undefined
          ]
        ]}
      />
    </div>
  );
}
