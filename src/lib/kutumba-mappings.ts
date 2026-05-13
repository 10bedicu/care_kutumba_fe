import { kutumbaConfig } from "@/config";
import type { KutumbaMember } from "@/types/kutumba";

/**
 * Mapping from Kutumba rc_type values to env-configured tag IDs.
 * PHH (Priority Household) maps to BPL, NPHH (Non-Priority) maps to APL.
 *
 * Computed lazily so values reflect the host's runtime plug config
 * (`window.__CARE_PLUGIN_RUNTIME__`), which is populated after this module
 * is first evaluated.
 */
export const getRcTypeToTagId = (): Record<string, string | undefined> => ({
  BPL: kutumbaConfig.bplTagId,
  APL: kutumbaConfig.aplTagId,
  PHH: kutumbaConfig.bplTagId,
  NPHH: kutumbaConfig.aplTagId,
});

/**
 * Display names for rc_type values.
 * Shows user-friendly names in UI: PHH displays as "BPL", NPHH displays as "APL".
 * We're already using APL and BPL names
 */
export const RC_TYPE_TO_DISPLAY_NAME: Record<string, string> = {
  BPL: "BPL",
  APL: "APL",
  PHH: "BPL",
  NPHH: "APL",
};

export const getAllRationTagIds = (): string[] =>
  [kutumbaConfig.bplTagId, kutumbaConfig.aplTagId].filter(Boolean) as string[];

/** All tag IDs that this plugin manages — cleared before re-applying. */
export const getAllManagedTagIds = (): string[] =>
  [
    ...getAllRationTagIds(),
    kutumbaConfig.studentUnverifiedTagId,
    kutumbaConfig.pwdUnverifiedTagId,
  ].filter(Boolean) as string[];

/**
 * Identifier config ID → Kutumba member field mapping.
 */
export const getIdentifierFieldMap = (): {
  configId: string | undefined;
  field: keyof KutumbaMember;
}[] => [
  { configId: kutumbaConfig.rcNumberIdentifierId, field: "rc_number" },
  { configId: kutumbaConfig.healthIdIdentifierId, field: "health_id" },
  { configId: kutumbaConfig.educationIdIdentifierId, field: "education_id" },
];

export const GENDER_MAP: Record<string, string> = {
  M: "male",
  F: "female",
  O: "transgender",
};

/**
 * Parses a date string in DD/MM/YYYY format and returns YYYY-MM-DD.
 */
export function parseKutumbaDate(dateStr: string): string | undefined {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return undefined;
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
