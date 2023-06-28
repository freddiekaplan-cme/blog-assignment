import { supabase } from "@/lib/supabaseClient";

export const getUser = async (id) => {
  const { data, error, status } = await supabase
    .from("users")
    .select("*")
    .single()
    .eq("id", id);

  return { error, status, data };
};

export const updateUser = async (_, { arg: updatedUser }) => {
  const updateUser = updatedUser.arg;
  const { name, info, id } = updateUser;

  const update = {};

  if (name !== undefined && name !== "") {
    update.name = name;
  }

  if (info !== undefined && info !== "") {
    update.info = info;
  }

  const { data, error, status } = await supabase
    .from("users")
    .update(update)
    .select("*")
    .eq("id", id)
    .single();

  return { error, status, data };
};
