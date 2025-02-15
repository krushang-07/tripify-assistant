
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function chatWithAssistant(message: string, history: { role: string; content: string }[]) {
  try {
    const apiKey = localStorage.getItem("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("Please set your Gemini API key in settings first. Click the gear icon in the top right corner.");
    }

    if (apiKey.trim().length < 10) {
      throw new Error("The provided Gemini API key appears to be invalid. Please check your settings and enter a valid key.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Convert previous chat history to Gemini's expected format
    const formattedHistory = history.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Start a new chat
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Send the message and get the response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in chatWithAssistant:", error);
    
    // Parse the error message if it's from the API
    if (error instanceof Error) {
      const errorBody = error.message.includes('body') 
        ? JSON.parse(error.message.split('body":')[1])
        : null;
      
      if (errorBody?.error?.message?.includes('API key not valid')) {
        throw new Error("The Gemini API key is invalid. Please enter a valid API key in settings (click the gear icon).");
      }
    }
    
    throw error instanceof Error 
      ? error 
      : new Error("Failed to get response from Gemini. Please check your API key in settings.");
  }
}
