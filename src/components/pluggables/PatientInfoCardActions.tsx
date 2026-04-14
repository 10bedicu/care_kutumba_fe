import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Link2, Loader2 } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "sonner";

import {
  ALL_MANAGED_TAG_IDS,
  GENDER_MAP,
  IDENTIFIER_FIELD_MAP,
  RC_TYPE_TO_TAG_ID,
  parseKutumbaDate,
} from "@/lib/kutumba-mappings";
import { mutate } from "@/lib/request";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import FillFromKutumbaSheet from "@/components/kutumba/FillFromKutumbaSheet";

import { patientApis } from "@/apis/kutumba";
import { kutumbaConfig } from "@/config";
import type { KutumbaMember } from "@/types/kutumba";
import type { PatientRead } from "@/types/patient";
import type { TagConfig } from "@/types/tagConfig";

type PatientInfoCardActionsProps = {
  patient: PatientRead;
  facilityId: string;
  className?: string;
};

interface Mismatch {
  field: string;
  patient: string;
  kutumba: string;
}

function detectMismatches(
  patient: PatientInfoCardActionsProps["patient"],
  member: KutumbaMember,
): Mismatch[] {
  const mismatches: Mismatch[] = [];

  // Name
  if (
    member.name &&
    patient.name &&
    member.name.toLowerCase() !== patient.name.toLowerCase()
  ) {
    mismatches.push({
      field: "Name",
      patient: patient.name,
      kutumba: member.name,
    });
  }

  // Gender
  const kutumbaGender = member.gender ? GENDER_MAP[member.gender] : undefined;
  if (kutumbaGender && patient.gender && kutumbaGender !== patient.gender) {
    mismatches.push({
      field: "Gender",
      patient: patient.gender,
      kutumba: kutumbaGender,
    });
  }

  // Date of birth
  const kutumbaDob = member.date_of_birth
    ? parseKutumbaDate(member.date_of_birth)
    : undefined;
  if (
    kutumbaDob &&
    patient.date_of_birth &&
    kutumbaDob !== patient.date_of_birth
  ) {
    mismatches.push({
      field: "Date of Birth",
      patient: patient.date_of_birth,
      kutumba: kutumbaDob,
    });
  }

  // Tags — show current vs incoming ration card tag
  const currentRationTag = patient.instance_tags.find((t) =>
    ALL_MANAGED_TAG_IDS.includes(t.id),
  );
  const newRationTagId = member.rc_type
    ? RC_TYPE_TO_TAG_ID[member.rc_type.toUpperCase()]
    : undefined;
  if (
    newRationTagId &&
    currentRationTag &&
    currentRationTag.id !== newRationTagId
  ) {
    const newTagDisplay = member.rc_type.toUpperCase();
    mismatches.push({
      field: "Ration Card Type",
      patient: currentRationTag.display,
      kutumba: newTagDisplay,
    });
  }

  // Identifiers — compare existing RC number, health ID, education ID
  const identifiers = patient.instance_identifiers ?? [];
  for (const { configId, field } of IDENTIFIER_FIELD_MAP) {
    if (!configId) continue;
    const kutumbaValue = member[field];
    if (!kutumbaValue) continue;

    const existing = identifiers.find((i) => i.config.id === configId);
    if (existing && existing.value && existing.value !== String(kutumbaValue)) {
      const label =
        field === "rc_number"
          ? "RC Number"
          : field === "health_id"
            ? "Health ID"
            : "Education ID";
      mismatches.push({
        field: label,
        patient: existing.value,
        kutumba: String(kutumbaValue),
      });
    }
  }

  return mismatches;
}

