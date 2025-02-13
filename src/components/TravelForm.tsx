
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransportationOptions } from "@/components/TransportationOptions";
import type { FlightOption } from "@/lib/types/flight";
import { fetchFlights } from "@/lib/serpapi";
import { useToast } from "@/components/ui/use-toast";

interface TravelFormProps {
  onSubmit: (data: TravelFormData) => void;
  isLoading: boolean;
}

export interface TravelFormData {
  source: string;
  destination: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  budget: string;
  travelers: string;
  selectedTransportation?: FlightOption;
}

export function TravelForm({ onSubmit, isLoading }: TravelFormProps) {
  const [formData, setFormData] = useState<TravelFormData>({
    source: "",
    destination: "",
    startDate: undefined,
    endDate: undefined,
    budget: "",
    travelers: "",
  });
  const [flightOptions, setFlightOptions] = useState<FlightOption[]>([]);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadFlights = async () => {
      if (formData.source && formData.destination && formData.startDate) {
        try {
          setLoadingFlights(true);
          const flights = await fetchFlights(formData.source, formData.destination, formData.startDate);
          setFlightOptions(flights);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to fetch flights",
          });
        } finally {
          setLoadingFlights(false);
        }
      }
    };

    loadFlights();
  }, [formData.source, formData.destination, formData.startDate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTransportationSelect = (option: FlightOption) => {
    setFormData({ ...formData, selectedTransportation: option });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full mx-auto">
      <div className="space-y-2">
        <Label htmlFor="source">Departure City</Label>
        <Input
          id="source"
          placeholder="Enter your departure city (e.g., PEK)"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          required
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          placeholder="Where do you want to go? (e.g., AUS)"
          value={formData.destination}
          onChange={(e) =>
            setFormData({ ...formData, destination: e.target.value })
          }
          required
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(formData.startDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) =>
                  setFormData({ ...formData, startDate: date ?? undefined })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? (
                  format(formData.endDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) =>
                  setFormData({ ...formData, endDate: date ?? undefined })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Budget (USD)</Label>
          <Input
            id="budget"
            type="number"
            placeholder="Enter your budget"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="travelers">Number of Travelers</Label>
          <Input
            id="travelers"
            type="number"
            placeholder="Number of people"
            value={formData.travelers}
            onChange={(e) =>
              setFormData({ ...formData, travelers: e.target.value })
            }
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {loadingFlights ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading flight options...</p>
        </div>
      ) : (
        flightOptions.length > 0 && (
          <TransportationOptions 
            options={flightOptions} 
            onSelect={handleTransportationSelect}
          />
        )
      )}

      <Button
        type="submit"
        className="w-full transition-all duration-300 hover:scale-[1.02]"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
            Generating Plan...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            Plan My Trip
          </div>
        )}
      </Button>
    </form>
  );
}
