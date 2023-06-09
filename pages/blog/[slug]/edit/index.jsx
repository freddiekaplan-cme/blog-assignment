import { useRouter } from "next/router";
import BlogEditor from "../../../../components/blog-editor";
import { getBlogPost } from "../../../api";
import { editPost } from "../../../../api-routes/posts";
import useSWR from "swr";

const cacheKey = "blogPost";

const mockData = {
  title: "Community-Messaging Fit",
  body: "<p>This is a good community fit!</p>",
  image:
    "https://media.wired.com/photos/598e35fb99d76447c4eb1f28/16:9/w_2123,h_1194,c_limit/phonepicutres-TA.jpg",
};

export default function EditBlogPost() {

  const router = useRouter();
  const { slug } = router.query;

  const { data, error } = useSWR(slug ? cacheKey : null, () => 
    getBlogPost({ slug })
  );

  //Gör om errors
  if (error) {
    return <div>Error loading blog data</div>;
  }

  if (!data) {
    return <div>Loading blog data...</div>;
  }

  const post = data.data;

  const handleOnSubmit = ({ editorContent, titleInput, image }) => {
    editPost({ editorContent, titleInput, image, slug });
    router.push(`/blog/${slug}`);
  };

  return (
    <BlogEditor
      heading="Edit blog post"
      title={post.title}
      src={post.image}
      alt={post.title}
      content={post.body}
      buttonText="Save changes"
      onSubmit={handleOnSubmit}
    />
  );
}
