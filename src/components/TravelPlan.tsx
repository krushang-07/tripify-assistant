
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface TravelPlanProps {
  plan: string;
}

export function TravelPlan({ plan }: TravelPlanProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto glassmorphism">
      <CardContent className="p-6">
        <ScrollArea className="h-[400px] w-full rounded-md">
          <div className="space-y-4">
            {plan.split("\n").map((paragraph, index) => (
              <p key={index} className="text-sm leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
