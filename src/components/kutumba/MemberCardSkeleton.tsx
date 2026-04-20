import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MemberCardSkeleton = () => {
  return (
    <Card className="border border-gray-200">
      <CardContent className="flex items-start gap-3 p-4">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="col-span-2 h-3 w-40" />
            <Skeleton className="col-span-2 h-3 w-36" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCardSkeleton;
