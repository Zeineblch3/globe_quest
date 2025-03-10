import { supabase } from "@/lib/supbase";


export const fetchTours = async () => {
  const { data, error } = await supabase
    .from('tours')
    .select('id, name, description, photo_urls, tripAdvisor_link, latitude, longitude, price');
  
  if (error) {
    console.error('Error fetching tours:', error);
    return { data: [], error };
  }

  return { data, error: null };
};
