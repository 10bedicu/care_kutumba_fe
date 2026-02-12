/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly REACT_KUTUMBA_BPL_TAG_ID?: string;
  readonly REACT_KUTUMBA_APL_TAG_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
