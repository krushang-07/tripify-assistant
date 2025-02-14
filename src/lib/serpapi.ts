
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

    // Validate that the selected date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      throw new Error("Please select a future date for your flight");
    }

    const fromCode = from.length === 3 ? from.toUpperCase() : `/m/${from.toLowerCase()}`;
    const toCode = to.length === 3 ? to.toUpperCase() : `/m/${to.toLowerCase()}`;

    const formattedDate = date.toISOString().split('T')[0];
    
    const proxyUrl = "https://api.allorigins.win/raw?url=";
    const apiUrl = `https://serpapi.com/search.json?engine=google_flights&departure_id=${encodeURIComponent(fromCode)}&arrival_id=${encodeURIComponent(toCode)}&outbound_date=${formattedDate}&type=2&currency=USD&hl=en&api_key=${apiKey}`;
    
    const encodedUrl = encodeURIComponent(apiUrl);
    const response = await fetch(`${proxyUrl}${encodedUrl}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SerpAPIResponse = await response.json();
    console.log("SerpAPI Response:", data);

    if (data.error) {
      if (data.error.includes("Invalid API key")) {
        throw new Error("The SerpAPI key is invalid. Please check your settings and enter a valid key.");
      } else if (data.error.includes("cannot be in the past")) {
        throw new Error("Please select a future date for your flight.");
      }
      throw new Error(data.error);
    }

    if (data.flights_data && Array.isArray(data.flights_data)) {
      const transformedFlights: FlightOption[] = data.flights_data.map((flight: any) => {
        const flightLegs = Array.isArray(flight.flights) ? flight.flights : [flight];
        
        return {
          flights: flightLegs.map((leg: any) => ({
            departure_airport: {
              name: leg.departure_airport?.name || leg.departure_airport || "",
              id: leg.departure_airport?.id || fromCode,
              time: leg.departure_airport?.time || leg.departure_time || "",
            },
            arrival_airport: {
              name: leg.arrival_airport?.name || leg.arrival_airport || "",
              id: leg.arrival_airport?.id || toCode,
              time: leg.arrival_airport?.time || leg.arrival_time || "",
            },
            duration: parseInt(leg.duration) || 0,
            airplane: leg.airplane || leg.aircraft || "",
            airline: leg.airline || "",
            airline_logo: leg.airline_logo || "",
            travel_class: leg.travel_class || "Economy",
            flight_number: leg.flight_number || "",
            legroom: leg.legroom || "",
            extensions: leg.extensions || [],
          })),
          layovers: [],
          total_duration: parseInt(flight.total_duration) || 
                         flight.flights?.reduce((total: number, leg: any) => total + (parseInt(leg.duration) || 0), 0) || 0,
          carbon_emissions: {
            this_flight: 0,
            typical_for_this_route: 0,
            difference_percent: 0,
          },
          price: parseFloat(flight.price) || 0,
          type: "One way",
          airline_logo: flight.airline_logo || flight.flights?.[0]?.airline_logo || "",
          extensions: [],
          booking_token: flight.booking_token || "",
        };
      });

      if (transformedFlights.length === 0) {
        throw new Error("No flights found for the selected route and date.");
      }

      return transformedFlights;
    }

    throw new Error("No flight data found in the API response. Please try using 3-letter airport codes (e.g., LAX, JFK) or city names.");
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch flights");
  }
}
