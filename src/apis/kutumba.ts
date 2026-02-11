import { HttpMethod, apiRoutes, mutate } from "@/lib/request";

import type { KutumbaLookupResponse } from "@/types/kutumba";

const kutumbaRoutes = apiRoutes({
  lookupByRcNumber: {
    method: HttpMethod.POST,
    path: "/api/care_kutumba/beneficiary/lookup/",
    TRequest: {} as { rc_number: string },
    TResponse: {} as KutumbaLookupResponse,
  },
});

export const kutumbaApis = {
  lookupByRcNumber: mutate(kutumbaRoutes.lookupByRcNumber),
};
