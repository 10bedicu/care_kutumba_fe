import type { TagConfig } from "@/types/tagConfig";

/**
 * Duplicated subset of care_fe's patient types.
 * Kept in sync manually — covers only fields used by the Kutumba plugin.
 */

export interface PatientIdentifierConfig {
  id: string;
  config: {
    use: string;
    description: string;
    system: string;
    required: boolean;
    unique: boolean;
    regex: string;
    display: string;
    default_value?: string;
    auto_maintained?: boolean;
    retrieve_config: Record<string, boolean>;
  };
  status: string;
  facility?: string;
}

export interface PatientIdentifier {
  config: PatientIdentifierConfig;
  value: string;
}

export interface PatientRead {
  id: string;
  name: string;
  gender: string;
  phone_number: string;
  emergency_phone_number?: string;
  address?: string;
  permanent_address?: string;
  pincode?: number;
  date_of_birth?: string | null;
  deceased_datetime?: string | null;
  blood_group?: string;
  year_of_birth?: number | null;
  created_date?: string;
  modified_date?: string;
  instance_tags: TagConfig[];
  facility_tags: TagConfig[];
  instance_identifiers: PatientIdentifier[];
  facility_identifiers: PatientIdentifier[];
  extensions?: Record<string, Record<string, unknown>>;
}
