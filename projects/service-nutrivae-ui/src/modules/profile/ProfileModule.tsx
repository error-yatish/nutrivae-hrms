import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { PageHeader, Skeleton, Tabs } from "@/components";
import { api } from "@/lib/api";
import {
  AssetsSection,
  DocumentsSection,
  EmploymentSection,
  FamilySection,
  PersonalSection,
  ProfileSummary,
  SkillsSection
} from "@/modules/profile/components";
import { ProfileChangeDrawer } from "@/modules/profile/drawers";
import type { ProfileRecord, ProfileTab } from "@/modules/profile/types";

export function ProfilePage() {
  const [tab, setTab] = useState<ProfileTab>("employment");
  const [editing, setEditing] = useState(false);
  const query = useQuery({
    queryKey: ["ess-profile"],
    queryFn: () => api.get<ProfileRecord>("/ess/profile")
  });
  if (query.isLoading) return <Skeleton className="h-96" />;
  const profile = query.data?.data;
  if (!profile) return <div className="card p-8">This account is not linked to an employee profile.</div>;
  return (
    <div className="page">
      <PageHeader
        eyebrow="Employee self-service"
        title="My records"
        description="Review your records and submit corrections for approval."
        actions={
          <button className="btn-primary" onClick={() => setEditing(true)}>
            <Pencil size={16} />
            Request changes
          </button>
        }
      />
      <ProfileSummary profile={profile} />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "employment", label: "Employment & contact" },
          { id: "personal", label: "Personal & statutory" },
          { id: "family", label: "Family & nominees" },
          { id: "documents", label: "Identity & travel" },
          { id: "skills", label: "Skills & education" },
          { id: "assets", label: "Assets & experience" }
        ]}
      />
      {tab === "employment" && <EmploymentSection profile={profile} />}
      {tab === "personal" && <PersonalSection profile={profile} />}
      {tab === "family" && <FamilySection profile={profile} />}
      {tab === "documents" && <DocumentsSection profile={profile} />}
      {tab === "skills" && <SkillsSection profile={profile} />}
      {tab === "assets" && <AssetsSection profile={profile} />}
      <ProfileChangeDrawer open={editing} onClose={() => setEditing(false)} profile={profile} />
    </div>
  );
}
