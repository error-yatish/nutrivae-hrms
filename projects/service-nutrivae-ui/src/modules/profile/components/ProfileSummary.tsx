import { Avatar, Badge } from "@/components";
import type { ProfileRecord } from "@/modules/profile/types";

export function ProfileSummary({ profile }: { profile: ProfileRecord }) {
  const name = `${profile.firstName} ${profile.lastName}`;
  return (
    <section className="card p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Avatar name={name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl font-bold">{name}</h2>
            <Badge tone="green">{profile.status.toLowerCase()}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted">
            {profile.jobTitle?.name ?? "Employee"} · {profile.department?.name ?? "No department"} ·{" "}
            {profile.employeeNumber}
          </p>
        </div>
        <div className="text-sm sm:text-right">
          <p className="font-semibold">{profile.workEmail}</p>
          <p className="text-muted">Joined {new Date(profile.startDate).toLocaleDateString()}</p>
        </div>
      </div>
    </section>
  );
}
