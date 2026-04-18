export interface KutumbaMember {
  health_id: string;
  caste: string | null;
  education_id: string | null;
  disability_applicant_no: string | null;
  name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  pincode: string | null;
  rc_number: string;
  rc_type: string;
  relation_name: string;
  mobile_no: string;
  kutumba_id_status: string;
  rch_id: string | null;
}

export interface KutumbaLookupResponse {
  success: boolean;
  status_code: number;
  status_text: string;
  response_id: string | null;
  request_id: string;
  request_log_external_id: string | null;
  members: KutumbaMember[];
  error: string | null;
}

export interface KutumbaMemberSelectionContext {
  selectedMemberIndex: number;
  requestLogExternalId: string | null;
}

export interface PatientLinkRequest {
  request_log_external_id: string;
  selected_member_index: number;
  patient_external_id: string | null;
  action: "create" | "update";
}

export interface PatientLinkResponse {
  success: boolean;
  external_id: string;
  request_log_external_id: string;
  selected_member_index: number;
  patient_external_id: string | null;
  action: "create" | "update";
}
