import { supabase } from "@/lib/supabaseClient";

export const getUser = async (_, { arg: id }) => {
  console.log("id i users " + id);

    const { data, error, status } = await supabase
      .from("users")
      .select("*")
      .single()
      .eq("id", id)
  
    console.log(data);

    return { error, status, data };

// const {
//   data: userData,
//   error: userError,
//   status: userStatus,
// } = await supabase
//   .from("users")
//   .select("email")
//   .single()
//   .eq("id", userId);

// if (userData) {
//   const { email } = await userData;
//   return { error, status, data: { post: latestPost, userId, email } };
// }

};
