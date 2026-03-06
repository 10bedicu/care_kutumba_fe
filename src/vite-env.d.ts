/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly REACT_KUTUMBA_BPL_TAG_ID?: string;
  readonly REACT_KUTUMBA_APL_TAG_ID?: string;
  readonly REACT_KUTUMBA_RC_NUMBER_IDENTIFIER_ID?: string;
  readonly REACT_KUTUMBA_HEALTH_ID_IDENTIFIER_ID?: string;
  readonly REACT_KUTUMBA_EDUCATION_ID_IDENTIFIER_ID?: string;
  readonly REACT_KUTUMBA_STUDENT_UNVERIFIED_TAG_ID?: string;
  readonly REACT_KUTUMBA_PWD_UNVERIFIED_TAG_ID?: string;
  readonly REACT_KUTUMBA_AUTO_SUBMIT_ON_FILL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
