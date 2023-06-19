import { supabase } from "@/lib/supabaseClient";
import { uploadImage } from "../utils/uploadImage";

export const getPosts = async () => {
  const { data, error, status } = await supabase
  .from("blog-data")
  .select('*')

  return { error, status, data  }
};

export const getPost = async ({ slug }) => {
  const { data, error, status } = await supabase
  .from("blog-data")
  .select('*')
  .single()
  .eq("slug", slug );

  return { error, status, data }; 
}

// let getLatestUserId = "";

// export const latestPost = async () => {
//   const { data, error, status } = await supabase
//   .from("blog-data")
//   .select('*')
//   .order('createdAt', { ascending: false })
//   .limit(1);

//   getLatestUserId = data[0].id;
//   console.log("latest post", getLatestUserId)

//   return { error, status, data }; 
// }

export const latestPost = async () => {
  try {
    const { data: posts, error, status } = await supabase
      .from("blog-data")
      .select('*')
      .order('createdAt', { ascending: false })
      .limit(1);

    if (posts && posts.length > 0) {
      const latestPost = posts[0];
      const userId = latestPost.user_id;

      const { data: userData, error: userError, status: userStatus } = await supabase
        .from("users")
        .select('email')
        .single()
        .eq("id", userId);

      if (userData) {
        const { email } = await userData;
        return { error, status, data: { post: latestPost, userId, email } };
      }
    }

    return { error, status, data: null };
  } catch (error) {
    return { error: error.message, status: 500, data: null };
  }
};


// export const latestPostUser = async () => {
//   const { data, error, status } = await supabase
//   .from("users")
//   .select('*')
//   .single()
//   .eq("id", getLatestUserId)

//   console.log("latestPostUser: ", data)

//   return { error, status, data }; 
// }

export const addPost = async (_, { arg: newPost }) => {
  let image = ""

  if (newPost?.image) {
    const { publicUrl, error } = await uploadImage(newPost?.image)

    if (!error) {
      image = publicUrl
    }
  }

	  const { data, error, status } = await supabase
      .from("blog-data")
      .insert({...newPost, image})
      .select()
      .single()
    return  { data, error, status }
};

export const removePost = async (_, { arg: id  }) => {
  const { error, status } = await supabase
  .from("blog-data")
  .delete()
  .single()
  .eq("id", id);

  return { error, status, data };
};

// export const editPost = async ({ _, arg: updatedPost }) => {
//   const { data, error, status } = await supabase
//   .from("blog-data")
//   .update(updatedPost)
//   .select()
//   .eq("slug", slug)

//     console.log(titleInput)

//   if (error) {
//     return { error, data, status };
//   }

//   return { data, status, error };
// };

export const editPost = async (_, {arg: updatedPost}) => {
  let image  = updatedPost?.image ?? "";

  const isNewImage = typeof image === "object" && image !== null;

  if (isNewImage) {
    const { publicUrl, error } = await uploadImage(updatedPost?.image)

    if (!error) {
      image = publicUrl;
    }
  }

  const { data, error, status } = await supabase
    .from("blog-data")
    .update({...updatedPost, image})
    .eq("id", updatedPost.id)
    .select()
    .single();
  
  if (error) {
    return { error, data, status };
  }

  return { data, status, error };
};

