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
        // created_at: timestamptz,
        body: editorContent
      }
    )
		// .eq("slug", slug)
		// .single();
  
		console.log("addPost", titleInput, newPostSlug, editorContent);

	  if (error) {
		return { error: 'Something has gone wrong.' };
	  }
  
	  return { data, status, error };
	} catch (error) {
	  console.log(error);
	}
};

export const removePost = () => {
  //Handle remove post here
};

export const editPost = () => {
  //Handle edit post here
};
