import { FC, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";

import FillFromKutumbaSheet from "@/components/kutumba/FillFromKutumbaSheet";

import { kutumbaConfig } from "@/config";
import type { KutumbaMember } from "@/types/kutumba";

type PatientRegistrationFormProps = {
  form: UseFormReturn;
  facilityId?: string;
  patientId?: string;
};

/**
 * Mapping from Kutumba rc_type values to env-configured tag IDs.
 * PHH (Priority Household) maps to BPL, NPHH (Non-Priority) maps to APL.
 */
const RC_TYPE_TO_TAG_ID: Record<string, string | undefined> = {
  BPL: kutumbaConfig.bplTagId,
  APL: kutumbaConfig.aplTagId,
  PHH: kutumbaConfig.bplTagId,
  NPHH: kutumbaConfig.aplTagId,
};

const ALL_RATION_TAG_IDS = [
  kutumbaConfig.bplTagId,
  kutumbaConfig.aplTagId,
].filter(Boolean) as string[];

/**
 * Parses a date string in DD/MM/YYYY format and returns YYYY-MM-DD.
 */
function parseKutumbaDate(dateStr: string): string | undefined {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return undefined;
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

const PatientRegistrationForm: FC<PatientRegistrationFormProps> = ({
  form,
  patientId,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleMemberSelect = (member: KutumbaMember) => {
    // Don't overwrite fields if editing an existing patient
    if (patientId) return;

    form.setValue("name", member.name, { shouldDirty: true });

    if (member.mobile_no) {
      form.setValue(
        "phone_number",
        "+91" + member.mobile_no.replace("+91", ""),
        { shouldDirty: true },
      );
    }

    if (member.date_of_birth) {
      const dob = parseKutumbaDate(member.date_of_birth);
      if (dob) {
        form.setValue("age_or_dob", "dob", { shouldDirty: true });
        form.setValue("date_of_birth", dob, { shouldDirty: true });
      }
    }

    if (member.gender) {
      const genderMap: Record<string, string> = {
        M: "male",
        F: "female",
        O: "transgender",
      };
      const mappedGender = genderMap[member.gender];
      if (mappedGender) {
        form.setValue("gender", mappedGender, { shouldDirty: true });
      }
    }

    if (member.address) {
      const cleanAddress = member.address
        .replace(/\r\n/g, ", ")
        .replace(/\r/g, "")
        .replace(/\.\s*,/g, "")
        .replace(/,\s*,/g, ",")
        .replace(/^[,\s]+|[,\s]+$/g, "");
      form.setValue("address", cleanAddress, { shouldDirty: true });
      form.setValue("permanent_address", cleanAddress, { shouldDirty: true });
    }

    if (member.pincode) {
      form.setValue("pincode", Number(member.pincode), { shouldDirty: true });
    }

    // Auto-select the matching ration card tag based on rc_type
    // rc_type can be BPL/APL or PHH/NPHH — mapped via env-configured tag IDs
    if (member.rc_type) {
      const tagId = RC_TYPE_TO_TAG_ID[member.rc_type.toUpperCase()];
      if (tagId) {
        const currentTags: string[] = form.getValues("tags") ?? [];
        // Remove any existing ration card tags, then add the matching one
        const filteredTags = currentTags.filter(
          (id) => !ALL_RATION_TAG_IDS.includes(id),
        );
        form.setValue("tags", [...filteredTags, tagId], {
          shouldDirty: true,
        });
      }
    }
  };

  return (
    <div className="care-kutumba-fe-container flex justify-end w-full">
      <Button
        type="button"
        variant="outline"
        className="text-primary-700 border-primary-400"
        onClick={() => setSheetOpen(true)}
      >
        Fill from Kutumba
      </Button>

      <FillFromKutumbaSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onMemberSelect={handleMemberSelect}
      />
    </div>
  );
};

export default PatientRegistrationForm;
