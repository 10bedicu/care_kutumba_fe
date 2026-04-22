import { HttpMethod, apiRoutes, mutate } from "@/lib/request";

import type { KutumbaLookupResponse } from "@/types/kutumba";
import type { PatientRead } from "@/types/patient";

const kutumbaRoutes = apiRoutes({
  lookupByRcNumber: {
    method: HttpMethod.POST,
    path: "/api/care_kutumba/beneficiary/lookup/",
    TRequest: {} as { rc_number: string },
    TResponse: {} as KutumbaLookupResponse,
  },
});

const patientRoutes = apiRoutes({
  setInstanceTags: {
    method: HttpMethod.POST,
    path: "/api/v1/patient/{id}/set_instance_tags/",
    TRequest: {} as { tags: string[] },
    TResponse: {} as PatientRead,
  },
  removeInstanceTags: {
    method: HttpMethod.POST,
    path: "/api/v1/patient/{id}/remove_instance_tags/",
    TRequest: {} as { tags: string[] },
    TResponse: {} as PatientRead,
  },
  updateIdentifier: {
    method: HttpMethod.POST,
    path: "/api/v1/patient/{id}/update_identifier/",
    TRequest: {} as { config: string; value: string },
    TResponse: undefined as unknown as void,
  },
});

export const kutumbaApis = {
  lookupByRcNumber: mutate(kutumbaRoutes.lookupByRcNumber),
};

export const patientApis = {
  setInstanceTags: patientRoutes.setInstanceTags,
  removeInstanceTags: patientRoutes.removeInstanceTags,
  updateIdentifier: patientRoutes.updateIdentifier,
};
