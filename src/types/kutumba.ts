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
  members: KutumbaMember[];
  error: string | null;
}
