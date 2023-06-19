import BlogEditor from "@/components/blog-editor";
import useSWRMutation from "swr/mutation";
import { createSlug } from "@/utils/createSlug";
import { addPost } from "../../api-routes/posts";
import { cacheKey } from "../blog";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

export default function CreatePost() {
  const router = useRouter();
  const user = useUser();
  const { trigger: createTrigger } = useSWRMutation(cacheKey, addPost);

  const handleOnSubmit = async ({ editorContent, titleInput, image }) => {
    const newPostSlug = createSlug(titleInput);

    const newPost = {
      title:titleInput,
      body:editorContent,
      slug: newPostSlug,
      user_id: user.id,
      image,
    }

    const { error, status} = await createTrigger(newPost)

    // addPost({ editorContent, titleInput, image, newPostSlug, user_id: user.id });    
    return router.push(`/blog/${newPostSlug}`);
  };  

  return (
    <BlogEditor
      heading="Create post"
      onSubmit={handleOnSubmit}
      buttonText="Upload post"
    />
  );
}
