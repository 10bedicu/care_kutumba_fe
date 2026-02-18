import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { FC } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { schedulingQueries } from "@/apis/scheduling";

interface HealthcareServiceSelectProps {
  facilityId: string;
  value: string;
  onChange: (serviceId: string) => void;
}

const HealthcareServiceSelect: FC<HealthcareServiceSelectProps> = ({
  facilityId,
  value,
  onChange,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["healthcareServices", facilityId],
    queryFn: schedulingQueries.listHealthcareServices(facilityId),
    enabled: !!facilityId,
  });

  const services = data?.results ?? [];

  return (
    <div className="space-y-1.5">
      <Label htmlFor="healthcare-service">Book Appointment (Optional)</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="healthcare-service" className="w-full">
          {isLoading ? (
            <span className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading services...
            </span>
          ) : (
            <SelectValue placeholder="Select a healthcare service" />
          )}
        </SelectTrigger>
        <SelectContent>
          {services.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500">
        If selected, an appointment will be auto-booked for today after
        registration.
      </p>
    </div>
  );
};

export default HealthcareServiceSelect;