async function syncTagsAndIdentifiers(
  patientId: string,
  member: KutumbaMember,
  currentTags: TagConfig[],
) {
  const pathParams = { id: patientId };

  // Determine which managed tags the patient currently has
  const currentManagedTagIds = currentTags
    .map((t) => t.id)
    .filter((id) => ALL_MANAGED_TAG_IDS.includes(id));

  // Determine new tags from the Kutumba member
  const newTagIds: string[] = [];

  if (member.rc_type) {
    const tagId = RC_TYPE_TO_TAG_ID[member.rc_type.toUpperCase()];
    if (tagId) newTagIds.push(tagId);
  }

  if (member.education_id && kutumbaConfig.studentUnverifiedTagId) {
    newTagIds.push(kutumbaConfig.studentUnverifiedTagId);
  }

  if (member.disability_applicant_no && kutumbaConfig.pwdUnverifiedTagId) {
    newTagIds.push(kutumbaConfig.pwdUnverifiedTagId);
  }

  // Remove old managed tags that aren't in the new set
  const tagsToRemove = currentManagedTagIds.filter(
    (id) => !newTagIds.includes(id),
  );
  if (tagsToRemove.length > 0) {
    await mutate(patientApis.removeInstanceTags, { pathParams })({
      tags: tagsToRemove,
    });
  }

  // Add new tags that aren't already present
  const existingTagIds = currentTags.map((t) => t.id);
  const tagsToAdd = newTagIds.filter((id) => !existingTagIds.includes(id));
  if (tagsToAdd.length > 0) {
    await mutate(patientApis.setInstanceTags, { pathParams })({
      tags: tagsToAdd,
    });
  }

  // Update identifiers
  for (const { configId, field } of IDENTIFIER_FIELD_MAP) {
    if (!configId) continue;
    const value = member[field];
    if (!value) continue;

    await mutate(patientApis.updateIdentifier, { pathParams })({
      config: configId,
      value: String(value),
    });
  }
}

const PatientInfoCardActions: FC<PatientInfoCardActionsProps> = ({
  patient,
  className,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pendingMember, setPendingMember] = useState<KutumbaMember | null>(
    null,
  );
  const queryClient = useQueryClient();

  const linkMutation = useMutation({
    mutationFn: ({ member }: { member: KutumbaMember }) =>
      syncTagsAndIdentifiers(patient.id, member, patient.instance_tags),
    onSuccess: (_data, { member }) => {
      toast.success(`Kutumba data linked for ${member.name}`);
    },
    onError: () => {
      toast.error("Failed to link Kutumba data. Please try again.");
    },
    onSettled: () => {
      setPendingMember(null);
      queryClient.invalidateQueries({ queryKey: ["patient-verify"] });
    },
  });

  const handleMemberSelect = (member: KutumbaMember) => {
    setPendingMember(member);
  };

  const handleConfirmLink = () => {
    if (pendingMember) {
      linkMutation.mutate({ member: pendingMember });
    }
  };

  return (
    <div className={`care-kutumba-fe-container ${className ?? ""}`}>
      <Button
        type="button"
        variant="outline"
        className="text-primary border-primary"
        onClick={() => setSheetOpen(true)}
        disabled={linkMutation.isPending}
      >
        {linkMutation.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Link2 className="size-4" />
        )}
        Link Kutumba
      </Button>

      <FillFromKutumbaSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onMemberSelect={handleMemberSelect}
        confirmLabel="Link Patient"
      />

      <AlertDialog
        open={pendingMember !== null && !linkMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setPendingMember(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Link Kutumba Data?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  This will update <strong>APL/BPL tags</strong> and{" "}
                  <strong>Ration Card identifier</strong> for this patient using
                  Kutumba data for <strong>{pendingMember?.name}</strong> (RC:{" "}
                  <strong>{pendingMember?.rc_number}</strong>).
                </p>

                {pendingMember &&
                  (() => {
                    const mismatches = detectMismatches(patient, pendingMember);
                    if (mismatches.length === 0) return null;
                    return (
                      <>
                        <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 dark:border-yellow-700 dark:bg-yellow-950">
                          <div className="flex items-center gap-2 font-medium text-yellow-800 dark:text-yellow-300">
                            <AlertTriangle className="size-4" />
                            Data mismatch detected
                          </div>
                          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                            The selected member&apos;s data differs from the
                            current patient record. Please verify this is the
                            correct person.
                          </p>
                        </div>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b text-left text-gray-600 dark:text-gray-400">
                              <th className="py-2 pr-3 font-semibold">Field</th>
                              <th className="py-2 pr-3 font-semibold">
                                Current Record
                              </th>
                              <th className="py-2 font-semibold">
                                From Kutumba
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700 dark:text-gray-300">
                            {mismatches.map((m) => (
                              <tr
                                key={m.field}
                                className="border-b border-gray-100 dark:border-gray-800"
                              >
                                <td className="py-2 pr-3 font-medium">
                                  {m.field}
                                </td>
                                <td className="py-2 pr-3">{m.patient}</td>
                                <td className="py-2">{m.kutumba}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    );
                  })()}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLink}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PatientInfoCardActions;
