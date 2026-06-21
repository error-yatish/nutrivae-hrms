import type { JsonRecord } from "@/modules/profile/types";

export function displayProfileValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
export function formatProfileDate(value: unknown) {
  return value ? new Date(String(value)).toLocaleDateString() : "—";
}
export function profileRows(rows: JsonRecord[] | undefined, titleKey: string, detailKeys: string[]) {
  return (rows ?? []).map((row) => [
    displayProfileValue(row[titleKey]),
    detailKeys
      .map((key) => displayProfileValue(row[key]))
      .filter((value) => value !== "—")
      .join(" · ") || "—"
  ]);
}
