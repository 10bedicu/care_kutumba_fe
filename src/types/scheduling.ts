export interface TokenSlot {
  id: string;
  availability: {
    name: string;
    tokens_per_slot: number;
    schedule: {
      id: string;
      name: string;
    };
  };
  start_datetime: string;
  end_datetime: string;
  allocated: number;
}

export interface GetSlotsForDayResponse {
  results: TokenSlot[];
}

export interface AppointmentCreateRequest {
  patient: string;
  note: string;
  tags: string[];
}

export interface Appointment {
  id: string;
  token_slot: TokenSlot;
  booked_on: string;
  status: string;
  note: string;
}

export interface HealthcareService {
  id: string;
  name: string;
  styling_metadata: {
    careIcon?: string;
  };
  extra_details: string;
  internal_type?: string;
}
