// Plug configuration.
//
// Resolution order for each value:
//   1. Host runtime config — set from "App Setup" in care_fe and exposed at
//      `window.__CARE_PLUGIN_RUNTIME__.meta.care_kutumba_fe.config[<key>]`.
//   2. Build-time `import.meta.env.<key>` — used for local dev / standalone runs
//      where the plug is not embedded in care_fe.
//
// Mirrors the pattern used by care_abdm_fe.

type EnvKey =
  | "REACT_KUTUMBA_BPL_TAG_ID"
  | "REACT_KUTUMBA_APL_TAG_ID"
  | "REACT_KUTUMBA_RC_NUMBER_IDENTIFIER_ID"
  | "REACT_KUTUMBA_HEALTH_ID_IDENTIFIER_ID"
  | "REACT_KUTUMBA_EDUCATION_ID_IDENTIFIER_ID"
  | "REACT_KUTUMBA_STUDENT_UNVERIFIED_TAG_ID"
  | "REACT_KUTUMBA_PWD_UNVERIFIED_TAG_ID"
  | "REACT_KUTUMBA_AUTO_SUBMIT_ON_FILL";

function readConfig(key: EnvKey): string | undefined {
  const runtime = (
    window as Window & {
      __CARE_PLUGIN_RUNTIME__?: {
        meta?: {
          care_kutumba_fe?: { config?: Record<string, string | undefined> };
        };
      };
    }
  ).__CARE_PLUGIN_RUNTIME__?.meta?.care_kutumba_fe?.config;

  const runtimeValue = runtime?.[key];
  if (runtimeValue !== undefined && runtimeValue !== "") return runtimeValue;

  const buildValue = (import.meta.env as Record<string, string | undefined>)[
    key
  ];
  if (buildValue !== undefined && buildValue !== "") return buildValue;

  return undefined;
}

export const kutumbaConfig = {
  get bplTagId() {
    return readConfig("REACT_KUTUMBA_BPL_TAG_ID");
  },
  get aplTagId() {
    return readConfig("REACT_KUTUMBA_APL_TAG_ID");
  },
  get rcNumberIdentifierId() {
    return readConfig("REACT_KUTUMBA_RC_NUMBER_IDENTIFIER_ID");
  },
  get healthIdIdentifierId() {
    return readConfig("REACT_KUTUMBA_HEALTH_ID_IDENTIFIER_ID");
  },
  get educationIdIdentifierId() {
    return readConfig("REACT_KUTUMBA_EDUCATION_ID_IDENTIFIER_ID");
  },
  get studentUnverifiedTagId() {
    return readConfig("REACT_KUTUMBA_STUDENT_UNVERIFIED_TAG_ID");
  },
  get pwdUnverifiedTagId() {
    return readConfig("REACT_KUTUMBA_PWD_UNVERIFIED_TAG_ID");
  },
  get autoSubmitOnFill() {
    return readConfig("REACT_KUTUMBA_AUTO_SUBMIT_ON_FILL") === "true";
  },
};
