
import { useState } from "react";
import { TravelForm, type TravelFormData } from "@/components/TravelForm";
import { TravelPlan } from "@/components/TravelPlan";
import { generateTravelPlan } from "@/lib/gemini";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Globe2 } from "lucide-react";
import { Settings } from "@/components/Settings";

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [travelPlan, setTravelPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: TravelFormData) => {
    try {
      setIsLoading(true);
      const plan = await generateTravelPlan(data);
      setTravelPlan(plan);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate travel plan. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary">
      <Settings />
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <div className="animate-float inline-block mb-4">
            <Globe2 className="h-16 w-16 mx-auto text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Tripify Assistant</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Plan your perfect trip with our AI-powered travel assistant. Enter your
            preferences below and let us create a personalized itinerary for you.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto glassmorphism">
          <CardContent className="p-6">
            <TravelForm onSubmit={handleSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>

        {travelPlan && <TravelPlan plan={travelPlan} />}
      </div>
    </div>
  );
}
