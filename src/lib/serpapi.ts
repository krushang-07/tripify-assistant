
import type { FlightOption } from "./types/flight";

export interface SerpAPIResponse {
  best_flights: FlightOption[];
}

export async function fetchFlights(from: string, to: string, date: Date) {
  try {
    const apiKey = localStorage.getItem("SERPAPI_KEY");
    if (!apiKey) {
      throw new Error("Please set your SerpAPI key in settings first");
    }

    const formattedDate = date.toISOString().split('T')[0];
    
    // Add a proxy URL before the SerpAPI URL to handle CORS
    const proxyUrl = "https://api.allorigins.win/raw?url=";
    const apiUrl = `https://serpapi.com/search.json?engine=google_flights&departure_id=${encodeURIComponent(from)}&arrival_id=${encodeURIComponent(to)}&outbound_date=${formattedDate}&currency=USD&hl=en&api_key=${apiKey}`;
    
    const encodedUrl = encodeURIComponent(apiUrl);
    const response = await fetch(`${proxyUrl}${encodedUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as SerpAPIResponse;
    
    if (!data.best_flights || !Array.isArray(data.best_flights)) {
      throw new Error("Invalid response format from API");
    }
    
    return data.best_flights;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch flights");
  }
}
