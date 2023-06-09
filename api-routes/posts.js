import { supabase } from "@/lib/supabaseClient";

export const getPosts = () => {
  //Handle get all posts
};

export const addPost = async ({ editorContent, titleInput, image, newPostSlug }) => {
  try {
	  const { data, error, status } = await supabase
		.from("blog-data")
		.insert(
      {
        title: titleInput,
        slug: newPostSlug,
        body: editorContent
      }
    )
  
	  if (error) {
		return { error: 'Something has gone wrong.' };
	  }
  
	  return { data, status, error };
	} catch (error) {
	  console.log(error);
	}
};

export const removePost = async (id) => {
  const { error, status } = await supabase
  .from("blog-data")
  .delete()
  .single()
  .eq("id", id);
  
  return { error, status };
};

export const editPost = () => {
  //Handle edit post here
};
