import { supabase } from "@/lib/supabaseClient";

export const commentReplyCacheKey = "/api/blogs";

export const getReplies = async (id) => {
  const { data, error, status } = await supabase
    .from("replies")
    .select("*")
    .eq("comment_id", id);

  return { data, error, status };
};

export const addReply = async (_, { arg: newReply }) => {
  const { data, error, status } = await supabase
    .from("replies")
    .insert(newReply.arg);

  return { data, error, status };
};

export const removeReply = async (_, { arg: id }) => {
  const { data, error, status } = await supabase
    .from("replies")
    .delete()
    .eq("id", id);

  return { data, error, status };
};
