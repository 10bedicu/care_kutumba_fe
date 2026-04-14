import { lazy } from "react";

import routes from "./routes";

const manifest = {
  plugin: "care-kutumba-fe",
  routes,
  extends: [],
  components: {
    PatientRegistrationForm: lazy(
      () => import("./components/pluggables/PatientRegistrationForm"),
    ),
    PatientInfoCardActions: lazy(
      () => import("./components/pluggables/PatientInfoCardActions"),
    ),
  },
  devices: [],
} as const;

export default manifest;
