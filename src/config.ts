export const kutumbaConfig = {
  bplTagId: import.meta.env.REACT_KUTUMBA_BPL_TAG_ID as string | undefined,
  aplTagId: import.meta.env.REACT_KUTUMBA_APL_TAG_ID as string | undefined,

  rcNumberIdentifierId: import.meta.env
    .REACT_KUTUMBA_RC_NUMBER_IDENTIFIER_ID as string | undefined,
  healthIdIdentifierId: import.meta.env
    .REACT_KUTUMBA_HEALTH_ID_IDENTIFIER_ID as string | undefined,
  educationIdIdentifierId: import.meta.env
    .REACT_KUTUMBA_EDUCATION_ID_IDENTIFIER_ID as string | undefined,

  studentUnverifiedTagId: import.meta.env
    .REACT_KUTUMBA_STUDENT_UNVERIFIED_TAG_ID as string | undefined,
  pwdUnverifiedTagId: import.meta.env.REACT_KUTUMBA_PWD_UNVERIFIED_TAG_ID as
    | string
    | undefined,

  autoSubmitOnFill:
    import.meta.env.REACT_KUTUMBA_AUTO_SUBMIT_ON_FILL === "true",
};
