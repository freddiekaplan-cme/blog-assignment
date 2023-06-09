import BlogEditor from "@/components/blog-editor";
import { createSlug } from "@/utils/createSlug";
import { addPost } from "../../api-routes/posts";
import { useRouter } from "next/router";


export default function CreatePost() {
  const router = useRouter();
  const handleOnSubmit = ({ editorContent, titleInput, image }) => {
    const newPostSlug = createSlug(titleInput).toLowerCase();
    addPost({ editorContent, titleInput, image, newPostSlug });
    
    console.log("Add Post", { editorContent, titleInput, image, newPostSlug });
    
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
