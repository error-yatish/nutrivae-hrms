import { Download } from "lucide-react";
import { SectionCard } from "@/components";
import { ProfileList } from "@/modules/profile/components/ProfileDetails";
import { profileRows } from "@/modules/profile/formatters";
import type { ProfileRecord } from "@/modules/profile/types";

export function FamilySection({ profile }: { profile: ProfileRecord }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ProfileList
        title="Family members"
        rows={profileRows(profile.essProfile?.family, "name", ["relation", "occupation", "contactNumber"])}
      />
      <ProfileList
        title="Nominees"
        rows={profileRows(profile.essProfile?.nominees, "name", ["type", "percentage"])}
      />
    </div>
  );
}
export function DocumentsSection({ profile }: { profile: ProfileRecord }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ProfileList
        title="Passport & visa"
        rows={profileRows(profile.essProfile?.immigration, "passportNumber", [
          "visaName",
          "expiryDate",
          "issuePlace"
        ])}
      />
      <ProfileList
        title="Driving licences"
        rows={profileRows(profile.essProfile?.licenses, "licenseNumber", ["vehicleType", "expiryDate"])}
      />
      <SectionCard className="lg:col-span-2" title="Uploaded documents">
        <div className="divide-y divide-line">
          {profile.documents.length ? (
            profile.documents.map((document) => (
              <div key={document.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold">{document.name}</p>
                  <p className="text-xs text-muted">{document.type}</p>
                </div>
                <a className="btn-secondary !min-h-9 !px-3" href={document.url}>
                  <Download size={15} />
                  Download
                </a>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">No uploaded documents.</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
export function SkillsSection({ profile }: { profile: ProfileRecord }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ProfileList
        title="Skills"
        rows={profileRows(profile.essProfile?.skills, "name", ["years", "competency"])}
      />
      <ProfileList
        title="Languages"
        rows={profileRows(profile.essProfile?.languages, "language", ["fluency", "competency"])}
      />
      <ProfileList
        title="Qualifications"
        rows={profileRows(profile.essProfile?.qualifications, "degree", [
          "specification",
          "institute",
          "year",
          "courseType"
        ])}
      />
    </div>
  );
}
export function AssetsSection({ profile }: { profile: ProfileRecord }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ProfileList
        title="Company assets"
        rows={profileRows(profile.essProfile?.assets, "description", ["code", "cost", "issueDate"])}
      />
      <ProfileList
        title="Previous experience"
        rows={profileRows(profile.essProfile?.experience, "company", [
          "designation",
          "joiningDate",
          "leftDate"
        ])}
      />
      <ProfileList
        title="Social details"
        rows={profileRows(profile.essProfile?.social, "organization", ["post", "duration"])}
      />
    </div>
  );
}
