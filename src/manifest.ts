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
  },
  devices: [],
} as const;

export default manifest;
