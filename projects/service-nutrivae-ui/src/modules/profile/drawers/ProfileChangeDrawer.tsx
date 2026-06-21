import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Drawer, Tabs } from "@/components";
import { FormField, TextAreaField } from "@/components/forms";
import { api } from "@/lib/api";
import type { ProfileEditTab, ProfileRecord } from "@/modules/profile/types";

export function ProfileChangeDrawer({
  open,
  onClose,
  profile
}: {
  open: boolean;
  onClose: () => void;
  profile: ProfileRecord;
}) {
  const [tab, setTab] = useState<ProfileEditTab>("contact");
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: (changes: Record<string, FormDataEntryValue>) =>
      api.post("/ess/profile/change-requests", { section: tab, changes }),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["ess-profile"] });
      onClose();
    }
  });
  return (
    <Drawer open={open} onClose={onClose} title="Request profile changes">
      <div className="space-y-5">
        <div className="rounded-xl bg-canvas p-3 text-xs text-muted">
          Changes are sent to your assigned approver and remain pending until reviewed.
        </div>
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { id: "contact", label: "Contact" },
            { id: "personal", label: "Personal" },
            { id: "family", label: "Family" },
            { id: "career", label: "Skills & career" }
          ]}
        />
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate(Object.fromEntries(new FormData(event.currentTarget).entries()));
          }}
        >
          {tab === "contact" && (
            <div className="form-grid">
              <FormField name="personalEmail" label="Personal email" defaultValue={profile.personalEmail} />
              <FormField name="phone" label="Phone" defaultValue={profile.phone} />
              <FormField
                name="address"
                className="sm:col-span-2"
                label="Address"
                defaultValue={profile.address}
              />
              <FormField name="city" label="City" defaultValue={profile.city} />
              <FormField name="postalCode" label="PIN code" defaultValue={profile.postalCode} />
            </div>
          )}
          {tab === "personal" && (
            <div className="form-grid">
              <FormField name="maritalStatus" label="Marital status" defaultValue={profile.maritalStatus} />
              <FormField name="bloodGroup" label="Blood group" defaultValue={profile.bloodGroup} />
              <FormField
                name="nameAsPerPan"
                label="Name as per PAN"
                defaultValue={`${profile.firstName} ${profile.lastName}`}
              />
              <FormField name="pan" label="PAN" defaultValue={profile.taxIdentifier} />
            </div>
          )}
          {tab === "family" && (
            <div className="space-y-4">
              <FormField name="name" label="Member / nominee name" />
              <div className="form-grid">
                <FormField name="relationship" label="Relationship" />
                <FormField name="dateOfBirth" label="Date of birth" type="date" />
              </div>
              <FormField name="contactNumber" label="Contact number" />
              <TextAreaField name="address" label="Address" />
            </div>
          )}
          {tab === "career" && (
            <div className="space-y-4">
              <FormField name="subject" label="Skill / qualification / company" />
              <div className="form-grid">
                <FormField name="experienceYears" label="Experience in years" type="number" />
                <FormField name="competency" label="Competency / grade" />
              </div>
              <TextAreaField name="details" label="Details" />
            </div>
          )}
          {mutation.isError && <p className="text-sm text-error">{mutation.error.message}</p>}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" disabled={mutation.isPending}>
              Submit for approval
            </button>
          </div>
        </form>
      </div>
    </Drawer>
  );
}
