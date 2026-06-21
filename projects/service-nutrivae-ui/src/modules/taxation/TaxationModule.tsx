import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calculator, FileCheck2, Landmark, ShieldCheck } from "lucide-react";
import { PageHeader, Skeleton, Tabs } from "@/components";
import { api } from "@/lib/api";
import {
  DeclarationsSection,
  PreviousEmployerSection,
  ProjectionSection
} from "@/modules/taxation/components";
import { defaultTaxProfile, type TaxData, type TaxProfile, type TaxTab } from "@/modules/taxation/types";

export function TaxationPage() {
  const [tab, setTab] = useState<TaxTab>("projection");
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["ess-taxation"], queryFn: () => api.get<TaxData>("/ess/taxation") });
  const refresh = () => void client.invalidateQueries({ queryKey: ["ess-taxation"] });
  const profileMutation = useMutation({
    mutationFn: (input: Partial<TaxProfile>) =>
      api.patch("/ess/taxation/profile", { ...defaultTaxProfile, ...query.data?.data.profile, ...input }),
    onSuccess: refresh
  });
  const declarationMutation = useMutation({
    mutationFn: (input: unknown) => api.post("/ess/taxation/declarations", input),
    onSuccess: refresh
  });
  const previousMutation = useMutation({
    mutationFn: (input: unknown) => api.patch("/ess/taxation/previous-employer", input),
    onSuccess: refresh
  });
  if (query.isLoading) return <Skeleton className="h-96" />;
  const data = query.data?.data;

  const addDeclaration = (claim = false) => {
    const type = window.prompt("Declaration type (for example 80C, HRA, 80D)");
    const narration = type ? window.prompt("Narration") : null;
    const amount = narration ? Number(window.prompt(claim ? "Claimed amount" : "Declared amount")) : NaN;
    if (!type || !narration || !Number.isFinite(amount)) return;
    declarationMutation.mutate({
      type,
      narration,
      declaredAmount: amount,
      ...(claim && { claimedAmount: amount })
    });
  };
  const addPreviousEmployer = () => {
    const employerName = window.prompt("Previous employer name");
    if (!employerName) return;
    const grossSalary = Number(window.prompt("Gross salary", "0")) || 0;
    previousMutation.mutate({
      employerName,
      grossSalary,
      basic: grossSalary,
      allowances: 0,
      hra: 0,
      da: 0,
      professionalTax: 0,
      tdsDeducted: 0,
      pfDeducted: 0
    });
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Taxation"
        title="Income tax"
        description={`Declarations and projection for FY ${data?.financialYear ?? "2026-27"}.`}
      />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "projection", label: "Projection", icon: <Calculator size={16} /> },
          {
            id: "declarations",
            label: "Declarations",
            icon: <FileCheck2 size={16} />,
            count: data?.declarations.filter((item) => !item.claimedAmount).length ?? 0
          },
          {
            id: "claims",
            label: "Claims & proof",
            icon: <ShieldCheck size={16} />,
            count: data?.declarations.filter((item) => item.claimedAmount).length ?? 0
          },
          { id: "previous", label: "Previous employer", icon: <Landmark size={16} /> }
        ]}
      />
      {tab === "projection" && (
        <ProjectionSection
          profile={data?.profile}
          onToggle={(key, value) => profileMutation.mutate({ [key]: value })}
        />
      )}
      {tab === "declarations" && (
        <DeclarationsSection
          rows={data?.declarations.filter((item) => !item.claimedAmount) ?? []}
          onAdd={() => addDeclaration()}
        />
      )}
      {tab === "claims" && (
        <DeclarationsSection
          rows={data?.declarations.filter((item) => item.claimedAmount) ?? []}
          onAdd={() => addDeclaration(true)}
          claim
        />
      )}
      {tab === "previous" && (
        <PreviousEmployerSection data={data?.previousEmployer} onAdd={addPreviousEmployer} />
      )}
    </div>
  );
}
