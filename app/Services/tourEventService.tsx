import { supabase } from "@/lib/supbase";
import { Tourist } from "../dashboard/tourEvents";

// Fetch Tour Events
export const fetchTourEvents = async () => {
  const { data, error } = await supabase
    .from("tour_events")
    .select("id, event_name, date_from, date_to, tours(name), archived")
    .order("date_from", { ascending: true });

  if (error) {
    throw new Error("Failed to fetch tour events");
  }

  return data.map((event) => ({
    ...event,
    tours: Array.isArray(event.tours) ? event.tours[0] : event.tours, // Ensure tours is a single object
  }));
};

// Fetch Tour Event by ID
export const fetchTourEventById = async (eventId: string) => {
  try {
    // Fetch the event details, including the tour (but not tourists yet)
    const { data: eventData, error: eventError } = await supabase
      .from("tour_events")
      .select(`
        id, 
        event_name, 
        date_from, 
        date_to, 
        tour_id, 
        tours(name), 
        archived
      `)
      .eq("id", eventId)
      .single();

    if (eventError) {
      throw new Error("Failed to fetch event: " + eventError.message);
    }

    // Fetch tourists linked directly to this event from the tourist table
    const { data: touristData, error: touristError } = await supabase
      .from("tourists")
      .select("id, name, email, country, notes")
      .eq("tour_event_id", eventId); // Assuming the `tour_event_id` column exists in the `tourists` table

    if (touristError) {
      throw new Error("Failed to fetch tourists: " + touristError.message);
    }

    // Combine the event and tourists data
    return {
      ...eventData,
      tours: eventData.tours ? (Array.isArray(eventData.tours) ? eventData.tours[0] : eventData.tours) : null,
      tourists: touristData || [], // Include the fetched tourists data
    };
  } catch (error) {
    console.error("Error fetching tour event details:", error);
    throw error;
  }
};

// Archive Tour Event
export const archiveTourEvent = async (eventId: string) => {
  const { error } = await supabase
    .from("tour_events")
    .update({ archived: true })
    .eq("id", eventId);

  if (error) {
    throw new Error("Failed to archive event");
  }

  return { success: true };
};

// Unarchive Tour Event
export const unarchiveTourEvent = async (eventId: string) => {
  const { error } = await supabase
    .from("tour_events")
    .update({ archived: false })
    .eq("id", eventId);

  if (error) {
    throw new Error("Failed to unarchive tour event: " + error.message);
  }

  return { success: true, message: "Tour event unarchived successfully" };
};

// Update Tour Event Tourists ONLY
export const updateTourEventTourist = async (eventId: string, tourists: Tourist[]) => {
  try {
    // Assuming 'tourists' contains 'id', we want to update existing tourists and upsert new ones
    const { success, message } = await saveTourists(tourists, eventId);
    if (!success) {
      return { success: false, message };
    }

    return { success: true, message: "Tourist information updated successfully." };
  } catch (error) {
    console.error("Unexpected error updating tourists:", error);
    return { success: false, message: "Unexpected error." };
  }
};


// Create the Tour Event
export const createTourEvent = async (eventName: string, dateFrom: string, dateTo: string, selectedTour: string | null, tourists: Tourist[]) => {
  const { data: eventData, error: eventError } = await supabase
    .from("tour_events")
    .insert([
      {
        event_name: eventName,
        date_from: dateFrom,
        date_to: dateTo,
        tour_id: selectedTour,
      },
    ])
    .select("id");

  if (eventError) {
    console.error("Error creating tour event:", eventError.message);
    return { success: false, message: "Error creating tour event." };
  }

  // Save tourists and link them to the created event
  const { success, message } = await saveTourists(tourists, eventData[0].id);
  if (!success) {
    return { success: false, message };
  }

  return { success: true, eventId: eventData[0].id }; // Return event ID for further processing
};

// Save Tourists
export const saveTourists = async (tourists: Tourist[], eventId: string) => {
  // Fetch existing tourists for this event
  const { data: existingTourists, error: existingTouristsError } = await supabase
    .from("tourists")
    .select("id")
    .eq("tour_event_id", eventId);

  if (existingTouristsError) {
    console.error("Error fetching existing tourists:", existingTouristsError.message);
    return { success: false, message: "Error fetching existing tourists." };
  }

  // Filter out tourists that are already associated with this event
  const existingTouristIds = existingTourists.map((tourist: any) => tourist.id);

  // Check which tourists need to be updated (those with matching `id`)
  const touristsToUpdate = tourists.filter((tourist) => existingTouristIds.includes(tourist.id));
  
  // Check which tourists are new (those without `id` or not present in existing tourists)
  const touristsToAdd = tourists.filter((tourist) => !existingTouristIds.includes(tourist.id));

  // First, upsert new tourists
  if (touristsToAdd.length > 0) {
    const { data: touristsData, error: touristsError } = await supabase
      .from("tourists")
      .upsert(
        touristsToAdd.map((tourist) => ({
          ...(tourist.id ? { id: tourist.id } : {}), // Include ID only if it exists
          name: tourist.name,
          email: tourist.email,
          country: tourist.country,
          notes: tourist.notes,
          tour_event_id: eventId,
        }))
      )
      .select("id");

    if (touristsError) {
      console.error("Error saving tourists:", touristsError.message);
      return { success: false, message: "Error saving new tourists." };
    }
  }

  // Then, update existing tourists' fields
  if (touristsToUpdate.length > 0) {
    const { data: updatedTourists, error: updateError } = await supabase
      .from("tourists")
      .upsert(
        touristsToUpdate.map((tourist) => ({
          id: tourist.id, // Ensure `id` is included for updates
          name: tourist.name,
          email: tourist.email,
          country: tourist.country,
          notes: tourist.notes,
          tour_event_id: eventId,
        }))
      )
      .select("id");

    if (updateError) {
      console.error("Error updating tourists:", updateError.message);
      return { success: false, message: "Error updating existing tourists." };
    }
  }

  return { success: true };
};



// Link Tourists to the Event (this step is now redundant with the direct `tour_event_id` in the tourists table, but keeping it for reference)
export const linkTouristsToEvent = async (eventId: string, touristsData: any[]) => {
  const touristLinks = touristsData.map((tourist) => ({
    tour_event_id: eventId,
    tourist_id: tourist.id,
  }));

  const { error: linkError } = await supabase
    .from("tour_event_tourist")
    .upsert(touristLinks);

  if (linkError) {
    console.error("Error linking tourists to event:", linkError.message);
    return { success: false, message: "Error linking tourists to event." };
  }

  return { success: true, message: "Tourists linked to event successfully." };
};

export const deleteTourist = async (touristId: string) => {
  const { error } = await supabase
    .from("tourists")
    .delete()
    .eq("id", touristId);

  if (error) throw new Error("Failed to delete tourist");

  return { success: true };
};


