import { FC, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import FillFromKutumbaSheet from "@/components/kutumba/FillFromKutumbaSheet";
import type { KutumbaMember } from "@/types/kutumba";

type PatientRegistrationFormProps = {
  form: UseFormReturn;
  facilityId?: string;
  patientId?: string;
};

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

    form.setValue("name", member.name);

    if (member.mobile_no) {
      form.setValue(
        "phone_number",
        "+91" + member.mobile_no.replace("+91", ""),
      );
    }

    if (member.date_of_birth) {
      const dob = parseKutumbaDate(member.date_of_birth);
      if (dob) {
        form.setValue("yob_or_dob", "dob");
        form.setValue("date_of_birth", dob);
      }
    }

    if (member.gender) {
      const genderMap: Record<string, string> = {
        M: "male",
        F: "female",
        O: "transgender",
      };
      form.setValue("gender", genderMap[member.gender] ?? "transgender");
    }

    if (member.address) {
      const cleanAddress = member.address
        .replace(/\r\n/g, ", ")
        .replace(/\r/g, "")
        .replace(/\.\s*,/g, "")
        .replace(/,\s*,/g, ",")
        .replace(/^[,\s]+|[,\s]+$/g, "");
      form.setValue("address", cleanAddress);
      form.setValue("permanent_address", cleanAddress);
    }

    if (member.pincode) {
      form.setValue("pincode", Number(member.pincode));
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
