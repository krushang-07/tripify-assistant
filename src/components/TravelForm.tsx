
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { type FlightOption } from "@/lib/types/flight";
import { fetchFlights } from "@/lib/serpapi";
import { CalendarIcon, Plane } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function TravelForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    setIsLoading(true);
    try {
      const results = await fetchFlights(from, to, date);
      setFlights(results);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch flights",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="from">From</Label>
          <Input
            id="from"
            placeholder="Airport or city (e.g., LAX, New York)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            placeholder="Airport or city (e.g., JFK, London)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        <Plane className="mr-2 h-4 w-4" />
        {isLoading ? "Searching..." : "Search Flights"}
      </Button>

      {flights.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Available Flights</h3>
          {flights.map((flight, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {flight.flights[0].departure_airport.id} →{" "}
                    {flight.flights[flight.flights.length - 1].arrival_airport.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {flight.flights[0].airline} - {flight.flights[0].flight_number}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${flight.price}</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(flight.total_duration / 60)}h{" "}
                    {flight.total_duration % 60}m
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </form>
  );
}
