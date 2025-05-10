import { supabase } from "@/lib/supbase";

export const fetchTours = async () => {
  const { data, error } = await supabase.from('tours').select('*');
  if (error) {
    console.error('Error fetching tours:', error.message);
    return { error };
  }
  return { data };
};

export const createTour = async (newTour: any) => {
  const { data, error } = await supabase.from('tours').insert([newTour]);
  if (error) {
    console.error('Error creating tour:', error.message);
    return { error };
  }
  return { data };
};

export const updateTour = async (updatedTour: any, tourId: string) => {
  const { data, error } = await supabase
    .from('tours')
    .update(updatedTour)
    .eq('id', tourId);
  if (error) {
    console.error('Error updating tour:', error.message);
    return { error };
  }
  return { data };
};

export const deleteTour = async (tourId: string) => {
  const { data, error } = await supabase.from('tours').delete().eq('id', tourId);
  return { data, error }; // No throwing or logging here
};


export const archiveTour = async (tourId: string) => {
  const { data, error } = await supabase
    .from('tours')
    .update({ archived: true })
    .eq('id', tourId);
  if (error) {
    console.error('Error archiving tour:', error.message);
    return { error };
  }
  return { data };
};
