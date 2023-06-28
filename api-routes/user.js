import { supabase } from "@/lib/supabaseClient";

export const getUser = async (id) => {
  const { data, error, status } = await supabase
    .from("users")
    .select("*")
    .single()
    .eq("id", id);

  return { error, status, data };
};
