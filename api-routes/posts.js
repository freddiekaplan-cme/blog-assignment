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

export const editPost = async ({ editorContent, titleInput, image, slug }) => {
  const { data, error, status } = await supabase
  .from("blog-data")
  .update(
    {
      title: titleInput,
      body: editorContent
    }
  )
  .select()
  .eq("slug", slug)

  if (error) {
    return { error, data, status };
  }

  return { data, status, error };
};
