import { supabase } from "@/lib/supbase";

// Define the structure of the data returned
type TouristWithEvent = {
  name: string;
  email: string;
  country: string;
  event_name: string;
  notes: string;
};

// Fetch tourists and their associated events manually
export const fetchTouristsWithEvents = async (): Promise<TouristWithEvent[]> => {
  try {
    // Fetch all tourists along with their associated event_id (tour_event_id)
    const { data: tourists, error: touristError } = await supabase
      .from("tourists")
      .select("id, name, email, country, notes, tour_event_id"); // Added tour_event_id field

    if (touristError) {
      console.error("Error fetching tourists:", touristError.message);
      throw new Error("Failed to fetch tourists: " + touristError.message);
    }

    // Fetch the event details
    const { data: events, error: eventsError } = await supabase
      .from("tour_events")
      .select("id, event_name");

    if (eventsError) {
      console.error("Error fetching events:", eventsError.message);
      throw new Error("Failed to fetch events: " + eventsError.message);
    }

    // Map the tourists with their events and flatten the array
    const touristsWithEvents: TouristWithEvent[] = [];

    tourists.forEach((tourist: any) => {
      // Check if the tourist has an associated event_id
      if (tourist.tour_event_id) {
        // Find the corresponding event based on the tour_event_id
        const event = events.find((event: any) => event.id === tourist.tour_event_id);

        // If a matching event is found, map it to the tourist
        if (event) {
          touristsWithEvents.push({
            name: tourist.name,
            email: tourist.email,
            country: tourist.country,
            event_name: event.event_name,
            notes: tourist.notes,
          });
        }
      }
    });

    return touristsWithEvents;
  } catch (error) {
    console.error("Error fetching tourists with events:", error);
    throw new Error("Failed to fetch tourists with events.");
  }
};
