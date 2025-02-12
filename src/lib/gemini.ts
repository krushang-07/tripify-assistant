
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { TravelFormData } from "@/components/TravelForm";

const generatePrompt = (data: TravelFormData) => {
  return `Create a detailed travel itinerary for a trip with the following details:
  - From: ${data.source}
  - To: ${data.destination}
  - Start Date: ${data.startDate?.toLocaleDateString()}
  - End Date: ${data.endDate?.toLocaleDateString()}
  - Budget: $${data.budget}
  - Number of Travelers: ${data.travelers}

Please include:
1. Recommended places to visit
2. Suggested accommodations within budget
3. Local transportation options
4. Must-try local cuisine
5. Estimated cost breakdown
6. Travel tips and cultural considerations

Format the response in a clear, easy-to-read way with sections and bullet points.`;
};

export async function generateTravelPlan(data: TravelFormData) {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = generatePrompt(data);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating travel plan:", error);
    throw new Error("Failed to generate travel plan. Please try again later.");
  }
}
