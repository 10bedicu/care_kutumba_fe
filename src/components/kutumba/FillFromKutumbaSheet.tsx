import { FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import MemberCard from "./MemberCard";
import { kutumbaApis } from "@/apis/kutumba";
import type { KutumbaMember } from "@/types/kutumba";

interface FillFromKutumbaSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberSelect: (member: KutumbaMember) => void;
}

const FillFromKutumbaSheet: FC<FillFromKutumbaSheetProps> = ({
  open,
  onOpenChange,
  onMemberSelect,
}) => {
  const [rcNumber, setRcNumber] = useState("");
  const [selectedMember, setSelectedMember] = useState<KutumbaMember | null>(
    null,
  );

  const lookupMutation = useMutation({
    mutationFn: kutumbaApis.lookupByRcNumber,
    onSuccess: () => {
      setSelectedMember(null);
    },
  });

  const handleSearch = () => {
    if (!rcNumber.trim()) return;
    lookupMutation.mutate({ rc_number: rcNumber.trim() });
  };

  const handleConfirm = () => {
    if (selectedMember) {
      onMemberSelect(selectedMember);
      onOpenChange(false);
      resetState();
    }
  };

  const resetState = () => {
    setRcNumber("");
    setSelectedMember(null);
    lookupMutation.reset();
  };

  const members = lookupMutation.data?.members ?? [];

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetState();
        onOpenChange(isOpen);
      }}
    >
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Fill from Kutumba</SheetTitle>
          <SheetDescription>
            Enter an RC number to search for family members in the Kutumba
            database.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-2 pt-4">
          <Label htmlFor="rc-number">RC Number</Label>
          <div className="flex gap-2">
            <Input
              id="rc-number"
              placeholder="Enter RC number"
              value={rcNumber}
              onChange={(e) => setRcNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Button
              onClick={handleSearch}
              disabled={!rcNumber.trim() || lookupMutation.isPending}
              size="default"
            >
              {lookupMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>
        </div>

        <ScrollArea className="mt-4 flex-1 overflow-y-auto pr-1">
          <div className="space-y-3">
            {lookupMutation.isPending && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="mt-2 text-sm">Searching Kutumba database...</p>
              </div>
            )}

            {lookupMutation.isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                Failed to fetch members. Please check the RC number and try
                again.
              </div>
            )}

            {lookupMutation.isSuccess && members.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-500">
                No members found for this RC number.
              </div>
            )}

            {members.map((member) => (
              <MemberCard
                key={member.health_id}
                member={member}
                selected={selectedMember?.health_id === member.health_id}
                onSelect={() => setSelectedMember(member)}
              />
            ))}
          </div>
        </ScrollArea>

        {members.length > 0 && (
          <SheetFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetState();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedMember}>
              Fill Details
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default FillFromKutumbaSheet;
