
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface TravelPlanProps {
  plan: string;
}

export function TravelPlan({ plan }: TravelPlanProps) {
  const renderMarkdownText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => (
      line.startsWith('# ') ? (
        <h1 key={index} className="text-2xl font-bold mb-4 text-primary">
          {line.slice(2)}
        </h1>
      ) : line.startsWith('## ') ? (
        <h2 key={index} className="text-xl font-semibold mb-3 text-primary/90">
          {line.slice(3)}
        </h2>
      ) : line.startsWith('### ') ? (
        <h3 key={index} className="text-lg font-medium mb-2 text-primary/80">
          {line.slice(4)}
        </h3>
      ) : line.startsWith('- ') || line.startsWith('* ') ? (
        <li key={index} className="ml-4 mb-2 text-sm leading-relaxed">
          {line.slice(2)}
        </li>
      ) : line.match(/^\d+\./) ? (
        <li key={index} className="ml-4 mb-2 text-sm leading-relaxed list-decimal">
          {line.slice(line.indexOf('.') + 2)}
        </li>
      ) : line.includes('**') ? (
        <p key={index} className="mb-2 text-sm leading-relaxed">
          {line.split('**').map((part, i) => (
            i % 2 === 0 ? part : <strong key={i} className="font-semibold">{part}</strong>
          ))}
        </p>
      ) : line.trim() ? (
        <p key={index} className="mb-4 text-sm leading-relaxed">
          {line}
        </p>
      ) : (
        <div key={index} className="h-4" />
      )
    ));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto glassmorphism">
      <CardContent className="p-6">
        <ScrollArea className="h-[400px] w-full rounded-md">
          <div className="space-y-1 pr-4">
            {renderMarkdownText(plan)}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
