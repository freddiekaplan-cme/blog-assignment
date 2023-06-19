import { useRouter } from "next/router";
import BlogEditor from "../../../../components/blog-editor";
import { getBlogPost } from "../../../api";
import { editPost } from "../../../../api-routes/posts";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
// import { title } from "process";
import {createSlug} from "../../../../utils/createSlug"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

const cacheKey = "blogPost";

const mockData = {
  title: "Community-Messaging Fit",
  body: "<p>This is a good community fit!</p>",
  image:
    "https://media.wired.com/photos/598e35fb99d76447c4eb1f28/16:9/w_2123,h_1194,c_limit/phonepicutres-TA.jpg",
};

export default function EditBlogPost() {
let image = updatedPost?.image ?? "";

  const router = useRouter();
  const { slug } = router.query; 
  // const { trigger: editTrigger} = useSWRMutation(cacheKey, editPost);

  // const { 
  //   data: { data: post = {} },
  //   error,
  //   isLoading,
  // } = useSWR(slug ? cacheKey : null, () => 
  //   getBlogPost({ slug })
  //   )

  const {data: {data: post = {} } = {}, error, isLoading } = useSWR(slug ? cacheKey : null, () =>
  getBlogPost({ slug }));

  console.log("post", post);

  const { trigger: editBlogPostTrigger } = useSWRMutation(
    cacheKey,
    editPost
  );

  // const post = data.data;

  const handleOnSubmit = async ({ editorContent, titleInput, image }) => {
    // editPost({ editorContent, titleInput, image, slug });

    const updatedSlug = createSlug(titleInput);

    // console.log({ editorContent, titleInput, image, slug });
    
    const updatedPost = {
      id: post.id,
      body: editorContent,
      title: titleInput,
      slug: updatedSlug,
      image,
    };

    const { data, error } = await editBlogPostTrigger(updatedPost);
      // {
      //   id: post.id,
      //   body: editorContent,
      //   title: titleInput,
      //   slug: updatedSlug,
      // }
    // );
    
    // const { error, status} = await editTrigger({ updatedPost })

    
    router.push(`/blog/${updatedSlug}`);



  };

  if (error) {
    return <div>Error loading blog data</div>;
  }

  if (isLoading) {
    return <div>Loading blog data...</div>;
  }

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

export const getServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient();
  const { slug } = ctx.params;

  const { 
    data: { session },
   } = await supabase.auth.getSession();

   const { data } = await supabase
    .from("blog-data")
    .select("user_id")
    .single()
    .eq("slug", slug);

    const isAuthor = data.user_id === session.user.id;

    if (!isAuthor) {
      return {
        redirect: {
          destination: `/blog/${slug}`,
          permanent: true,
        }
      }
    }

   return {
    props: {},
   }
}