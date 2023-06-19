import BlogEditor from "@/components/blog-editor";
import { createSlug } from "@/utils/createSlug";
import { addPost } from "../../api-routes/posts";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";

export default function CreatePost() {
  const router = useRouter();
  const user = useUser();

  const handleOnSubmit = ({ editorContent, titleInput, image }) => {
    const newPostSlug = createSlug(titleInput).toLowerCase();
    addPost({ editorContent, titleInput, image, newPostSlug, user_id: user.id });    
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
