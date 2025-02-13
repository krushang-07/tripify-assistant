
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function Settings() {
  const [geminiKey, setGeminiKey] = useState("");
  const [serpApiKey, setSerpApiKey] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (!geminiKey.trim() && !serpApiKey.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter at least one API key",
      });
      return;
    }

    if (geminiKey.trim()) {
      localStorage.setItem("GEMINI_API_KEY", geminiKey.trim());
    }
    if (serpApiKey.trim()) {
      localStorage.setItem("SERPAPI_KEY", serpApiKey.trim());
    }

    toast({
      title: "Success",
      description: "API keys saved successfully",
    });
    setGeminiKey("");
    setSerpApiKey("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 rounded-full"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="geminiKey">Gemini API Key</Label>
            <Input
              id="geminiKey"
              type="password"
              placeholder="Enter your Gemini API key"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serpApiKey">SerpAPI Key</Label>
            <Input
              id="serpApiKey"
              type="password"
              placeholder="Enter your SerpAPI key"
              value={serpApiKey}
              onChange={(e) => setSerpApiKey(e.target.value)}
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
