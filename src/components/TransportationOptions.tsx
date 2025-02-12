
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { FlightOption } from "@/lib/types/flight";
import { format } from "date-fns";

interface TransportationOptionsProps {
  options: FlightOption[];
  onSelect: (option: FlightOption) => void;
}

export function TransportationOptions({ options, onSelect }: TransportationOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: FlightOption) => {
    setSelectedOption(option.booking_token);
    onSelect(option);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Available Transportation Options</h2>
      {options.map((option) => (
        <Card key={option.booking_token} className={`transition-all duration-200 hover:shadow-md ${
          selectedOption === option.booking_token ? "ring-2 ring-primary" : ""
        }`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedOption === option.booking_token}
                  onCheckedChange={() => handleSelect(option)}
                  className="h-5 w-5"
                />
                <img src={option.airline_logo} alt={option.flights[0].airline} className="h-8" />
                <CardTitle className="text-lg">
                  {option.flights[0].airline} - ${option.price}
                </CardTitle>
              </div>
              <Badge variant={option.carbon_emissions.difference_percent <= 0 ? "success" : "destructive"}>
                {option.carbon_emissions.difference_percent <= 0 ? "Eco-friendly" : "Higher emissions"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {option.flights.map((flight, index) => (
                <div key={flight.flight_number}>
                  {index > 0 && (
                    <div className="my-2 text-sm text-muted-foreground">
                      Layover at {option.layovers[index - 1].name} ({formatDuration(option.layovers[index - 1].duration)})
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{formatTime(flight.departure_airport.time)}</p>
                      <p className="text-sm text-muted-foreground">{flight.departure_airport.id}</p>
                    </div>
                    <div className="flex-1 mx-4 text-center">
                      <p className="text-sm text-muted-foreground">{formatDuration(flight.duration)}</p>
                      <div className="relative">
                        <Separator className="my-2" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                      </div>
                      <p className="text-xs">{flight.flight_number}</p>
                    </div>
                    <div>
                      <p className="font-medium">{formatTime(flight.arrival_airport.time)}</p>
                      <p className="text-sm text-muted-foreground">{flight.arrival_airport.id}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {flight.extensions.map((ext, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {ext}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 text-sm text-muted-foreground">
                Total duration: {formatDuration(option.total_duration)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
