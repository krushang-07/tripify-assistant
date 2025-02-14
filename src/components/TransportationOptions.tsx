
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Car, Train, Ship } from "lucide-react";
import type { FlightOption } from "@/lib/types/flight";

export function TransportationOptions() {
  const transportOptions = [
    {
      icon: Plane,
      label: "Flights",
      active: true,
    },
    {
      icon: Train,
      label: "Trains",
      active: false,
    },
    {
      icon: Car,
      label: "Cars",
      active: false,
    },
    {
      icon: Ship,
      label: "Cruises",
      active: false,
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {transportOptions.map((option) => (
            <Button
              key={option.label}
              variant={option.active ? "default" : "outline"}
              className="w-full"
              disabled={!option.active}
            >
              <option.icon className="mr-2 h-4 w-4" />
              {option.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
