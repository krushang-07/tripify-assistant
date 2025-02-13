
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
    const response = await fetch(`${proxyUrl}${encodedUrl}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("SerpAPI Response:", data); // Debug log

    // Check if the response has the flights_data property
    if (data.flights_data && Array.isArray(data.flights_data)) {
      // Transform the data to match our FlightOption type
      const transformedFlights: FlightOption[] = data.flights_data.map((flight: any) => ({
        flights: [{
          departure_airport: {
            name: flight.departure_airport || "",
            id: flight.departure_code || "",
            time: flight.departure_time || "",
          },
          arrival_airport: {
            name: flight.arrival_airport || "",
            id: flight.arrival_code || "",
            time: flight.arrival_time || "",
          },
          duration: flight.duration_minutes || 0,
          airplane: flight.aircraft || "",
          airline: flight.airline || "",
          airline_logo: flight.airline_logo || "",
          travel_class: flight.cabin_class || "Economy",
          flight_number: flight.flight_number || "",
          legroom: flight.legroom || "",
          extensions: flight.features || [],
        }],
        layovers: [],
        total_duration: flight.duration_minutes || 0,
        carbon_emissions: {
          this_flight: flight.emissions?.amount || 0,
          typical_for_this_route: flight.emissions?.average || 0,
          difference_percent: flight.emissions?.difference || 0,
        },
        price: flight.price || 0,
        type: "One way",
        airline_logo: flight.airline_logo || "",
        extensions: flight.features || [],
        booking_token: flight.booking_link || "",
      }));

      return transformedFlights;
    }

    // If no flights_data, try best_flights
    if (data.best_flights && Array.isArray(data.best_flights)) {
      return data.best_flights;
    }

    throw new Error("No flight data found in the API response");
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch flights");
  }
}
