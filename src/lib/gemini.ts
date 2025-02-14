
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function chatWithAssistant(message: string, history: ChatMessage[] = []) {
  try {
    const apiKey = localStorage.getItem("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("Please set your Gemini API key in settings first");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a helpful travel assistant. Answer questions about travel destinations, 
    planning tips, local customs, and recommendations. Keep responses informative but concise.
    
    Previous conversation:
    ${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
    
    User: ${message}
    Assistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error chatting with assistant:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get a response. Please try again later."
    );
  }
}
