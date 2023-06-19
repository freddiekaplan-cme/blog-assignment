import { supabase } from "@/lib/supabaseClient";
import { uploadImage } from "../utils/uploadImage";

export const getPosts = () => {
  //Handle get all posts
};

//_, { arg: newPost }
export const addPost = async (_, { arg: newPost }) => {
  let image = ""

  if (newPost?.image) {
    const { publicUrl, error } = await uploadImage(newPost?.image)

    if (!error) {
      image = publicUrl
    }
  }
    // create function that take sin th uploaded image from the client
    // upload it to bucket
    // get the public filename

  // TEMP UTKOMMENTERAT:
  // try {
	  const { data, error, status } = await supabase
      .from("blog-data")
      .insert(...newPost, image)
      .select()
      .single()
    return  { data, error, status }

      // {
      //   title: titleInput,
      //   slug: newPostSlug,
      //   body: editorContent,
      //   user_id: user_id,
      // }
    

  
	//   if (error) {
	// 	return { error: 'Something has gone wrong.' };
	//   }
  
	//   return { data, status, error };
	// } catch (error) {
	//   console.log(error);
	// }
};

export const removePost = async (id) => {
  const { error, status } = await supabase
  .from("blog-data")
  .delete()
  .single()
  .eq("id", id);

  return { error, status };
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

export const editPost = async ({ _, arg: updatedPost, slug }) => {
  let image  = updatedPost?.image ?? "";

  const isNewImage = typeof image === "object" && image !== null;

  if (isNewImage) {
    const { publicUrl, error } = await uploadImage(newPost?.image)
  }

  if (!error) {
    image = publicUrl;
  }


  const { data, error, status } = await supabase
    .from("blog-data")
    .update(...updatedPost, image)
    .eq("id", updatedPost.id)
    .select()
    .single();
    // .eq("slug", slug);

  console.log(updatedPost.title);

  if (error) {
    return { error, data, status };
  }

  return { data, status, error };
};

