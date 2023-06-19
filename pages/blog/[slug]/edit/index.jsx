import { useRouter } from "next/router";
import BlogEditor from "../../../../components/blog-editor";
import useSWR from "swr"
import useSWRMutation from "swr/mutation";
import { getPost, editPost } from "../../../../api-routes/posts";
import {createSlug} from "../../../../utils/createSlug"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { uploadImage } from "../../../../utils/uploadImage";

const editPostsCacheKey = "/editpost"

export default function EditBlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const {data: {data = {}} = {}, error, isLoading }= useSWR(slug ? `${editPostsCacheKey}${slug}`: null, () =>
   getPost({slug}));

  const { trigger: editTrigger } = useSWRMutation(editPostsCacheKey, editPost);

  const handleOnSubmit = async ({ editorContent, titleInput, image }) => {
  const slug = createSlug(titleInput)
  
  const updatedPost = { title:titleInput,
    body:editorContent,
    slug: slug,
    id: data.id,
    image,
   }

    const { error, status} = await editTrigger(updatedPost)
               
    console.log({ editorContent, titleInput, image, slug });
    

    router.push(`/blog/${slug}`);
  };
  
  if (isLoading) {
    return 'loading....';
  }
  
  return (
    <BlogEditor
      heading="Edit blog post"
      title={data.title}
      src={data.image}
      alt={data.title}
      content={data.body}
      buttonText="Save changes"
      onSubmit={handleOnSubmit}
    />
  );
}

   export const getServerSideProps = async (ctx) => {
     const supabase = createPagesServerClient(ctx)
     const {slug} = ctx.params;
     const { data: { session }, 
   } = await supabase.auth.getSession()
   const {data} = await supabase.from('blog-data').select().single().eq('slug', slug)
   console.log(data)
   const isAuthor = data.user_id === session.user.id;
   console.log({isAuthor})
   if(!isAuthor) {
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

// import { useRouter } from "next/router";
// import BlogEditor from "../../../../components/blog-editor";
// import { getBlogPost } from "../../../api";
// import { editPost } from "../../../../api-routes/posts";
// import useSWR from "swr";
// import useSWRMutation from "swr/mutation";
// // import { title } from "process";
// import {createSlug} from "../../../../utils/createSlug"
// import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

// const editPostsCacheKey = "/editpost"

// // const mockData = {
// //   title: "Community-Messaging Fit",
// //   body: "<p>This is a good community fit!</p>",
// //   image:
// //     "https://media.wired.com/photos/598e35fb99d76447c4eb1f28/16:9/w_2123,h_1194,c_limit/phonepicutres-TA.jpg",
// // };

// export default function EditBlogPost() {
//   const router = useRouter();
//   const { slug } = router.query; 

//   // const { trigger: editTrigger} = useSWRMutation(cacheKey, editPost);

//   // const { 
//   //   data: { data: post = {} },
//   //   error,
//   //   isLoading,
//   // } = useSWR(slug ? cacheKey : null, () => 
//   //   getBlogPost({ slug })
//   //   )

//   const {data: {data = {}} = {}, error, isLoading }= useSWR(slug ? `${editPostsCacheKey}${slug}`: null, () =>
//   getBlogPost({slug}));

//   const { trigger: editBlogPostTrigger } = useSWRMutation(
//     editPostsCacheKey,
//     editPost
//   );

//   // const post = data.data;

//   const handleOnSubmit = async ({ editorContent, titleInput, image }) => {
//     const updatedSlug = createSlug(titleInput);
    
//     const updatedPost = {
//       id: data.id,
//       body: editorContent,
//       title: titleInput,
//       slug: updatedSlug,
//       image,
//     };

//     // OBS
//     // let image = updatedPost?.image ?? "";

//     const { error, status } = await editBlogPostTrigger(updatedPost);
//       // {
//       //   id: post.id,
//       //   body: editorContent,
//       //   title: titleInput,
//       //   slug: updatedSlug,
//       // }
//     // );
    
//     // const { error, status} = await editTrigger({ updatedPost })

//     router.push(`/blog/${updatedSlug}`);

//     if (error) {
//       return <div>Error loading blog data</div>;
//     }
  
//     if (isLoading) {
//       return <div>Loading blog data...</div>;
//     }
//   };

//   return (
//     <BlogEditor
//       heading="Edit blog post"
//       title={data.title}
//       src={data.image}
//       alt={data.title}
//       content={data.body}
//       buttonText="Save changes"
//       onSubmit={handleOnSubmit}
//     />
//   );
// }

// export const getServerSideProps = async (ctx) => {
//   const supabase = createPagesServerClient();
//   const { slug } = ctx.params;

//   const { 
//     data: { session },
//    } = await supabase.auth.getSession();

//    const { data } = await supabase
//     .from("blog-data")
//     .select()
//     .single()
//     .eq("slug", slug);

//     const isAuthor = data.user_id === session.user.id;

//     if (!isAuthor) {
//       return {
//         redirect: {
//           destination: `/blog/${slug}`,
//           permanent: true,
//         }
//       }
//     }

//    return {
//     props: {},
//    }
// }