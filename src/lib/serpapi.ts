
import type { FlightOption } from "./types/flight";

export interface SerpAPIResponse {
  flights_data?: any[];
  error?: string;
}

export async function fetchFlights(from: string, to: string, date: Date) {
  try {
    const apiKey = localStorage.getItem("SERPAPI_KEY");
    if (!apiKey) {
      throw new Error("Please set your SerpAPI key in settings first");
    }

    // Convert city names to uppercase airport codes (basic conversion)
    const fromCode = from.length === 3 ? from.toUpperCase() : `/m/${from.toLowerCase()}`;
    const toCode = to.length === 3 ? to.toUpperCase() : `/m/${to.toLowerCase()}`;

    const formattedDate = date.toISOString().split('T')[0];
    
    // Add a proxy URL before the SerpAPI URL to handle CORS
    const proxyUrl = "https://api.allorigins.win/raw?url=";
    const apiUrl = `https://serpapi.com/search.json?engine=google_flights&departure_id=${encodeURIComponent(fromCode)}&arrival_id=${encodeURIComponent(toCode)}&outbound_date=${formattedDate}&currency=USD&hl=en&api_key=${apiKey}`;
    
    const encodedUrl = encodeURIComponent(apiUrl);
    const response = await fetch(`${proxyUrl}${encodedUrl}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SerpAPIResponse = await response.json();
    console.log("SerpAPI Response:", data); // Debug log

    // Check for API error response
    if (data.error) {
      throw new Error(data.error);
    }

    // Check if the response has the flights_data property
    if (data.flights_data && Array.isArray(data.flights_data)) {
      // Transform the data to match our FlightOption type
      const transformedFlights: FlightOption[] = data.flights_data.map((flight: any) => ({
        flights: [{
          departure_airport: {
            name: flight.departure_airport || from,
            id: flight.departure_code || fromCode,
            time: flight.departure_time || new Date().toISOString(),
          },
          arrival_airport: {
            name: flight.arrival_airport || to,
            id: flight.arrival_code || toCode,
            time: flight.arrival_time || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          },
          duration: flight.duration_minutes || 120,
          airplane: flight.aircraft || "Unknown",
          airline: flight.airline || "Unknown Airline",
          airline_logo: flight.airline_logo || "https://via.placeholder.com/150",
          travel_class: flight.cabin_class || "Economy",
          flight_number: flight.flight_number || "FL000",
          legroom: flight.legroom || "Standard",
          extensions: flight.features || [],
        }],
        layovers: [],
        total_duration: flight.duration_minutes || 120,
        carbon_emissions: {
          this_flight: flight.emissions?.amount || 0,
          typical_for_this_route: flight.emissions?.average || 0,
          difference_percent: flight.emissions?.difference || 0,
        },
        price: flight.price || 0,
        type: "One way",
        airline_logo: flight.airline_logo || "https://via.placeholder.com/150",
        extensions: flight.features || [],
        booking_token: flight.booking_link || "dummy-token",
      }));

      return transformedFlights;
    }

    throw new Error("No flight data found in the API response. Please try using 3-letter airport codes (e.g., LAX, JFK) or city names.");
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch flights");
  }
}
