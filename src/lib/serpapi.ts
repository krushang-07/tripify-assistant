
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
    const url = `https://serpapi.com/search.json?engine=google_flights&departure_id=${from}&arrival_id=${to}&outbound_date=${formattedDate}&currency=USD&hl=en&api_key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json() as SerpAPIResponse;
    return data.best_flights;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch flights");
  }
}
