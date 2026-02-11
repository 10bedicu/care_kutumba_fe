import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { KutumbaMember } from "@/types/kutumba";
import { Check, User } from "lucide-react";

interface MemberCardProps {
  member: KutumbaMember;
  selected: boolean;
  onSelect: () => void;
}

const MemberCard: FC<MemberCardProps> = ({ member, selected, onSelect }) => {
  const genderLabel =
    { M: "Male", F: "Female", O: "Other" }[member.gender] ?? member.gender;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:border-primary-500",
        selected &&
          "border-primary-700 bg-primary-50 ring-1 ring-primary-700 dark:border-primary-400 dark:bg-primary-950 dark:ring-primary-400",
      )}
      onClick={onSelect}
    >
      <CardContent className="flex items-start gap-3 p-4">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800",
            selected && "bg-primary-100 dark:bg-primary-900",
          )}
        >
          {selected ? (
            <Check className="h-5 w-5 text-primary-700 dark:text-primary-400" />
          ) : (
            <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
              {member.name}
            </p>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {member.relation_name}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-gray-500 dark:text-gray-400">
            <span>DOB: {member.date_of_birth}</span>
            <span>Gender: {genderLabel}</span>
            <span>Mobile: {member.mobile_no}</span>
            <span>RC: {member.rc_number}</span>
            {member.health_id && (
              <span className="col-span-2">
                Health ID: {member.health_id}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
