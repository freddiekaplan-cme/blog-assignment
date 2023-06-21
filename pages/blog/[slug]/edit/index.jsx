import { useRouter } from "next/router";
import BlogEditor from "../../../../components/blog-editor";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { getPost, editPost } from "../../../../api-routes/posts";
import { createSlug } from "../../../../utils/createSlug";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

const editPostsCacheKey = "/editpost";

export default function EditBlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const {
    data: { data = {} } = {},
    error,
    isLoading,
  } = useSWR(slug ? `${editPostsCacheKey}${slug}` : null, () =>
    getPost({ slug })
  );

  const { trigger: editTrigger } = useSWRMutation(editPostsCacheKey, editPost);

  const handleOnSubmit = async ({ editorContent, titleInput, image }) => {
    const slug = createSlug(titleInput);

    const updatedPost = {
      title: titleInput,
      body: editorContent,
      slug: slug,
      id: data.id,
      image,
    };

    const { error, status } = await editTrigger(updatedPost);

    router.push(`/blog/${slug}`);
  };

  if (isLoading) {
    return "loading....";
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
  const supabase = createPagesServerClient(ctx);
  const { slug } = ctx.params;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data } = await supabase
    .from("blog-data")
    .select()
    .single()
    .eq("slug", slug);
  const isAuthor = data.user_id === session.user.id;
  if (!isAuthor) {
    return {
      redirect: {
        destination: `/blog/${slug}`,
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
};
