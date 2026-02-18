import { HttpMethod, apiRoutes, query, request } from "@/lib/request";
import type { PaginatedResponse } from "@/lib/request";

import type {
  Appointment,
  AppointmentCreateRequest,
  GetSlotsForDayResponse,
  HealthcareService,
} from "@/types/scheduling";

const schedulingRoutes = apiRoutes({
  listHealthcareServices: {
    method: HttpMethod.GET,
    path: "/api/v1/facility/{facilityId}/healthcare_service/",
    TRequest: {} as never,
    TResponse: {} as PaginatedResponse<HealthcareService>,
  },
  getSlotsForDay: {
    method: HttpMethod.POST,
    path: "/api/v1/facility/{facilityId}/slots/get_slots_for_day/",
    TRequest: {} as {
      resource_type: "healthcare_service";
      resource_id: string;
      day: string;
    },
    TResponse: {} as GetSlotsForDayResponse,
  },
  createAppointment: {
    method: HttpMethod.POST,
    path: "/api/v1/facility/{facilityId}/slots/{slotId}/create_appointment/",
    TRequest: {} as AppointmentCreateRequest,
    TResponse: {} as Appointment,
  },
});

export const schedulingQueries = {
  listHealthcareServices: (facilityId: string) =>
    query(schedulingRoutes.listHealthcareServices, {
      pathParams: { facilityId },
      queryParams: { limit: 50 },
    }),
};

/**
 * Fetches today's slots for a healthcare service, finds the first available,
 * and books an appointment for the given patient.
 */
export async function bookAppointmentForToday({
  facilityId,
  serviceId,
  patientId,
}: {
  facilityId: string;
  serviceId: string;
  patientId: string;
}): Promise<Appointment> {
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local timezone
  console.log(
    `Attempting to book appointment for patient ${patientId} at facility ${facilityId} for service ${serviceId} on ${today}`,
  );

  // 1. Get today's slots for the selected healthcare service
  const slotsResponse = await request(schedulingRoutes.getSlotsForDay, {
    pathParams: { facilityId },
    body: {
      resource_type: "healthcare_service" as const,
      resource_id: serviceId,
      day: today,
    },
  });

  // 2. Find first slot with available capacity
  const availableSlot = slotsResponse.results.find(
    (slot) => slot.allocated < slot.availability.tokens_per_slot,
  );

  if (!availableSlot) {
    throw new Error("No available slots for today");
  }

  // 3. Create the appointment
  return request(schedulingRoutes.createAppointment, {
    pathParams: { facilityId, slotId: availableSlot.id },
    body: {
      patient: patientId,
      note: "Auto-booked via Kutumba",
      tags: [],
    },
  });
}
